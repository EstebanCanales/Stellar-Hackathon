use actix_web::{web, App, HttpServer, Result, middleware::Logger};
use actix_cors::Cors;
use log::info;
use std::env;

mod api;
mod models;
mod services;
mod database;
mod config;
mod stellar;

use api::routes;
use database::Database;
use config::Config;

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Inicializar logger
    env_logger::init();
    
    // Cargar configuración
    let config = Config::from_env()?;
    
    // Inicializar base de datos
    let database = Database::new(&config.database_url).await?;
    
    info!("🚀 Iniciando servidor Verida Backend en puerto {}", config.port);
    info!("🌐 Stellar Network: {}", config.stellar_network);
    
    // Inicializar servidor HTTP
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .supports_credentials();
            
        App::new()
            .app_data(web::Data::new(database.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            .service(routes::config_routes())
    })
    .bind(format!("0.0.0.0:{}", config.port))?
    .run()
    .await?;
    
    Ok(())
} 