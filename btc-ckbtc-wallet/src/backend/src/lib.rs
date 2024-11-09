use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::management_canister::bitcoin::BitcoinNetwork;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;
use ic_cdk::api::time;

mod bitcoin;
mod ckbtc;
mod types;

use bitcoin::BitcoinWallet;
use ckbtc::CkBTCWallet;
use types::{PreferredNetwork, UserPreferences, ConversionRecord, ConversionStatus};

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

struct State {
    bitcoin_wallet: BitcoinWallet,
    ckbtc_wallet: Option<CkBTCWallet>,
    user_preferences: HashMap<Principal, UserPreferences>,
    btc_addresses: HashMap<Principal, String>,
    conversion_history: HashMap<Principal, Vec<ConversionRecord>>,
}

impl Default for State {
    fn default() -> Self {
        Self {
            bitcoin_wallet: BitcoinWallet::new(BitcoinNetwork::Testnet),
            ckbtc_wallet: None,
            user_preferences: HashMap::new(),
            btc_addresses: HashMap::new(),
            conversion_history: HashMap::new(),
        }
    }
}

#[init]
fn init(minter_id: Option<Principal>) {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if let Some(minter_id) = minter_id {
            state.ckbtc_wallet = Some(CkBTCWallet::new(minter_id));
        }
    });
}

#[update]
async fn convert_to_btc() -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    // Get user's ckBTC balance
    let ckbtc_balance = STATE.with(|state| {
        let state = state.borrow();
        if let Some(ref ckbtc_wallet) = state.ckbtc_wallet {
            ckbtc_wallet.get_ckbtc_balance(caller)
        } else {
            Err("ckBTC minter not initialized".to_string())
        }
    })?;
    
    if ckbtc_balance == 0 {
        return Err("No ckBTC balance to convert".to_string());
    }
    
    // Get user's BTC address
    let btc_address = STATE.with(|state| {
        state.borrow()
            .btc_addresses
            .get(&caller)
            .cloned()
            .ok_or_else(|| "BTC address not found".to_string())
    })?;
    
    // Create conversion record
    let record = ConversionRecord {
        timestamp: time(),
        from_network: PreferredNetwork::CkBTC,
        to_network: PreferredNetwork::Bitcoin,
        amount: ckbtc_balance,
        status: ConversionStatus::Pending,
    };
    
    // Add to history
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.conversion_history
            .entry(caller)
            .or_default()
            .push(record.clone());
    });
    
    // Initiate conversion
    match STATE.with(|state| {
        let state = state.borrow();
        if let Some(ref ckbtc_wallet) = state.ckbtc_wallet {
            ckbtc_wallet.retrieve_btc(caller, btc_address.clone(), ckbtc_balance)
        } else {
            Err("ckBTC minter not initialized".into())
        }
    }) {
        Ok(_) => {
            // Update conversion status to complete
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                if let Some(history) = state.conversion_history.get_mut(&caller) {
                    if let Some(last) = history.last_mut() {
                        last.status = ConversionStatus::Complete;
                    }
                }
            });
            Ok(())
        }
        Err(e) => {
            // Update conversion status to failed
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                if let Some(history) = state.conversion_history.get_mut(&caller) {
                    if let Some(last) = history.last_mut() {
                        last.status = ConversionStatus::Failed(e.clone());
                    }
                }
            });
            Err(e)
        }
    }
}

#[update]
async fn convert_to_ckbtc() -> Result<(), String> {
    let caller = ic_cdk::caller();
    
    // Get user's BTC address
    let btc_address = STATE.with(|state| {
        state.borrow()
            .btc_addresses
            .get(&caller)
            .cloned()
            .ok_or_else(|| "BTC address not found".to_string())
    })?;
    
    // Get BTC balance
    let btc_balance = STATE.with(|state| {
        let state = state.borrow();
        state.bitcoin_wallet.get_balance(&btc_address)
    }).await?;
    
    if btc_balance == 0 {
        return Err("No BTC balance to convert".to_string());
    }
    
    // Get ckBTC minter address
    let minter_address = STATE.with(|state| {
        let state = state.borrow();
        if let Some(ref ckbtc_wallet) = state.ckbtc_wallet {
            ckbtc_wallet.get_btc_address(caller)
        } else {
            Err("ckBTC minter not initialized".to_string())
        }
    }).await?;
    
    // Create conversion record
    let record = ConversionRecord {
        timestamp: time(),
        from_network: PreferredNetwork::Bitcoin,
        to_network: PreferredNetwork::CkBTC,
        amount: btc_balance,
        status: ConversionStatus::Pending,
    };
    
    // Add to history
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.conversion_history
            .entry(caller)
            .or_default()
            .push(record.clone());
    });
    
    // Send BTC to minter
    match STATE.with(|state| {
        let state = state.borrow();
        state.bitcoin_wallet.send_btc(&btc_address, &minter_address, btc_balance)
    }).await {
        Ok(_) => {
            // Update conversion status to complete
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                if let Some(history) = state.conversion_history.get_mut(&caller) {
                    if let Some(last) = history.last_mut() {
                        last.status = ConversionStatus::Complete;
                    }
                }
            });
            Ok(())
        }
        Err(e) => {
            // Update conversion status to failed
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                if let Some(history) = state.conversion_history.get_mut(&caller) {
                    if let Some(last) = history.last_mut() {
                        last.status = ConversionStatus::Failed(e.clone());
                    }
                }
            });
            Err(e)
        }
    }
}

// Candid interface generation
ic_cdk::export_candid!();
