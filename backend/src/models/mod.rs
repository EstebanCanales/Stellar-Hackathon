use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub stellar_public_key: String,
    pub user_type: UserType,
    pub name: String,
    pub email: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum UserType {
    #[serde(rename = "ONG")]
    ONG,
    Community,
    Representative,
    Validator,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Community {
    pub id: Uuid,
    pub name: String,
    pub location: String,
    pub description: String,
    pub representative_id: Uuid,
    pub stellar_public_key: String,
    pub verification_status: VerificationStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Donation {
    pub id: Uuid,
    pub donor_id: Uuid,
    pub community_id: Uuid,
    pub amount: i64, // En stroops (1 XLM = 10^7 stroops)
    pub description: String,
    pub conditions: String,
    pub stellar_transaction_hash: Option<String>,
    pub contract_address: String,
    pub escrow_address: String,
    pub status: DonationStatus,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DonationStatus {
    Created,
    InEscrow,
    Validated,
    Delivered,
    Completed,
    Disputed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Delivery {
    pub id: Uuid,
    pub donation_id: Uuid,
    pub recipient_id: Uuid,
    pub representative_id: Uuid,
    pub goods_received: String,
    pub quantity: i32,
    pub delivery_proof: String, // URL o hash de prueba
    pub verification_status: VerificationStatus,
    pub stellar_transaction_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateDonationRequest {
    pub community_id: Uuid,
    pub amount: i64,
    pub description: String,
    pub conditions: String,
    pub donor_stellar_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidateDeliveryRequest {
    pub donation_id: Uuid,
    pub goods_received: String,
    pub quantity: i32,
    pub delivery_proof: String,
    pub representative_stellar_key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StellarAccount {
    pub public_key: String,
    pub balance: i64,
    pub sequence: String,
    pub account_id: String,
} 