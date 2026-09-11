import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * ─────────────────────────────────────────────────────────────
 *  ARUNELLA – Dynamic Microservices API Configuration
 *  Automatically detects the host machine IP across any laptop/Wi-Fi
 * ─────────────────────────────────────────────────────────────
 */
const getExpoHostIp = () => {
  try {
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.debuggerHost || '';
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return 'localhost';
};

const host = Platform.OS === 'web' ? 'localhost' : getExpoHostIp();

// Port 8084: Auth, Farmers & Crops (Member 1)
export const FARMER_SERVICE_URL = `http://${host}:8084/api`;

// Port 8082: Buyers & Commerce/Orders (Member 2)
export const BUYER_SERVICE_URL = `http://${host}:8082/api`;

// Port 8083: Transporters & Delivery (Member 3)
export const TRANSPORTER_SERVICE_URL = `http://${host}:8083/api`;

// Legacy fallback URL
export const BASE_URL = `http://${host}:8085/api`;

console.log('[Arunella Microservices] Dynamically detected host:', host);
console.log(' - Farmer Service:', FARMER_SERVICE_URL);
console.log(' - Buyer Service:', BUYER_SERVICE_URL);
console.log(' - Transporter Service:', TRANSPORTER_SERVICE_URL);
