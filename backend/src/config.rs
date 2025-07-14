use std::env;
use anyhow::Result;

#[derive(Debug, Clone)]
pub struct Config {
    pub port: u16,
    pub database_url: String,
    pub stellar_network: String,
    pub stellar_rpc_url: String,
    pub soroban_rpc_url: String,
    pub contract_donation_id: String,
    pub contract_escrow_id: String,
    pub contract_community_id: String,
    pub jwt_secret: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        Ok(Config {
            port: env::var("PORT")
                .unwrap_or_else(|_| "8000".to_string())
                .parse::<u16>()
                .unwrap_or(8000),
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "sqlite:./verida.db".to_string()),
            stellar_network: env::var("STELLAR_NETWORK")
                .unwrap_or_else(|_| "testnet".to_string()),
            stellar_rpc_url: env::var("STELLAR_RPC_URL")
                .unwrap_or_else(|_| "https://horizon-testnet.stellar.org".to_string()),
            soroban_rpc_url: env::var("SOROBAN_RPC_URL")
                .unwrap_or_else(|_| "https://soroban-testnet.stellar.org".to_string()),
            contract_donation_id: env::var("CONTRACT_DONATION_ID")
                .unwrap_or_else(|_| "".to_string()),
            contract_escrow_id: env::var("CONTRACT_ESCROW_ID")
                .unwrap_or_else(|_| "".to_string()),
            contract_community_id: env::var("CONTRACT_COMMUNITY_ID")
                .unwrap_or_else(|_| "".to_string()),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| "verida-secret-key".to_string()),
        })
    }
} 