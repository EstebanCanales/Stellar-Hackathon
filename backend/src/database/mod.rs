use sqlx::{SqlitePool, migrate::MigrateDatabase, Sqlite, Row};
use anyhow::Result;
use uuid::Uuid;
use chrono::{Utc, DateTime};

use crate::models::{
    User, Community, Donation, Delivery, 
    CreateDonationRequest, ValidateDeliveryRequest,
    UserType, VerificationStatus, DonationStatus
};

#[derive(Clone)]
pub struct Database {
    pool: SqlitePool,
}

impl Database {
    pub async fn new(database_url: &str) -> Result<Self> {
        // Crear base de datos si no existe
        if !Sqlite::database_exists(database_url).await.unwrap_or(false) {
            Sqlite::create_database(database_url).await?;
        }

        let pool = SqlitePool::connect(database_url).await?;
        
        // Ejecutar migraciones
        sqlx::migrate!("./migrations").run(&pool).await?;
        
        Ok(Database { pool })
    }

    // Operaciones de Usuario
    pub async fn create_user(&self, stellar_public_key: &str, user_type: UserType, name: &str, email: Option<&str>) -> Result<User> {
        let user_id = Uuid::new_v4();
        let user_id_str = user_id.to_string();
        let now = Utc::now();
        let user_type_str = match user_type {
            UserType::ONG => "ONG",
            UserType::Community => "Community",
            UserType::Representative => "Representative",
            UserType::Validator => "Validator",
        };
        
        sqlx::query(
            "INSERT INTO users (id, stellar_public_key, user_type, name, email, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&user_id_str)
        .bind(stellar_public_key)
        .bind(user_type_str)
        .bind(name)
        .bind(email)
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(User {
            id: user_id,
            stellar_public_key: stellar_public_key.to_string(),
            user_type,
            name: name.to_string(),
            email: email.map(|s| s.to_string()),
            created_at: now,
            updated_at: now,
        })
    }

    pub async fn get_user_by_stellar_key(&self, stellar_key: &str) -> Result<Option<User>> {
        let row = sqlx::query(
            "SELECT id, stellar_public_key, user_type, name, email, created_at, updated_at FROM users WHERE stellar_public_key = ?"
        )
        .bind(stellar_key)
        .fetch_optional(&self.pool)
        .await?;

        if let Some(row) = row {
            let user_type = match row.get::<String, _>("user_type").as_str() {
                "ONG" => UserType::ONG,
                "Community" => UserType::Community,
                "Representative" => UserType::Representative,
                "Validator" => UserType::Validator,
                _ => return Err(anyhow::anyhow!("Unknown user type")),
            };

            Ok(Some(User {
                id: Uuid::parse_str(&row.get::<String, _>("id"))?,
                stellar_public_key: row.get("stellar_public_key"),
                user_type,
                name: row.get("name"),
                email: row.get("email"),
                created_at: row.get::<DateTime<Utc>, _>("created_at"),
                updated_at: row.get::<DateTime<Utc>, _>("updated_at"),
            }))
        } else {
            Ok(None)
        }
    }

    // Operaciones de Comunidad
    pub async fn create_community(&self, name: &str, location: &str, description: &str, representative_id: Uuid, stellar_public_key: &str) -> Result<Community> {
        let community_id = Uuid::new_v4();
        let community_id_str = community_id.to_string();
        let representative_id_str = representative_id.to_string();
        let now = Utc::now();
        
        sqlx::query(
            "INSERT INTO communities (id, name, location, description, representative_id, stellar_public_key, verification_status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&community_id_str)
        .bind(name)
        .bind(location)
        .bind(description)
        .bind(&representative_id_str)
        .bind(stellar_public_key)
        .bind("Pending")
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(Community {
            id: community_id,
            name: name.to_string(),
            location: location.to_string(),
            description: description.to_string(),
            representative_id,
            stellar_public_key: stellar_public_key.to_string(),
            verification_status: VerificationStatus::Pending,
            created_at: now,
            updated_at: now,
        })
    }

    pub async fn get_communities(&self) -> Result<Vec<Community>> {
        let rows = sqlx::query(
            "SELECT id, name, location, description, representative_id, stellar_public_key, verification_status, created_at, updated_at FROM communities ORDER BY created_at DESC"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut communities = Vec::new();
        for row in rows {
            let verification_status = match row.get::<String, _>("verification_status").as_str() {
                "Pending" => VerificationStatus::Pending,
                "Verified" => VerificationStatus::Verified,
                "Rejected" => VerificationStatus::Rejected,
                _ => return Err(anyhow::anyhow!("Unknown verification status")),
            };

            communities.push(Community {
                id: Uuid::parse_str(&row.get::<String, _>("id"))?,
                name: row.get("name"),
                location: row.get("location"),
                description: row.get("description"),
                representative_id: Uuid::parse_str(&row.get::<String, _>("representative_id"))?,
                stellar_public_key: row.get("stellar_public_key"),
                verification_status,
                created_at: row.get::<DateTime<Utc>, _>("created_at"),
                updated_at: row.get::<DateTime<Utc>, _>("updated_at"),
            });
        }

        Ok(communities)
    }

    // Operaciones de Donación
    pub async fn create_donation(&self, request: CreateDonationRequest, donor_id: Uuid, contract_address: &str, escrow_address: &str) -> Result<Donation> {
        let donation_id = Uuid::new_v4();
        let donation_id_str = donation_id.to_string();
        let donor_id_str = donor_id.to_string();
        let community_id_str = request.community_id.to_string();
        let now = Utc::now();
        
        sqlx::query(
            "INSERT INTO donations (id, donor_id, community_id, amount, description, conditions, contract_address, escrow_address, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&donation_id_str)
        .bind(&donor_id_str)
        .bind(&community_id_str)
        .bind(request.amount)
        .bind(&request.description)
        .bind(&request.conditions)
        .bind(contract_address)
        .bind(escrow_address)
        .bind("Created")
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(Donation {
            id: donation_id,
            donor_id,
            community_id: request.community_id,
            amount: request.amount,
            description: request.description,
            conditions: request.conditions,
            stellar_transaction_hash: None,
            contract_address: contract_address.to_string(),
            escrow_address: escrow_address.to_string(),
            status: DonationStatus::Created,
            created_at: now,
            updated_at: now,
        })
    }

    pub async fn get_donations(&self) -> Result<Vec<Donation>> {
        let rows = sqlx::query(
            "SELECT id, donor_id, community_id, amount, description, conditions, stellar_transaction_hash, contract_address, escrow_address, status, created_at, updated_at FROM donations ORDER BY created_at DESC"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut donations = Vec::new();
        for row in rows {
            let status = match row.get::<String, _>("status").as_str() {
                "Created" => DonationStatus::Created,
                "InEscrow" => DonationStatus::InEscrow,
                "Validated" => DonationStatus::Validated,
                "Delivered" => DonationStatus::Delivered,
                "Completed" => DonationStatus::Completed,
                "Disputed" => DonationStatus::Disputed,
                "Cancelled" => DonationStatus::Cancelled,
                _ => return Err(anyhow::anyhow!("Unknown donation status")),
            };

            donations.push(Donation {
                id: Uuid::parse_str(&row.get::<String, _>("id"))?,
                donor_id: Uuid::parse_str(&row.get::<String, _>("donor_id"))?,
                community_id: Uuid::parse_str(&row.get::<String, _>("community_id"))?,
                amount: row.get("amount"),
                description: row.get("description"),
                conditions: row.get("conditions"),
                stellar_transaction_hash: row.get("stellar_transaction_hash"),
                contract_address: row.get("contract_address"),
                escrow_address: row.get("escrow_address"),
                status,
                created_at: row.get::<DateTime<Utc>, _>("created_at"),
                updated_at: row.get::<DateTime<Utc>, _>("updated_at"),
            });
        }

        Ok(donations)
    }

    pub async fn update_donation_status(&self, donation_id: Uuid, status: DonationStatus, transaction_hash: Option<&str>) -> Result<()> {
        let donation_id_str = donation_id.to_string();
        let status_str = match status {
            DonationStatus::Created => "Created",
            DonationStatus::InEscrow => "InEscrow",
            DonationStatus::Validated => "Validated",
            DonationStatus::Delivered => "Delivered",
            DonationStatus::Completed => "Completed",
            DonationStatus::Disputed => "Disputed",
            DonationStatus::Cancelled => "Cancelled",
        };
        let now = Utc::now();

        sqlx::query(
            "UPDATE donations SET status = ?, stellar_transaction_hash = ?, updated_at = ? WHERE id = ?"
        )
        .bind(status_str)
        .bind(transaction_hash)
        .bind(now)
        .bind(&donation_id_str)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // Operaciones de Entrega
    pub async fn create_delivery(&self, request: ValidateDeliveryRequest, recipient_id: Uuid, representative_id: Uuid) -> Result<Delivery> {
        let delivery_id = Uuid::new_v4();
        let delivery_id_str = delivery_id.to_string();
        let donation_id_str = request.donation_id.to_string();
        let recipient_id_str = recipient_id.to_string();
        let representative_id_str = representative_id.to_string();
        let now = Utc::now();
        
        sqlx::query(
            "INSERT INTO deliveries (id, donation_id, recipient_id, representative_id, goods_received, quantity, delivery_proof, verification_status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(&delivery_id_str)
        .bind(&donation_id_str)
        .bind(&recipient_id_str)
        .bind(&representative_id_str)
        .bind(&request.goods_received)
        .bind(request.quantity)
        .bind(&request.delivery_proof)
        .bind("Pending")
        .bind(now)
        .bind(now)
        .execute(&self.pool)
        .await?;

        Ok(Delivery {
            id: delivery_id,
            donation_id: request.donation_id,
            recipient_id,
            representative_id,
            goods_received: request.goods_received,
            quantity: request.quantity,
            delivery_proof: request.delivery_proof,
            verification_status: VerificationStatus::Pending,
            stellar_transaction_hash: None,
            created_at: now,
            updated_at: now,
        })
    }

    pub async fn get_deliveries(&self) -> Result<Vec<Delivery>> {
        let rows = sqlx::query(
            "SELECT id, donation_id, recipient_id, representative_id, goods_received, quantity, delivery_proof, verification_status, stellar_transaction_hash, created_at, updated_at FROM deliveries ORDER BY created_at DESC"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut deliveries = Vec::new();
        for row in rows {
            let verification_status = match row.get::<String, _>("verification_status").as_str() {
                "Pending" => VerificationStatus::Pending,
                "Verified" => VerificationStatus::Verified,
                "Rejected" => VerificationStatus::Rejected,
                _ => return Err(anyhow::anyhow!("Unknown verification status")),
            };

            deliveries.push(Delivery {
                id: Uuid::parse_str(&row.get::<String, _>("id"))?,
                donation_id: Uuid::parse_str(&row.get::<String, _>("donation_id"))?,
                recipient_id: Uuid::parse_str(&row.get::<String, _>("recipient_id"))?,
                representative_id: Uuid::parse_str(&row.get::<String, _>("representative_id"))?,
                goods_received: row.get("goods_received"),
                quantity: row.get("quantity"),
                delivery_proof: row.get("delivery_proof"),
                verification_status,
                stellar_transaction_hash: row.get("stellar_transaction_hash"),
                created_at: row.get::<DateTime<Utc>, _>("created_at"),
                updated_at: row.get::<DateTime<Utc>, _>("updated_at"),
            });
        }

        Ok(deliveries)
    }
} 