import { Platform } from 'react-native';

const HOST = 'localhost';

export const FARMER_SERVICE_URL = `http://${HOST}:8084/api`;
export const BUYER_SERVICE_URL = `http://${HOST}:8082/api`;
export const TRANSPORTER_SERVICE_URL = `http://${HOST}:8083/api`;

// Fallback legacy port
const LEGACY_PORT = 8080;
export const LEGACY_SERVICE_URL = `http://${HOST}:${LEGACY_PORT}/api`;

/**
 * Generic fetch wrapper with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Fetch with fallback from primary microservice URL to legacy single backend
 */
async function fetchWithFallback(serviceUrl, path, options = {}) {
  try {
    const res = await fetchWithTimeout(`${serviceUrl}${path}`, options, 3000);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res;
    }
  } catch (e) {
    // Primary service connection failed
  }

  if (serviceUrl !== LEGACY_SERVICE_URL) {
    try {
      const res = await fetchWithTimeout(`${LEGACY_SERVICE_URL}${path}`, options, 3000);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return res;
      }
    } catch (fallbackErr) {
      // Ignore
    }
  }

  throw new Error('Could not connect to microservice server');
}

export const apiService = {
  // Check health across microservices
  async checkBackendHealth() {
    try {
      const res = await fetchWithFallback(FARMER_SERVICE_URL, '/crops');
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // ---------------- ADMIN AUTHENTICATION (Port 8084) ----------------
  async loginAdmin(email, password) {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, '/admins/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Invalid admin credentials');
    }
    return await res.json();
  },

  // ---------------- FARMERS (Member 1: Port 8084) ----------------
  async getFarmers() {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, '/farmers');
    if (!res.ok) throw new Error('Failed to fetch farmers');
    return await res.json();
  },

  async createFarmer(farmerData) {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, '/farmers', {
      method: 'POST',
      body: JSON.stringify(farmerData),
    });
    if (!res.ok) throw new Error('Failed to create farmer');
    return await res.json();
  },

  async deleteFarmer(id) {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, `/farmers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete farmer');
    return true;
  },

  // ---------------- BUYERS (Member 2: Port 8082) ----------------
  async getBuyers() {
    const res = await fetchWithFallback(BUYER_SERVICE_URL, '/buyers');
    if (!res.ok) throw new Error('Failed to fetch buyers');
    return await res.json();
  },

  async createBuyer(buyerData) {
    const res = await fetchWithFallback(BUYER_SERVICE_URL, '/buyers', {
      method: 'POST',
      body: JSON.stringify(buyerData),
    });
    if (!res.ok) throw new Error('Failed to create buyer');
    return await res.json();
  },

  async deleteBuyer(id) {
    const res = await fetchWithFallback(BUYER_SERVICE_URL, `/buyers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete buyer');
    return true;
  },

  // ---------------- TRANSPORTERS (Member 3: Port 8083) ----------------
  async getTransporters() {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, '/transporters');
    if (!res.ok) throw new Error('Failed to fetch transporters');
    return await res.json();
  },

  async createTransporter(transporterData) {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, '/transporters', {
      method: 'POST',
      body: JSON.stringify(transporterData),
    });
    if (!res.ok) throw new Error('Failed to create transporter');
    return await res.json();
  },

  async deleteTransporter(id) {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, `/transporters/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete transporter');
    return true;
  },

  // ---------------- CROPS / PRODUCTS (Member 1: Port 8084) ----------------
  async getCrops() {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, '/crops');
    if (!res.ok) throw new Error('Failed to fetch crops');
    return await res.json();
  },

  async createCrop(cropData) {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, '/crops', {
      method: 'POST',
      body: JSON.stringify(cropData),
    });
    if (!res.ok) throw new Error('Failed to create crop');
    return await res.json();
  },

  async deleteCrop(id) {
    const res = await fetchWithFallback(FARMER_SERVICE_URL, `/crops/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete crop');
    return true;
  },

  // ---------------- DELIVERIES (Member 3: Port 8083) ----------------
  async getDeliveries() {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, '/deliveries');
    if (!res.ok) throw new Error('Failed to fetch deliveries');
    return await res.json();
  },

  async createDelivery(deliveryData) {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, '/deliveries', {
      method: 'POST',
      body: JSON.stringify(deliveryData),
    });
    if (!res.ok) throw new Error('Failed to create delivery');
    return await res.json();
  },

  async deleteDelivery(id) {
    const res = await fetchWithFallback(TRANSPORTER_SERVICE_URL, `/deliveries/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete delivery');
    return true;
  },
};
