use actix_web::{web, HttpResponse, Result};
use uuid::Uuid;
use log::info;
use serde_json::json;

use crate::database::Database;
use crate::models::*;
use crate::services::*;

// Health check endpoint
pub async fn health_check() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "verida-backend",
        "timestamp": chrono::Utc::now().to_rfc3339()
    })))
}

// Auth handlers
pub async fn auth_login(
    _db: web::Data<Database>,
    _req: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(json!({
        "message": "Login endpoint - not implemented",
        "token": "dummy-jwt-token"
    })))
}

pub async fn auth_register(
    db: web::Data<Database>,
    req: web::Json<RegisterRequest>,
) -> Result<HttpResponse> {
    info!("Register attempt for: {}", req.name);
    
    match db.create_user(&req.stellar_public_key, req.user_type.clone(), &req.name, req.email.as_deref()).await {
        Ok(user) => {
            info!("User created successfully: {}", user.id);
            Ok(HttpResponse::Created().json(serde_json::json!({
                "user": user,
                "token": "dummy-jwt-token" // Implementar JWT real
            })))
        }
        Err(e) => {
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": format!("Error creando usuario: {}", e)
            })))
        }
    }
}

// User handlers
pub async fn get_users(db: web::Data<Database>) -> Result<HttpResponse> {
    // Implementar get_users en database
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "users": []
    })))
}

pub async fn get_user(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "user_id": user_id,
        "message": "Get user endpoint"
    })))
}

pub async fn create_user(
    db: web::Data<Database>,
    req: web::Json<RegisterRequest>,
) -> Result<HttpResponse> {
    auth_register(db, req).await
}

pub async fn update_user(
    db: web::Data<Database>,
    path: web::Path<String>,
    req: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    let user_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "user_id": user_id,
        "message": "Update user endpoint"
    })))
}

// Community handlers
pub async fn get_communities(db: web::Data<Database>) -> Result<HttpResponse> {
    match db.get_communities().await {
        Ok(communities) => {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "communities": communities
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Error obteniendo comunidades: {}", e)
            })))
        }
    }
}

pub async fn get_community(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let community_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "community_id": community_id,
        "message": "Get community endpoint"
    })))
}

pub async fn create_community(
    db: web::Data<Database>,
    req: web::Json<CreateCommunityRequest>,
) -> Result<HttpResponse> {
    match db.create_community(&req.name, &req.location, &req.description, req.representative_id, &req.stellar_public_key).await {
        Ok(community) => {
            Ok(HttpResponse::Created().json(serde_json::json!({
                "community": community
            })))
        }
        Err(e) => {
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": format!("Error creando comunidad: {}", e)
            })))
        }
    }
}

pub async fn update_community(
    db: web::Data<Database>,
    path: web::Path<String>,
    req: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    let community_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "community_id": community_id,
        "message": "Update community endpoint"
    })))
}

pub async fn verify_community(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let community_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "community_id": community_id,
        "message": "Verify community endpoint"
    })))
}

// Donation handlers
pub async fn get_donations(db: web::Data<Database>) -> Result<HttpResponse> {
    match db.get_donations().await {
        Ok(donations) => {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "donations": donations
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Error obteniendo donaciones: {}", e)
            })))
        }
    }
}

pub async fn get_donation(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let donation_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "donation_id": donation_id,
        "message": "Get donation endpoint"
    })))
}

pub async fn create_donation(
    db: web::Data<Database>,
    req: web::Json<CreateDonationRequest>,
) -> Result<HttpResponse> {
    // Buscar el donor por su stellar key
    match db.get_user_by_stellar_key(&req.donor_stellar_key).await {
        Ok(Some(donor)) => {
            // Crear direcciones temporales para contrato y escrow
            let contract_address = format!("CONTRACT_{}", Uuid::new_v4());
            let escrow_address = format!("ESCROW_{}", Uuid::new_v4());
            
            match db.create_donation(req.into_inner(), donor.id, &contract_address, &escrow_address).await {
                Ok(donation) => {
                    Ok(HttpResponse::Created().json(serde_json::json!({
                        "donation": donation
                    })))
                }
                Err(e) => {
                    Ok(HttpResponse::BadRequest().json(serde_json::json!({
                        "error": format!("Error creando donación: {}", e)
                    })))
                }
            }
        }
        Ok(None) => {
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Usuario donante no encontrado"
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Error de base de datos: {}", e)
            })))
        }
    }
}

pub async fn create_escrow(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let donation_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "donation_id": donation_id,
        "message": "Create escrow endpoint"
    })))
}

pub async fn validate_donation(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let donation_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "donation_id": donation_id,
        "message": "Validate donation endpoint"
    })))
}

pub async fn complete_donation(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let donation_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "donation_id": donation_id,
        "message": "Complete donation endpoint"
    })))
}

// Delivery handlers
pub async fn get_deliveries(db: web::Data<Database>) -> Result<HttpResponse> {
    match db.get_deliveries().await {
        Ok(deliveries) => {
            Ok(HttpResponse::Ok().json(serde_json::json!({
                "deliveries": deliveries
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Error obteniendo entregas: {}", e)
            })))
        }
    }
}

pub async fn get_delivery(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let delivery_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "delivery_id": delivery_id,
        "message": "Get delivery endpoint"
    })))
}

pub async fn create_delivery(
    db: web::Data<Database>,
    req: web::Json<ValidateDeliveryRequest>,
) -> Result<HttpResponse> {
    // Buscar el representative por su stellar key
    match db.get_user_by_stellar_key(&req.representative_stellar_key).await {
        Ok(Some(representative)) => {
            // Para este ejemplo, usamos el mismo ID como recipient
            let recipient_id = representative.id;
            
            match db.create_delivery(req.into_inner(), recipient_id, representative.id).await {
                Ok(delivery) => {
                    Ok(HttpResponse::Created().json(serde_json::json!({
                        "delivery": delivery
                    })))
                }
                Err(e) => {
                    Ok(HttpResponse::BadRequest().json(serde_json::json!({
                        "error": format!("Error creando entrega: {}", e)
                    })))
                }
            }
        }
        Ok(None) => {
            Ok(HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Representante no encontrado"
            })))
        }
        Err(e) => {
            Ok(HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Error de base de datos: {}", e)
            })))
        }
    }
}

pub async fn verify_delivery(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let delivery_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "delivery_id": delivery_id,
        "message": "Verify delivery endpoint"
    })))
}

// Stellar handlers
pub async fn get_stellar_account(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let public_key = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "public_key": public_key,
        "message": "Get stellar account endpoint"
    })))
}

pub async fn get_stellar_transaction(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let tx_hash = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "tx_hash": tx_hash,
        "message": "Get stellar transaction endpoint"
    })))
}

pub async fn get_stellar_balance(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let public_key = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "public_key": public_key,
        "balance": "1000.0000000",
        "message": "Get stellar balance endpoint"
    })))
}

// Contract handlers
pub async fn deploy_contract(
    db: web::Data<Database>,
    req: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Deploy contract endpoint"
    })))
}

pub async fn invoke_contract(
    db: web::Data<Database>,
    req: web::Json<serde_json::Value>,
) -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Invoke contract endpoint"
    })))
}

pub async fn get_donation_contract(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let contract_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "contract_id": contract_id,
        "message": "Get donation contract endpoint"
    })))
}

pub async fn get_escrow_contract(
    db: web::Data<Database>,
    path: web::Path<String>,
) -> Result<HttpResponse> {
    let contract_id = path.into_inner();
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "contract_id": contract_id,
        "message": "Get escrow contract endpoint"
    })))
}

// Statistics handler
pub async fn get_statistics(db: web::Data<Database>) -> Result<HttpResponse> {
    // Obtener estadísticas desde la base de datos
    let total_donations = match db.get_donations().await {
        Ok(donations) => donations.len(),
        Err(_) => 0,
    };
    
    let total_communities = match db.get_communities().await {
        Ok(communities) => communities.len(),
        Err(_) => 0,
    };
    
    let total_deliveries = match db.get_deliveries().await {
        Ok(deliveries) => deliveries.len(),
        Err(_) => 0,
    };
    
    // Calcular tasa de éxito (entregas completadas / donaciones totales)
    let success_rate = if total_donations > 0 {
        (total_deliveries as f64 / total_donations as f64 * 100.0).round() as u32
    } else {
        0
    };
    
    // Calcular total donado (suma de todas las donaciones)
    let total_amount = match db.get_donations().await {
        Ok(donations) => donations.iter().map(|d| d.amount as u32).sum::<u32>() / 10_000_000, // Convertir de stroops a XLM
        Err(_) => 0,
    };

    Ok(HttpResponse::Ok().json(serde_json::json!({
        "totalDonations": total_donations,
        "successRate": success_rate,
        "totalCommunities": total_communities,
        "totalAmount": total_amount
    })))
}

// Estructuras de request adicionales
#[derive(serde::Deserialize)]
pub struct LoginRequest {
    pub stellar_public_key: String,
}

#[derive(serde::Deserialize)]
pub struct RegisterRequest {
    pub stellar_public_key: String,
    pub user_type: UserType,
    pub name: String,
    pub email: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct CreateCommunityRequest {
    pub name: String,
    pub location: String,
    pub description: String,
    pub representative_id: Uuid,
    pub stellar_public_key: String,
} 