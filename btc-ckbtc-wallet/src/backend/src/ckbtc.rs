use candid::Principal;
use ic_cdk::api::call::CallResult;
use ic_ckbtc_minter::{GetBtcAddressRequest, InitArgs, RetrieveBtcArgs, RetrieveBtcOk, RetrieveBtcError};

pub struct CkBTCWallet {
    minter_id: Principal,
}

impl CkBTCWallet {
    pub fn new(minter_id: Principal) -> Self {
        Self { minter_id }
    }

    pub async fn get_btc_address(&self, owner: Principal) -> Result<String, String> {
        let args = GetBtcAddressRequest { owner };
        let result: CallResult<(String,)> = ic_cdk::call(self.minter_id, "get_btc_address", (args,)).await;
        
        result
            .map(|(address,)| address)
            .map_err(|e| format!("Failed to get BTC address: {:?}", e))
    }

    pub async fn retrieve_btc(
        &self,
        owner: Principal,
        address: String,
        amount: u64,
    ) -> Result<RetrieveBtcOk, RetrieveBtcError> {
        let args = RetrieveBtcArgs {
            address,
            amount,
        };
        
        let result: CallResult<(Result<RetrieveBtcOk, RetrieveBtcError>,)> = 
            ic_cdk::call(self.minter_id, "retrieve_btc", (args,)).await
            .map_err(|e| RetrieveBtcError::Other(format!("Call failed: {:?}", e)))?;
            
        result.0
    }

    pub async fn get_ckbtc_balance(&self, owner: Principal) -> Result<u64, String> {
        let result: CallResult<(u64,)> = 
            ic_cdk::call(self.minter_id, "balance_of", (owner,)).await;
            
        result
            .map(|(balance,)| balance)
            .map_err(|e| format!("Failed to get ckBTC balance: {:?}", e))
    }
}
