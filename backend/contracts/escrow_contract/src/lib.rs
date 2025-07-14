#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, token};

#[derive(Clone)]
#[contracttype]
pub struct Escrow {
    pub id: String,
    pub donor: Address,
    pub recipient: Address,
    pub validator: Address,
    pub amount: i128,
    pub asset: Address,
    pub conditions: String,
    pub status: EscrowStatus,
    pub created_at: u64,
    pub timeout: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum EscrowStatus {
    Active,
    Validated,
    Released,
    Disputed,
    Cancelled,
    Expired,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Escrow(String),
    EscrowsByDonor(Address),
    EscrowsByRecipient(Address),
    Admin,
}

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
    /// Inicializa el contrato con un administrador
    pub fn initialize(env: Env, admin: Address) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Crea un nuevo escrow
    pub fn create_escrow(
        env: Env,
        id: String,
        donor: Address,
        recipient: Address,
        validator: Address,
        amount: i128,
        asset: Address,
        conditions: String,
        timeout_hours: u64,
    ) -> String {
        // Verificar que el donor está autenticado
        donor.require_auth();
        
        // Verificar que el monto es positivo
        if amount <= 0 {
            panic!("El monto debe ser positivo");
        }

        // Calcular timeout
        let timeout = env.ledger().timestamp() + (timeout_hours * 3600);

        let escrow = Escrow {
            id: id.clone(),
            donor: donor.clone(),
            recipient: recipient.clone(),
            validator,
            amount,
            asset: asset.clone(),
            conditions,
            status: EscrowStatus::Active,
            created_at: env.ledger().timestamp(),
            timeout,
        };

        // Transferir fondos al contrato
        let token_client = token::Client::new(&env, &asset);
        token_client.transfer(&donor, &env.current_contract_address(), &amount);

        // Almacenar el escrow
        env.storage().persistent().set(&DataKey::Escrow(id.clone()), &escrow);

        // Actualizar índices
        let mut donor_escrows: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::EscrowsByDonor(donor.clone()))
            .unwrap_or(Vec::new(&env));
        donor_escrows.push_back(id.clone());
        env.storage().persistent().set(&DataKey::EscrowsByDonor(donor), &donor_escrows);

        let mut recipient_escrows: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::EscrowsByRecipient(recipient.clone()))
            .unwrap_or(Vec::new(&env));
        recipient_escrows.push_back(id.clone());
        env.storage().persistent().set(&DataKey::EscrowsByRecipient(recipient), &recipient_escrows);

        id
    }

    /// Valida un escrow (llamado por el validator)
    pub fn validate_escrow(env: Env, id: String, validator: Address) {
        validator.require_auth();
        
        let mut escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(id.clone()))
            .expect("Escrow no encontrado");

        // Verificar que el caller es el validator
        if escrow.validator != validator {
            panic!("Solo el validator puede validar el escrow");
        }

        // Verificar que el escrow está activo
        if !matches!(escrow.status, EscrowStatus::Active) {
            panic!("El escrow no está activo");
        }

        // Verificar que no ha expirado
        if env.ledger().timestamp() > escrow.timeout {
            panic!("El escrow ha expirado");
        }

        escrow.status = EscrowStatus::Validated;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
    }

    /// Libera los fondos del escrow al recipient
    pub fn release_escrow(env: Env, id: String, caller: Address) {
        caller.require_auth();
        
        let mut escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(id.clone()))
            .expect("Escrow no encontrado");

        // Solo el validator o recipient pueden liberar
        if escrow.validator != caller && escrow.recipient != caller {
            panic!("Solo el validator o recipient pueden liberar el escrow");
        }

        // Verificar que el escrow está validado
        if !matches!(escrow.status, EscrowStatus::Validated) {
            panic!("El escrow debe estar validado antes de liberarse");
        }

        // Transferir fondos al recipient
        let token_client = token::Client::new(&env, &escrow.asset);
        token_client.transfer(&env.current_contract_address(), &escrow.recipient, &escrow.amount);

        escrow.status = EscrowStatus::Released;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
    }

    /// Disputa un escrow
    pub fn dispute_escrow(env: Env, id: String, caller: Address) {
        caller.require_auth();
        
        let mut escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(id.clone()))
            .expect("Escrow no encontrado");

        // Solo el donor o recipient pueden disputar
        if escrow.donor != caller && escrow.recipient != caller {
            panic!("Solo el donor o recipient pueden disputar");
        }

        // Verificar que el escrow está activo o validado
        if !matches!(escrow.status, EscrowStatus::Active | EscrowStatus::Validated) {
            panic!("El escrow no se puede disputar en su estado actual");
        }

        escrow.status = EscrowStatus::Disputed;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
    }

    /// Cancela un escrow y devuelve los fondos al donor
    pub fn cancel_escrow(env: Env, id: String, caller: Address) {
        caller.require_auth();
        
        let mut escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(id.clone()))
            .expect("Escrow no encontrado");

        // Solo el donor puede cancelar
        if escrow.donor != caller {
            panic!("Solo el donor puede cancelar el escrow");
        }

        // Verificar que el escrow está activo
        if !matches!(escrow.status, EscrowStatus::Active) {
            panic!("Solo se pueden cancelar escrows activos");
        }

        // Transferir fondos de vuelta al donor
        let token_client = token::Client::new(&env, &escrow.asset);
        token_client.transfer(&env.current_contract_address(), &escrow.donor, &escrow.amount);

        escrow.status = EscrowStatus::Cancelled;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
    }

    /// Maneja la expiración de un escrow
    pub fn handle_expiration(env: Env, id: String) {
        let mut escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(id.clone()))
            .expect("Escrow no encontrado");

        // Verificar que ha expirado
        if env.ledger().timestamp() <= escrow.timeout {
            panic!("El escrow no ha expirado aún");
        }

        // Verificar que está activo
        if !matches!(escrow.status, EscrowStatus::Active) {
            panic!("Solo se pueden expirar escrows activos");
        }

        // Devolver fondos al donor
        let token_client = token::Client::new(&env, &escrow.asset);
        token_client.transfer(&env.current_contract_address(), &escrow.donor, &escrow.amount);

        escrow.status = EscrowStatus::Expired;
        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
    }

    /// Obtiene un escrow por ID
    pub fn get_escrow(env: Env, id: String) -> Option<Escrow> {
        env.storage().persistent().get(&DataKey::Escrow(id))
    }

    /// Obtiene todos los escrows de un donor
    pub fn get_escrows_by_donor(env: Env, donor: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::EscrowsByDonor(donor))
            .unwrap_or(Vec::new(&env))
    }

    /// Obtiene todos los escrows para un recipient
    pub fn get_escrows_by_recipient(env: Env, recipient: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::EscrowsByRecipient(recipient))
            .unwrap_or(Vec::new(&env))
    }

    /// Verifica si un escrow existe
    pub fn exists(env: Env, id: String) -> bool {
        env.storage().persistent().has(&DataKey::Escrow(id))
    }

    /// Obtiene el administrador del contrato
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin no configurado")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_create_escrow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let donor = Address::random(&env);
        let recipient = Address::random(&env);
        let validator = Address::random(&env);
        let asset = Address::random(&env);

        client.initialize(&admin);

        let escrow_id = client.create_escrow(
            &String::from_str(&env, "escrow-1"),
            &donor,
            &recipient,
            &validator,
            &1000,
            &asset,
            &String::from_str(&env, "Entrega verificada por la comunidad"),
            &24, // 24 horas
        );

        assert_eq!(escrow_id, String::from_str(&env, "escrow-1"));
        
        let escrow = client.get_escrow(&String::from_str(&env, "escrow-1"));
        assert!(escrow.is_some());
        
        let escrow = escrow.unwrap();
        assert_eq!(escrow.donor, donor);
        assert_eq!(escrow.recipient, recipient);
        assert_eq!(escrow.validator, validator);
        assert_eq!(escrow.amount, 1000);
    }

    #[test]
    fn test_validate_and_release_escrow() {
        let env = Env::default();
        let contract_id = env.register_contract(None, EscrowContract);
        let client = EscrowContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let donor = Address::random(&env);
        let recipient = Address::random(&env);
        let validator = Address::random(&env);
        let asset = Address::random(&env);

        client.initialize(&admin);

        let escrow_id = String::from_str(&env, "escrow-1");
        client.create_escrow(
            &escrow_id,
            &donor,
            &recipient,
            &validator,
            &1000,
            &asset,
            &String::from_str(&env, "Test conditions"),
            &24,
        );

        // Validar escrow
        client.validate_escrow(&escrow_id, &validator);
        
        let escrow = client.get_escrow(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Validated);

        // Liberar escrow
        client.release_escrow(&escrow_id, &recipient);
        
        let escrow = client.get_escrow(&escrow_id).unwrap();
        assert_eq!(escrow.status, EscrowStatus::Released);
    }
} 