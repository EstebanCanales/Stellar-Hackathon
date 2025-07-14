use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransactionBuilder {
    pub source_account: String,
    pub sequence_number: u64,
    pub fee: u32,
    pub operations: Vec<Operation>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Operation {
    pub operation_type: String,
    pub source_account: Option<String>,
    pub destination: Option<String>,
    pub amount: Option<String>,
    pub asset_code: Option<String>,
    pub asset_issuer: Option<String>,
}

impl TransactionBuilder {
    pub fn new(source_account: String, sequence_number: u64) -> Self {
        TransactionBuilder {
            source_account,
            sequence_number,
            fee: 100,
            operations: Vec::new(),
        }
    }

    pub fn add_payment_operation(&mut self, destination: String, amount: String) -> &mut Self {
        self.operations.push(Operation {
            operation_type: "payment".to_string(),
            source_account: None,
            destination: Some(destination),
            amount: Some(amount),
            asset_code: Some("XLM".to_string()),
            asset_issuer: None,
        });
        self
    }

    pub fn build_xdr(&self) -> Result<String> {
        // Placeholder para generar XDR real
        Ok("dummy_xdr_transaction".to_string())
    }

    pub fn sign(&self, _private_key: &str) -> Result<String> {
        // Placeholder para firmar transacción
        Ok("signed_transaction_xdr".to_string())
    }
} 