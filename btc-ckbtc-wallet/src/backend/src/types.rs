use candid::{CandidType, Deserialize};

#[derive(CandidType, Deserialize, Clone, Debug)]
pub enum PreferredNetwork {
    Bitcoin,
    CkBTC,
}

#[derive(CandidType, Deserialize)]
pub struct UserPreferences {
    pub preferred_network: PreferredNetwork,
    pub auto_convert: bool,
    pub min_amount: u64,
}

#[derive(CandidType, Deserialize)]
pub struct ConversionRecord {
    pub timestamp: u64,
    pub from_network: PreferredNetwork,
    pub to_network: PreferredNetwork,
    pub amount: u64,
    pub status: ConversionStatus,
}

#[derive(CandidType, Deserialize)]
pub enum ConversionStatus {
    Pending,
    Complete,
    Failed(String),
}
