#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct Community {
    pub id: String,
    pub name: String,
    pub location: String,
    pub description: String,
    pub representative: Address,
    pub verification_status: VerificationStatus,
    pub created_at: u64,
    pub needs: Vec<String>,
    pub deliveries_count: u32,
    pub total_received: i128,
}

#[derive(Clone)]
#[contracttype]
pub struct DeliveryValidation {
    pub id: String,
    pub donation_id: String,
    pub community_id: String,
    pub validator: Address,
    pub goods_received: String,
    pub quantity: u32,
    pub delivery_proof: String,
    pub status: ValidationStatus,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
}

#[derive(Clone)]
#[contracttype]
pub enum ValidationStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Community(String),
    DeliveryValidation(String),
    CommunitiesByRepresentative(Address),
    ValidationsByDonation(String),
    Admin,
}

#[contract]
pub struct CommunityContract;

#[contractimpl]
impl CommunityContract {
    /// Inicializa el contrato con un administrador
    pub fn initialize(env: Env, admin: Address) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Registra una nueva comunidad
    pub fn register_community(
        env: Env,
        id: String,
        name: String,
        location: String,
        description: String,
        representative: Address,
    ) -> String {
        // Verificar que el representative está autenticado
        representative.require_auth();

        let community = Community {
            id: id.clone(),
            name,
            location,
            description,
            representative: representative.clone(),
            verification_status: VerificationStatus::Pending,
            created_at: env.ledger().timestamp(),
            needs: Vec::new(&env),
            deliveries_count: 0,
            total_received: 0,
        };

        // Almacenar la comunidad
        env.storage().persistent().set(&DataKey::Community(id.clone()), &community);

        // Actualizar índice por representante
        let mut representative_communities: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::CommunitiesByRepresentative(representative.clone()))
            .unwrap_or(Vec::new(&env));
        representative_communities.push_back(id.clone());
        env.storage().persistent().set(&DataKey::CommunitiesByRepresentative(representative), &representative_communities);

        id
    }

    /// Verifica una comunidad (solo admin)
    pub fn verify_community(env: Env, id: String, admin: Address) {
        admin.require_auth();

        let admin_stored: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin no configurado");

        if admin != admin_stored {
            panic!("Solo el admin puede verificar comunidades");
        }

        let mut community: Community = env.storage()
            .persistent()
            .get(&DataKey::Community(id.clone()))
            .expect("Comunidad no encontrada");

        community.verification_status = VerificationStatus::Verified;
        env.storage().persistent().set(&DataKey::Community(id), &community);
    }

    /// Actualiza las necesidades de una comunidad
    pub fn update_needs(env: Env, id: String, needs: Vec<String>, representative: Address) {
        representative.require_auth();

        let mut community: Community = env.storage()
            .persistent()
            .get(&DataKey::Community(id.clone()))
            .expect("Comunidad no encontrada");

        if community.representative != representative {
            panic!("Solo el representante puede actualizar las necesidades");
        }

        community.needs = needs;
        env.storage().persistent().set(&DataKey::Community(id), &community);
    }

    /// Valida una entrega
    pub fn validate_delivery(
        env: Env,
        id: String,
        donation_id: String,
        community_id: String,
        validator: Address,
        goods_received: String,
        quantity: u32,
        delivery_proof: String,
    ) -> String {
        validator.require_auth();

        // Verificar que la comunidad existe y el validator es el representante
        let community: Community = env.storage()
            .persistent()
            .get(&DataKey::Community(community_id.clone()))
            .expect("Comunidad no encontrada");

        if community.representative != validator {
            panic!("Solo el representante puede validar entregas");
        }

        if !matches!(community.verification_status, VerificationStatus::Verified) {
            panic!("La comunidad debe estar verificada para validar entregas");
        }

        let validation = DeliveryValidation {
            id: id.clone(),
            donation_id: donation_id.clone(),
            community_id,
            validator,
            goods_received,
            quantity,
            delivery_proof,
            status: ValidationStatus::Pending,
            created_at: env.ledger().timestamp(),
        };

        // Almacenar la validación
        env.storage().persistent().set(&DataKey::DeliveryValidation(id.clone()), &validation);

        // Actualizar índice por donación
        let mut donation_validations: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::ValidationsByDonation(donation_id.clone()))
            .unwrap_or(Vec::new(&env));
        donation_validations.push_back(id.clone());
        env.storage().persistent().set(&DataKey::ValidationsByDonation(donation_id), &donation_validations);

        id
    }

    /// Aprueba una validación de entrega
    pub fn approve_delivery(env: Env, validation_id: String, approver: Address) {
        approver.require_auth();

        let admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin no configurado");

        if approver != admin {
            panic!("Solo el admin puede aprobar entregas");
        }

        let mut validation: DeliveryValidation = env.storage()
            .persistent()
            .get(&DataKey::DeliveryValidation(validation_id.clone()))
            .expect("Validación no encontrada");

        validation.status = ValidationStatus::Approved;
        env.storage().persistent().set(&DataKey::DeliveryValidation(validation_id), &validation);

        // Actualizar estadísticas de la comunidad
        let mut community: Community = env.storage()
            .persistent()
            .get(&DataKey::Community(validation.community_id.clone()))
            .expect("Comunidad no encontrada");

        community.deliveries_count += 1;
        env.storage().persistent().set(&DataKey::Community(validation.community_id), &community);
    }

    /// Rechaza una validación de entrega
    pub fn reject_delivery(env: Env, validation_id: String, rejector: Address) {
        rejector.require_auth();

        let admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin no configurado");

        if rejector != admin {
            panic!("Solo el admin puede rechazar entregas");
        }

        let mut validation: DeliveryValidation = env.storage()
            .persistent()
            .get(&DataKey::DeliveryValidation(validation_id.clone()))
            .expect("Validación no encontrada");

        validation.status = ValidationStatus::Rejected;
        env.storage().persistent().set(&DataKey::DeliveryValidation(validation_id), &validation);
    }

    /// Actualiza el total recibido por una comunidad
    pub fn update_total_received(env: Env, community_id: String, amount: i128, admin: Address) {
        admin.require_auth();

        let admin_stored: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin no configurado");

        if admin != admin_stored {
            panic!("Solo el admin puede actualizar el total recibido");
        }

        let mut community: Community = env.storage()
            .persistent()
            .get(&DataKey::Community(community_id.clone()))
            .expect("Comunidad no encontrada");

        community.total_received += amount;
        env.storage().persistent().set(&DataKey::Community(community_id), &community);
    }

    /// Obtiene una comunidad por ID
    pub fn get_community(env: Env, id: String) -> Option<Community> {
        env.storage().persistent().get(&DataKey::Community(id))
    }

    /// Obtiene una validación por ID
    pub fn get_delivery_validation(env: Env, id: String) -> Option<DeliveryValidation> {
        env.storage().persistent().get(&DataKey::DeliveryValidation(id))
    }

    /// Obtiene todas las comunidades de un representante
    pub fn get_communities_by_rep(env: Env, representative: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::CommunitiesByRepresentative(representative))
            .unwrap_or(Vec::new(&env))
    }

    /// Obtiene todas las validaciones de una donación
    pub fn get_validations_by_donation(env: Env, donation_id: String) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::ValidationsByDonation(donation_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Verifica si una comunidad existe
    pub fn exists(env: Env, id: String) -> bool {
        env.storage().persistent().has(&DataKey::Community(id))
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
    use soroban_sdk::{testutils::Address as _, Address, Env, String, Vec};

    #[test]
    fn test_register_community() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CommunityContract);
        let client = CommunityContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let representative = Address::random(&env);

        client.initialize(&admin);

        let community_id = client.register_community(
            &String::from_str(&env, "community-1"),
            &String::from_str(&env, "Comunidad A"),
            &String::from_str(&env, "Ciudad A"),
            &String::from_str(&env, "Comunidad marginada que necesita ayuda"),
            &representative,
        );

        assert_eq!(community_id, String::from_str(&env, "community-1"));
        
        let community = client.get_community(&String::from_str(&env, "community-1"));
        assert!(community.is_some());
        
        let community = community.unwrap();
        assert_eq!(community.representative, representative);
        assert_eq!(community.name, String::from_str(&env, "Comunidad A"));
    }

    #[test]
    fn test_verify_community() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CommunityContract);
        let client = CommunityContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let representative = Address::random(&env);

        client.initialize(&admin);

        let community_id = String::from_str(&env, "community-1");
        client.register_community(
            &community_id,
            &String::from_str(&env, "Comunidad A"),
            &String::from_str(&env, "Ciudad A"),
            &String::from_str(&env, "Descripción"),
            &representative,
        );

        // Verificar comunidad
        client.verify_community(&community_id, &admin);
        
        let community = client.get_community(&community_id).unwrap();
        assert_eq!(community.verification_status, VerificationStatus::Verified);
    }

    #[test]
    fn test_validate_delivery() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CommunityContract);
        let client = CommunityContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let representative = Address::random(&env);

        client.initialize(&admin);

        let community_id = String::from_str(&env, "community-1");
        client.register_community(
            &community_id,
            &String::from_str(&env, "Comunidad A"),
            &String::from_str(&env, "Ciudad A"),
            &String::from_str(&env, "Descripción"),
            &representative,
        );

        // Verificar comunidad primero
        client.verify_community(&community_id, &admin);

        // Validar entrega
        let validation_id = client.validate_delivery(
            &String::from_str(&env, "validation-1"),
            &String::from_str(&env, "donation-1"),
            &community_id,
            &representative,
            &String::from_str(&env, "Alimentos recibidos"),
            &100,
            &String::from_str(&env, "https://proof.com/image.jpg"),
        );

        assert_eq!(validation_id, String::from_str(&env, "validation-1"));
        
        let validation = client.get_delivery_validation(&validation_id);
        assert!(validation.is_some());
        
        let validation = validation.unwrap();
        assert_eq!(validation.validator, representative);
        assert_eq!(validation.quantity, 100);
    }
} 