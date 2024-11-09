use candid::Principal;
use ic_cdk::api::management_canister::bitcoin::{
    bitcoin_get_balance, bitcoin_get_current_fee_percentiles, bitcoin_get_utxos, bitcoin_send_transaction,
    BitcoinNetwork, GetBalanceRequest, GetCurrentFeePercentilesRequest, GetUtxosRequest, MillisatoshiPerByte,
    SendTransactionRequest, Utxo, UtxoFilter,
};
use ic_cdk::api::management_canister::ecdsa::{
    ecdsa_public_key, sign_with_ecdsa, EcdsaCurve, EcdsaKeyId, EcdsaPublicKeyArgument, SignWithEcdsaArgument,
};
use bitcoin::{Address, Transaction, TxIn, TxOut, Script, OutPoint, SigHashType, network::constants::Network};
use bitcoin::consensus::serialize;
use bitcoin::hashes::Hash;
use bitcoin::hashes::sha256d::Hash as Sha256dHash;

pub struct BitcoinWallet {
    network: BitcoinNetwork,
    key_name: String,
}

impl BitcoinWallet {
    pub fn new(network: BitcoinNetwork) -> Self {
        Self {
            network,
            key_name: "dfx_test_key".to_string(), // Use appropriate key name for production
        }
    }


    pub async fn get_balance(&self, address: &str) -> Result<u64, String> {
        let balance = bitcoin_get_balance(GetBalanceRequest {
            address: address.to_string(),
            network: self.network,
            min_confirmations: None,
        })
        .await
        .map_err(|e| format!("Failed to get balance: {:?}", e))?;

        Ok(balance.0)
    }

    pub async fn get_fee_percentiles(&self) -> Result<Vec<MillisatoshiPerByte>, String> {
        let res = bitcoin_get_current_fee_percentiles(GetCurrentFeePercentilesRequest {
            network: self.network,
        })
        .await
        .map_err(|e| format!("Failed to get fee percentiles: {:?}", e))?;

        Ok(res.0)
    }

    pub async fn get_utxos(
        &self,
        address: &str,
        min_confirmations: Option<u32>,
    ) -> Result<Vec<Utxo>, String> {
        let utxos = bitcoin_get_utxos(GetUtxosRequest {
            address: address.to_string(),
            network: self.network,
            filter: min_confirmations.map(UtxoFilter::MinConfirmations),
        })
        .await
        .map_err(|e| format!("Failed to get UTXOs: {:?}", e))?;

        Ok(utxos.0.utxos)
    }

    pub async fn send_btc(
        &self,
        from_address: &str,
        to_address: &str,
        amount: u64,
    ) -> Result<(), String> {
        // Get UTXOs for the source address
        let utxos = self.get_utxos(from_address, Some(1)).await?;
        if utxos.is_empty() {
            return Err("No UTXOs available".to_string());
        }

        // Get current fee rate
        let fee_percentiles = self.get_fee_percentiles().await?;
        let fee_rate = fee_percentiles
            .get(fee_percentiles.len() / 2)
            .cloned()
            .unwrap_or(2000); // Default to 2 sat/byte if no fee data

        // Calculate transaction size and fee
        let input_count = utxos.len() as u64;
        let output_count = 2u64; // One for recipient, one for change
        let tx_size = self.estimate_tx_size(input_count, output_count);
        let fee = (tx_size as u64 * fee_rate) / 1000; // Convert from millisatoshi to satoshi

        // Calculate total amount needed (including fee)
        let total_needed = amount + fee;

        // Select UTXOs
        let selected_utxos = self.select_utxos(&utxos, total_needed)?;
        let total_input = selected_utxos.iter().map(|utxo| utxo.value).sum::<u64>();

        // Parse addresses
        let to_btc_address = Address::from_str(to_address)
            .map_err(|e| format!("Invalid destination address: {}", e))?;
        let from_btc_address = Address::from_str(from_address)
            .map_err(|e| format!("Invalid source address: {}", e))?;

        // Create transaction
        let mut tx = Transaction {
            version: 1,
            lock_time: 0,
            input: selected_utxos
                .iter()
                .map(|utxo| TxIn {
                    previous_output: OutPoint {
                        txid: utxo.outpoint.txid.clone().into(),
                        vout: utxo.outpoint.vout,
                    },
                    script_sig: Script::new(),
                    sequence: 0xFFFFFFFF,
                    witness: vec![],
                })
                .collect(),
            output: vec![
                TxOut {
                    value: amount,
                    script_pubkey: to_btc_address.script_pubkey(),
                },
                // Change output
                TxOut {
                    value: total_input - amount - fee,
                    script_pubkey: from_btc_address.script_pubkey(),
                },
            ],
        };

        // Sign transaction inputs
        for (i, utxo) in selected_utxos.iter().enumerate() {
            self.sign_input(&mut tx, i, utxo, &from_btc_address)?;
        }

        // Send transaction
        let tx_bytes = bitcoin::consensus::serialize(&tx);
        bitcoin_send_transaction(SendTransactionRequest {
            network: self.network,
            transaction: tx_bytes,
        })
        .await
        .map_err(|e| format!("Failed to send transaction: {:?}", e))?;

        Ok(())
    }

    fn estimate_tx_size(&self, input_count: u64, output_count: u64) -> u64 {
        // P2PKH input size: 148 bytes
        // P2PKH output size: 34 bytes
        // Other tx overhead: ~10 bytes
        const INPUT_SIZE: u64 = 148;
        const OUTPUT_SIZE: u64 = 34;
        const TX_OVERHEAD: u64 = 10;

        input_count * INPUT_SIZE + output_count * OUTPUT_SIZE + TX_OVERHEAD
    }

    fn select_utxos(&self, utxos: &[Utxo], target_amount: u64) -> Result<Vec<Utxo>, String> {
        let mut selected = Vec::new();
        let mut total = 0u64;

        // Sort UTXOs by value, largest first
        let mut sorted_utxos = utxos.to_vec();
        sorted_utxos.sort_by(|a, b| b.value.cmp(&a.value));

        for utxo in sorted_utxos {
            selected.push(utxo);
            total += utxo.value;
            if total >= target_amount {
                return Ok(selected);
            }
        }

        Err("Insufficient funds in UTXOs".to_string())
    }

    async fn sign_input(
        &self,
        tx: &mut Transaction,
        input_index: usize,
        utxo: &Utxo,
        address: &Address,
    ) -> Result<(), String> {
        // Get the ECDSA public key
        let public_key = self.get_public_key().await?;
        
        // Create the sighash
        let sighash = tx.signature_hash(
            input_index,
            &address.script_pubkey(),
            utxo.value,
            SigHashType::All,
        );

        // Sign the transaction hash using IC's ECDSA API
        let signature = self.sign_hash(sighash.as_bytes()).await?;

        // Create the signature script
        let sig_script = Script::builder()
            .push_slice(&signature)
            .push_slice(&public_key)
            .into_script();

        // Set the signature script
        tx.input[input_index].script_sig = sig_script;

        Ok(())
    }

    async fn get_public_key(&self) -> Result<Vec<u8>, String> {
        let key_id = EcdsaKeyId {
            curve: EcdsaCurve::Secp256k1,
            name: self.key_name.clone(),
        };

        let derivation_path = vec![vec![0u8]]; // Simple derivation path, adjust as needed
        
        let public_key = ecdsa_public_key(EcdsaPublicKeyArgument {
            canister_id: None,
            derivation_path: derivation_path.clone(),
            key_id: key_id.clone(),
        })
        .await
        .map_err(|e| format!("Failed to get public key: {:?}", e))?;

        Ok(public_key.0)
    }

    async fn sign_hash(&self, message_hash: &[u8]) -> Result<Vec<u8>, String> {
        let key_id = EcdsaKeyId {
            curve: EcdsaCurve::Secp256k1,
            name: self.key_name.clone(),
        };

        let derivation_path = vec![vec![0u8]]; // Simple derivation path, adjust as needed

        let signature = sign_with_ecdsa(SignWithEcdsaArgument {
            message_hash: message_hash.to_vec(),
            derivation_path,
            key_id,
        })
        .await
        .map_err(|e| format!("Failed to sign message: {:?}", e))?;

        Ok(signature.0)
    }

    fn get_bitcoin_network(&self) -> Network {
        match self.network {
            BitcoinNetwork::Mainnet => Network::Bitcoin,
            BitcoinNetwork::Testnet => Network::Testnet,
            BitcoinNetwork::Regtest => Network::Regtest,
        }
    }

    pub async fn get_or_create_address(&self, principal: &Principal) -> Result<String, String> {
        let public_key = self.get_public_key().await?;
        let network = self.get_bitcoin_network();
        
        // Create P2PKH address from public key
        let address = Address::p2pkh(&public_key.into(), network);
        Ok(address.to_string())
    }
}
