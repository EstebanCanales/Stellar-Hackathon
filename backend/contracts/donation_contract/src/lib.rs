#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, map, Map};

#[derive(Clone)]
#[contracttype]
pub struct Donation {
    pub id: String,
    pub donor: Address,
    pub recipient: Address,
    pub amount: i128,
    pub description: String,
    pub conditions: String,
    pub status: DonationStatus,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DonationStatus {
    Created,
    InEscrow,
    Validated,
    Delivered,
    Completed,
    Disputed,
    Cancelled,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Donation(String),
    DonationsByDonor(Address),
    DonationsByRecipient(Address),
    Admin,
}

#[contract]
pub struct DonationContract;

#[contractimpl]
impl DonationContract {
    /// Inicializa el contrato con un administrador
    pub fn initialize(env: Env, admin: Address) {
        env.storage().persistent().set(&DataKey::Admin, &admin);
    }

    /// Crea una nueva donación
    pub fn create_donation(
        env: Env,
        id: String,
        donor: Address,
        recipient: Address,
        amount: i128,
        description: String,
        conditions: String,
    ) -> String {
        // Verificar que el donor está autenticado
        donor.require_auth();
        
        // Verificar que el monto es positivo
        if amount <= 0 {
            panic!("El monto debe ser positivo");
        }

        let donation = Donation {
            id: id.clone(),
            donor: donor.clone(),
            recipient,
            amount,
            description,
            conditions,
            status: DonationStatus::Created,
            created_at: env.ledger().timestamp(),
        };

        // Almacenar la donación
        env.storage().persistent().set(&DataKey::Donation(id.clone()), &donation);

        // Actualizar índices
        let mut donor_donations: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::DonationsByDonor(donor.clone()))
            .unwrap_or(Vec::new(&env));
        donor_donations.push_back(id.clone());
        env.storage().persistent().set(&DataKey::DonationsByDonor(donor), &donor_donations);

        let mut recipient_donations: Vec<String> = env.storage()
            .persistent()
            .get(&DataKey::DonationsByRecipient(donation.recipient.clone()))
            .unwrap_or(Vec::new(&env));
        recipient_donations.push_back(id.clone());
        env.storage().persistent().set(&DataKey::DonationsByRecipient(donation.recipient), &recipient_donations);

        id
    }

    /// Actualiza el estado de una donación
    pub fn update_status(env: Env, id: String, new_status: DonationStatus, updater: Address) {
        updater.require_auth();
        
        let mut donation: Donation = env.storage()
            .persistent()
            .get(&DataKey::Donation(id.clone()))
            .expect("Donación no encontrada");

        // Verificar permisos según el estado
        match new_status {
            DonationStatus::InEscrow => {
                // Solo el donor puede mover a escrow
                if donation.donor != updater {
                    panic!("Solo el donante puede mover la donación a escrow");
                }
            }
            DonationStatus::Validated => {
                // Solo el recipient puede validar
                if donation.recipient != updater {
                    panic!("Solo el destinatario puede validar la donación");
                }
            }
            DonationStatus::Completed => {
                // Solo el recipient puede completar
                if donation.recipient != updater {
                    panic!("Solo el destinatario puede completar la donación");
                }
            }
            DonationStatus::Disputed => {
                // Tanto donor como recipient pueden disputar
                if donation.donor != updater && donation.recipient != updater {
                    panic!("Solo el donante o destinatario pueden disputar");
                }
            }
            DonationStatus::Cancelled => {
                // Solo el donor puede cancelar
                if donation.donor != updater {
                    panic!("Solo el donante puede cancelar la donación");
                }
            }
            _ => {}
        }

        donation.status = new_status;
        env.storage().persistent().set(&DataKey::Donation(id), &donation);
    }

    /// Obtiene una donación por ID
    pub fn get_donation(env: Env, id: String) -> Option<Donation> {
        env.storage().persistent().get(&DataKey::Donation(id))
    }

    /// Obtiene todas las donaciones de un donor
    pub fn get_donations_by_donor(env: Env, donor: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::DonationsByDonor(donor))
            .unwrap_or(Vec::new(&env))
    }

    /// Obtiene todas las donaciones para un recipient
    pub fn get_donations_by_recipient(env: Env, recipient: Address) -> Vec<String> {
        env.storage()
            .persistent()
            .get(&DataKey::DonationsByRecipient(recipient))
            .unwrap_or(Vec::new(&env))
    }

    /// Verifica si una donación existe
    pub fn exists(env: Env, id: String) -> bool {
        env.storage().persistent().has(&DataKey::Donation(id))
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
    fn test_create_donation() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DonationContract);
        let client = DonationContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let donor = Address::random(&env);
        let recipient = Address::random(&env);

        client.initialize(&admin);

        let donation_id = client.create_donation(
            &String::from_str(&env, "donation-1"),
            &donor,
            &recipient,
            &1000,
            &String::from_str(&env, "Ayuda alimentaria"),
            &String::from_str(&env, "Entrega verificada por la comunidad"),
        );

        assert_eq!(donation_id, String::from_str(&env, "donation-1"));
        
        let donation = client.get_donation(&String::from_str(&env, "donation-1"));
        assert!(donation.is_some());
        
        let donation = donation.unwrap();
        assert_eq!(donation.donor, donor);
        assert_eq!(donation.recipient, recipient);
        assert_eq!(donation.amount, 1000);
    }

    #[test]
    fn test_update_status() {
        let env = Env::default();
        let contract_id = env.register_contract(None, DonationContract);
        let client = DonationContractClient::new(&env, &contract_id);

        let admin = Address::random(&env);
        let donor = Address::random(&env);
        let recipient = Address::random(&env);

        client.initialize(&admin);

        let donation_id = String::from_str(&env, "donation-1");
        client.create_donation(
            &donation_id,
            &donor,
            &recipient,
            &1000,
            &String::from_str(&env, "Test donation"),
            &String::from_str(&env, "Test conditions"),
        );

        client.update_status(&donation_id, &DonationStatus::InEscrow, &donor);

        let donation = client.get_donation(&donation_id).unwrap();
        assert_eq!(donation.status, DonationStatus::InEscrow);
    }
} 