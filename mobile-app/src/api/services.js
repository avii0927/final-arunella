import { api } from './apiClient';

// ── Crops  (/api/crops) ────────────────────────────────────────
export const CropService = {
  getAll:        ()           => api.get('/crops'),
  getById:       (id)         => api.get(`/crops/${id}`),
  getByFarmer:   (farmerId)   => api.get(`/crops/farmer/${farmerId}`),
  getByStatus:   (status)     => api.get(`/crops/status/${status}`),
  search:        (name)       => api.get(`/crops/search?name=${encodeURIComponent(name)}`),
  create:        (crop)       => api.post('/crops', crop),
  update:        (id, crop)   => api.put(`/crops/${id}`, crop),
  delete:        (id)         => api.delete(`/crops/${id}`),
};

// ── Farmers  (/api/farmers) ────────────────────────────────────
export const FarmerService = {
  getAll:        ()           => api.get('/farmers'),
  getById:       (id)         => api.get(`/farmers/${id}`),
  getByDistrict: (district)   => api.get(`/farmers/district/${encodeURIComponent(district)}`),
  create:        (farmer)     => api.post('/farmers', farmer),
  update:        (id, farmer) => api.put(`/farmers/${id}`, farmer),
  delete:        (id)         => api.delete(`/farmers/${id}`),
  login:         (email, password) => api.post('/farmers/login', { email, password }),
};

// ── Buyers  (/api/buyers) ──────────────────────────────────────
export const BuyerService = {
  getAll:        ()           => api.get('/buyers'),
  getById:       (id)         => api.get(`/buyers/${id}`),
  create:        (buyer)      => api.post('/buyers', buyer),
  update:        (id, buyer)  => api.put(`/buyers/${id}`, buyer),
  delete:        (id)         => api.delete(`/buyers/${id}`),
  login:         (email, password) => api.post('/buyers/login', { email, password }),
};

// ── Orders  (/api/orders) ──────────────────────────────────────
export const OrderService = {
  getAll:        ()           => api.get('/orders'),
  getById:       (id)         => api.get(`/orders/${id}`),
  getByBuyer:    (buyerId)    => api.get(`/orders/buyer/${buyerId}`),
  getByStatus:   (status)     => api.get(`/orders/status/${status}`),
  create:        (order)      => api.post('/orders', order),
  update:        (id, order)  => api.put(`/orders/${id}`, order),
  delete:        (id)         => api.delete(`/orders/${id}`),
};

// ── Transporters  (/api/transporters) ─────────────────────────
export const TransporterService = {
  getAll:        ()                   => api.get('/transporters'),
  getById:       (id)                 => api.get(`/transporters/${id}`),
  create:        (t)                  => api.post('/transporters', t),
  update:        (id, t)              => api.put(`/transporters/${id}`, t),
  delete:        (id)                 => api.delete(`/transporters/${id}`),
  login:         (email, password)    => api.post('/transporters/login', { email, password }),
};

// ── Deliveries  (/api/deliveries) ─────────────────────────────
export const DeliveryService = {
  getAll:              ()                => api.get('/deliveries'),
  getById:             (id)              => api.get(`/deliveries/${id}`),
  getByTransporter:    (transporterId)   => api.get(`/deliveries/transporter/${transporterId}`),
  getByOrder:          (orderId)         => api.get(`/deliveries/order/${orderId}`),
  getByStatus:         (status)          => api.get(`/deliveries/status/${status}`),
  create:              (delivery)        => api.post('/deliveries', delivery),
  update:              (id, delivery)    => api.put(`/deliveries/${id}`, delivery),
  delete:              (id)              => api.delete(`/deliveries/${id}`),
};

// ── Unified role-based login ───────────────────────────────────
// Returns the full user object from the backend on success, throws on failure.
export const loginByRole = (roleId, email, password) => {
  if (roleId === 'farmer')      return FarmerService.login(email, password);
  if (roleId === 'buyer')       return BuyerService.login(email, password);
  if (roleId === 'transporter') return TransporterService.login(email, password);
  throw new Error(`Unknown role: ${roleId}`);
};

// ── Unified role-based register ────────────────────────────────
export const registerByRole = (roleId, payload) => {
  if (roleId === 'farmer')      return FarmerService.create(payload);
  if (roleId === 'buyer')       return BuyerService.create(payload);
  if (roleId === 'transporter') return TransporterService.create(payload);
  throw new Error(`Unknown role: ${roleId}`);
};

