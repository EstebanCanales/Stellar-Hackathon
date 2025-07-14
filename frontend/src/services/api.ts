import axios, { type AxiosInstance } from 'axios';

// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Interfaces TypeScript
export interface User {
  id: string;
  stellar_public_key: string;
  user_type: 'ONG' | 'Community' | 'Representative' | 'Validator';
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Community {
  id: string;
  name: string;
  location: string;
  description: string;
  representative_id: string;
  stellar_public_key: string;
  verification_status: 'Pending' | 'Verified' | 'Rejected';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  community_id: string;
  amount: number;
  description: string;
  conditions: string;
  stellar_transaction_hash?: string;
  contract_address: string;
  escrow_address: string;
  status: 'Created' | 'InEscrow' | 'Validated' | 'Delivered' | 'Completed' | 'Disputed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  donation_id: string;
  recipient_id: string;
  representative_id: string;
  goods_received: string;
  quantity: number;
  delivery_proof: string;
  verification_status: 'Pending' | 'Verified' | 'Rejected';
  stellar_transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDonationRequest {
  community_id: string;
  amount: number;
  description: string;
  conditions: string;
  donor_stellar_key: string;
}

export interface CreateUserRequest {
  stellar_public_key: string;
  user_type: 'ONG' | 'Community' | 'Representative' | 'Validator';
  name: string;
  email?: string;
}

export interface CreateCommunityRequest {
  name: string;
  location: string;
  description: string;
  representative_stellar_key: string;
}

export interface ValidateDeliveryRequest {
  donation_id: string;
  goods_received: string;
  quantity: number;
  delivery_proof: string;
  representative_stellar_key: string;
}

// API Functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Users
  async getUsers(): Promise<{ users: User[] }> {
    const response = await api.get('/users');
    return response.data;
  },

  async createUser(userData: CreateUserRequest): Promise<{ user: User; token: string }> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async getUserById(userId: string): Promise<{ user: User }> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Communities
  async getCommunities(): Promise<{ communities: Community[] }> {
    const response = await api.get('/communities');
    return response.data;
  },

  async createCommunity(communityData: CreateCommunityRequest): Promise<{ community: Community }> {
    const response = await api.post('/communities', communityData);
    return response.data;
  },

  async getCommunityById(communityId: string): Promise<{ community: Community }> {
    const response = await api.get(`/communities/${communityId}`);
    return response.data;
  },

  async verifyCommunity(communityId: string): Promise<{ message: string }> {
    const response = await api.post(`/communities/${communityId}/verify`);
    return response.data;
  },

  // Donations
  async getDonations(): Promise<{ donations: Donation[] }> {
    const response = await api.get('/donations');
    return response.data;
  },

  async createDonation(donationData: CreateDonationRequest): Promise<{ donation: Donation }> {
    const response = await api.post('/donations', donationData);
    return response.data;
  },

  async getDonationById(donationId: string): Promise<{ donation: Donation }> {
    const response = await api.get(`/donations/${donationId}`);
    return response.data;
  },

  async validateDonation(donationId: string): Promise<{ message: string }> {
    const response = await api.post(`/donations/${donationId}/validate`);
    return response.data;
  },

  async completeDonation(donationId: string): Promise<{ message: string }> {
    const response = await api.post(`/donations/${donationId}/complete`);
    return response.data;
  },

  // Deliveries
  async getDeliveries(): Promise<{ deliveries: Delivery[] }> {
    const response = await api.get('/deliveries');
    return response.data;
  },

  async createDelivery(deliveryData: ValidateDeliveryRequest): Promise<{ delivery: Delivery }> {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  },

  async getDeliveryById(deliveryId: string): Promise<{ delivery: Delivery }> {
    const response = await api.get(`/deliveries/${deliveryId}`);
    return response.data;
  },

  async verifyDelivery(deliveryId: string): Promise<{ message: string }> {
    const response = await api.post(`/deliveries/${deliveryId}/verify`);
    return response.data;
  },

  // Authentication
  async login(stellarPublicKey: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', { stellar_public_key: stellarPublicKey });
    return response.data;
  },

  async register(userData: CreateUserRequest): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Stellar integration
  async getStellarAccount(publicKey: string) {
    const response = await api.get(`/stellar/account/${publicKey}`);
    return response.data;
  },

  async getStellarBalance(publicKey: string) {
    const response = await api.get(`/stellar/balance/${publicKey}`);
    return response.data;
  },

  async getStellarTransaction(txHash: string) {
    const response = await api.get(`/stellar/transactions/${txHash}`);
    return response.data;
  },

  // Statistics
  async getStatistics(): Promise<{
    totalDonations: number;
    successRate: number;
    totalCommunities: number;
    totalAmount: number;
  }> {
    const response = await api.get('/stats');
    return response.data;
  },
};

// Auth helpers
export const authService = {
  setToken(token: string) {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default api; 