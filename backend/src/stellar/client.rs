use anyhow::Result;
use reqwest::Client;
use serde_json::Value;

pub struct StellarClient {
    pub horizon_url: String,
    pub soroban_url: String,
    pub client: Client,
}

impl StellarClient {
    pub fn new(horizon_url: String, soroban_url: String) -> Self {
        StellarClient {
            horizon_url,
            soroban_url,
            client: Client::new(),
        }
    }

    pub async fn get_account_info(&self, public_key: &str) -> Result<Value> {
        let url = format!("{}/accounts/{}", self.horizon_url, public_key);
        let response = self.client.get(&url).send().await?;
        let account_info: Value = response.json().await?;
        Ok(account_info)
    }

    pub async fn get_transaction(&self, tx_hash: &str) -> Result<Value> {
        let url = format!("{}/transactions/{}", self.horizon_url, tx_hash);
        let response = self.client.get(&url).send().await?;
        let transaction: Value = response.json().await?;
        Ok(transaction)
    }

    pub async fn submit_transaction(&self, transaction_xdr: &str) -> Result<Value> {
        let url = format!("{}/transactions", self.horizon_url);
        let response = self.client
            .post(&url)
            .form(&[("tx", transaction_xdr)])
            .send()
            .await?;
        let result: Value = response.json().await?;
        Ok(result)
    }
} 