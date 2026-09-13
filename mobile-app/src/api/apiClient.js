import { FARMER_SERVICE_URL, BUYER_SERVICE_URL, TRANSPORTER_SERVICE_URL, BASE_URL } from './config';

/**
 * Resolves the primary microservice URL based on the request endpoint,
 * with fallback to the legacy single backend URL.
 */
function resolveServiceUrl(endpoint) {
  if (endpoint.startsWith('/farmers') || endpoint.startsWith('/crops')) {
    return FARMER_SERVICE_URL;
  }
  if (endpoint.startsWith('/buyers') || endpoint.startsWith('/orders')) {
    return BUYER_SERVICE_URL;
  }
  if (endpoint.startsWith('/transporters') || endpoint.startsWith('/deliveries')) {
    return TRANSPORTER_SERVICE_URL;
  }
  return BASE_URL;
}

/**
 * Core HTTP client for Arunella microservices.
 */
async function request(endpoint, options = {}) {
  const primaryServiceUrl = resolveServiceUrl(endpoint);
  const primaryUrl = `${primaryServiceUrl}${endpoint}`;
  const fallbackUrl = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Try primary microservice first, fallback to legacy port if connection fails
  const urlsToTry = [primaryUrl];
  if (primaryUrl !== fallbackUrl) {
    urlsToTry.push(fallbackUrl);
  }

  let lastError = null;

  for (const targetUrl of urlsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      console.log(`[API Request] ${options.method || 'GET'} ${targetUrl}`);
      const response = await fetch(targetUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 204) return null;

      const data = await response.json();

      if (!response.ok) {
        const msg = data?.message || data?.error || `HTTP ${response.status}`;
        throw new Error(msg);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
    }
  }

  console.error(`[API Error] ${options.method || 'GET'} ${endpoint} failed on all targets →`, lastError?.message);
  throw lastError || new Error(`Connection to server failed for ${endpoint}`);
}

export const api = {
  get:    (endpoint)        => request(endpoint, { method: 'GET' }),
  post:   (endpoint, body)  => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (endpoint, body)  => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (endpoint)        => request(endpoint, { method: 'DELETE' }),
};
