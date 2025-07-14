use actix_web::{web, Scope};
use super::handlers::*;

pub fn config_routes() -> Scope {
    web::scope("/api")
        .route("/health", web::get().to(health_check))
        .route("/stats", web::get().to(get_statistics))
        .service(
            web::scope("/auth")
                .route("/login", web::post().to(auth_login))
                .route("/register", web::post().to(auth_register))
        )
        .service(
            web::scope("/users")
                .route("", web::get().to(get_users))
                .route("/{user_id}", web::get().to(get_user))
                .route("", web::post().to(create_user))
                .route("/{user_id}", web::put().to(update_user))
        )
        .service(
            web::scope("/communities")
                .route("", web::get().to(get_communities))
                .route("/{community_id}", web::get().to(get_community))
                .route("", web::post().to(create_community))
                .route("/{community_id}", web::put().to(update_community))
                .route("/{community_id}/verify", web::post().to(verify_community))
        )
        .service(
            web::scope("/donations")
                .route("", web::get().to(get_donations))
                .route("/{donation_id}", web::get().to(get_donation))
                .route("", web::post().to(create_donation))
                .route("/{donation_id}/escrow", web::post().to(create_escrow))
                .route("/{donation_id}/validate", web::post().to(validate_donation))
                .route("/{donation_id}/complete", web::post().to(complete_donation))
        )
        .service(
            web::scope("/deliveries")
                .route("", web::get().to(get_deliveries))
                .route("/{delivery_id}", web::get().to(get_delivery))
                .route("", web::post().to(create_delivery))
                .route("/{delivery_id}/verify", web::post().to(verify_delivery))
        )
        .service(
            web::scope("/stellar")
                .route("/account/{public_key}", web::get().to(get_stellar_account))
                .route("/transactions/{tx_hash}", web::get().to(get_stellar_transaction))
                .route("/balance/{public_key}", web::get().to(get_stellar_balance))
        )
        .service(
            web::scope("/contracts")
                .route("/deploy", web::post().to(deploy_contract))
                .route("/invoke", web::post().to(invoke_contract))
                .route("/donation/{contract_id}", web::get().to(get_donation_contract))
                .route("/escrow/{contract_id}", web::get().to(get_escrow_contract))
        )
} 