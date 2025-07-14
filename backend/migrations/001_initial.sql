-- Tabla de usuarios
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  stellar_public_key TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (
    user_type IN (
      'ONG',
      'Community',
      'Representative',
      'Validator'
    )
  ),
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de comunidades
CREATE TABLE communities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  representative_id TEXT NOT NULL,
  stellar_public_key TEXT UNIQUE NOT NULL,
  verification_status TEXT NOT NULL CHECK (
    verification_status IN ('Pending', 'Verified', 'Rejected')
  ) DEFAULT 'Pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (representative_id) REFERENCES users(id)
);
-- Tabla de donaciones
CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  donor_id TEXT NOT NULL,
  community_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  conditions TEXT NOT NULL,
  stellar_transaction_hash TEXT,
  contract_address TEXT NOT NULL,
  escrow_address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN (
      'Created',
      'InEscrow',
      'Validated',
      'Delivered',
      'Completed',
      'Disputed',
      'Cancelled'
    )
  ) DEFAULT 'Created',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (community_id) REFERENCES communities(id)
);
-- Tabla de entregas
CREATE TABLE deliveries (
  id TEXT PRIMARY KEY,
  donation_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  representative_id TEXT NOT NULL,
  goods_received TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  delivery_proof TEXT NOT NULL,
  verification_status TEXT NOT NULL CHECK (
    verification_status IN ('Pending', 'Verified', 'Rejected')
  ) DEFAULT 'Pending',
  stellar_transaction_hash TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donation_id) REFERENCES donations(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id),
  FOREIGN KEY (representative_id) REFERENCES users(id)
);
-- Índices para mejorar el rendimiento
CREATE INDEX idx_users_stellar_key ON users(stellar_public_key);
CREATE INDEX idx_communities_representative ON communities(representative_id);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_community ON donations(community_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_deliveries_donation ON deliveries(donation_id);
CREATE INDEX idx_deliveries_representative ON deliveries(representative_id);