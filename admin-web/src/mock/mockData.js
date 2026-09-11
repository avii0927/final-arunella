export const initialFarmers = [
  { userId: '101', name: 'Sunil Perera', email: 'sunil.p@farm.lk', nic: '782910382V', district: 'Nuwara Eliya' },
  { userId: '102', name: 'Kamal Bandara', email: 'kamal.b@agro.lk', nic: '851940291V', district: 'Dambulla' },
  { userId: '103', name: 'Nimal Jayasinghe', email: 'nimal.j@green.lk', nic: '910384729V', district: 'Polonnaruwa' },
  { userId: '104', name: 'Anura Ratnayake', email: 'anura.r@fields.lk', nic: '831049281V', district: 'Anuradhapura' },
  { userId: '105', name: 'Saman Silva', email: 'saman.s@crops.lk', nic: '761940281V', district: 'Badulla' },
];

export const initialBuyers = [
  { userId: '201', name: 'Cargills Foods PLC', email: 'procurement@cargills.lk', businessRegNo: 'PV-00124', marketLocation: 'Colombo Central' },
  { userId: '202', name: 'Keells Supermarket', email: 'supply@keells.com', businessRegNo: 'PV-00389', marketLocation: 'Kandy Wholesale' },
  { userId: '203', name: 'Lanka Super Mart', email: 'orders@lankamart.lk', businessRegNo: 'PV-00812', marketLocation: 'Gampaha Market' },
  { userId: '204', name: 'Green Fresh Retail', email: 'buy@greenfresh.lk', businessRegNo: 'PV-00511', marketLocation: 'Kurunegala Hub' },
];

export const initialTransporters = [
  { userId: '301', name: 'Lanka Agro Express', email: 'dispatch@agroexpress.lk', vehiclePlateNo: 'WP-0012', maxCapacity: '5000 kg' },
  { userId: '302', name: 'Island Freight Co.', email: 'logistics@islandfreight.lk', vehiclePlateNo: 'CP-4491', maxCapacity: '8000 kg' },
  { userId: '303', name: 'Fast Track Deliveries', email: 'contact@fasttrack.lk', vehiclePlateNo: 'NC-9910', maxCapacity: '3500 kg' },
  { userId: '304', name: 'Wayamba Transporters', email: 'info@wayambatrans.lk', vehiclePlateNo: 'NW-3301', maxCapacity: '6000 kg' },
];

export const initialCrops = [
  { productId: '1', productName: 'Red Rice (Suwandel)', stock: '500 KG', pricePerKg: 'LKR 220', minPrice: 'LKR 200', expDate: '2026-10-15', status: 'Active' },
  { productId: '2', productName: 'Organic Carrot', stock: '120 KG', pricePerKg: 'LKR 340', minPrice: 'LKR 310', expDate: '2026-09-20', status: 'Nearing Expiry' },
  { productId: '3', productName: 'Fresh Cavendish Banana', stock: '450 KG', pricePerKg: 'LKR 180', minPrice: 'LKR 160', expDate: '2026-09-18', status: 'Active' },
  { productId: '4', productName: 'Yellow Corn', stock: '40 KG', pricePerKg: 'LKR 140', minPrice: 'LKR 125', expDate: '2026-11-05', status: 'Low Stock' },
  { productId: '5', productName: 'Green Chillies', stock: '85 KG', pricePerKg: 'LKR 650', minPrice: 'LKR 600', expDate: '2026-09-22', status: 'Active' },
  { productId: '6', productName: 'Dambulla Red Onion', stock: '300 KG', pricePerKg: 'LKR 280', minPrice: 'LKR 250', expDate: '2026-10-01', status: 'Active' },
];

export const initialDeliveries = [
  { deliveryId: '1001', orderId: '892', pickupLocation: 'Dambulla Economic Center', deliveryLocation: 'Manning Market Colombo', status: 'In Transit' },
  { deliveryId: '1002', orderId: '891', pickupLocation: 'Nuwara Eliya Hub', deliveryLocation: 'Kandy Wholesale Depot', status: 'Scheduled' },
  { deliveryId: '1003', orderId: '889', pickupLocation: 'Polonnaruwa Warehouse', deliveryLocation: 'Gampaha Distribution Center', status: 'Delivered' },
  { deliveryId: '1004', orderId: '885', pickupLocation: 'Anuradhapura Station', deliveryLocation: 'Kurunegala Market', status: 'In Transit' },
  { deliveryId: '1005', orderId: '882', pickupLocation: 'Badulla Agro Farm', deliveryLocation: 'Ratmalana Cold Storage', status: 'Pending Pickup' },
];

export const recentActivityFeed = [
  {
    id: '1',
    title: 'New listing by Farm Co. East',
    subtitle: '500 KG Suwandel Rice listed at LKR 220/KG',
    badgeText: 'New Listing',
    badgeBg: '#FFF9C4',
    badgeColor: '#1a1c1a',
    time: '10 mins ago',
    icon: 'inventory-2',
    iconBg: '#acf4a4',
    iconColor: '#307231',
  },
  {
    id: '2',
    title: 'Order #ORD-892 dispatched',
    subtitle: 'Assigned to Island Freight Co.',
    badgeText: 'Logistics',
    badgeBg: '#e2e3e0',
    badgeColor: '#40493d',
    time: '45 mins ago',
    icon: 'local-shipping',
    iconBg: '#E1F5FE',
    iconColor: '#1a1c1a',
  },
  {
    id: '3',
    title: 'Quality flag on Wheat Batch B4',
    subtitle: 'Moisture level warning flagged by buyer',
    badgeText: 'Alert',
    badgeBg: '#ffdad6',
    badgeColor: '#93000a',
    time: '2 hours ago',
    icon: 'warning',
    iconBg: '#ffdad6',
    iconColor: '#D32F2F',
  },
  {
    id: '4',
    title: 'Farmer profile approved',
    subtitle: 'Sunil Perera (Nuwara Eliya) verified',
    badgeText: 'Approved',
    badgeBg: '#cbffc2',
    badgeColor: '#0d631b',
    time: '3 hours ago',
    icon: 'person-add',
    iconBg: '#e2e3e0',
    iconColor: '#40493d',
  },
];

export const initialFraudIncidents = [
  {
    id: 'FRD-101',
    entityName: 'Green Field Traders',
    entityType: 'Buyer',
    riskType: 'Price Gouging',
    riskScore: 89,
    riskLevel: 'Critical',
    impactAmount: 'LKR 650,000',
    detectedAt: '15 mins ago',
    details: 'Attempted to re-sell Green Chillies at +120% above regional ceiling price.',
    status: 'Under Investigation',
  },
  {
    id: 'FRD-102',
    entityName: 'Rajapaksha Freight',
    entityType: 'Transporter',
    riskType: 'GPS Route Anomaly',
    riskScore: 76,
    riskLevel: 'High',
    impactAmount: 'LKR 280,000',
    detectedAt: '1 hour ago',
    details: 'Vehicle deviated 45 KM off scheduled route to unverified warehouse.',
    status: 'Flagged',
  },
  {
    id: 'FRD-103',
    entityName: 'Chathura Farmers Corp',
    entityType: 'Farmer',
    riskType: 'Identity / NIC Mismatch',
    riskScore: 68,
    riskLevel: 'Medium',
    impactAmount: 'LKR 120,000',
    detectedAt: '3 hours ago',
    details: 'Bank account name does not match submitted NIC verification records.',
    status: 'Under Review',
  },
  {
    id: 'FRD-104',
    entityName: 'Lanka Wholesale Hub',
    entityType: 'Buyer',
    riskType: 'Duplicate Order Fraud',
    riskScore: 92,
    riskLevel: 'Critical',
    impactAmount: 'LKR 940,000',
    detectedAt: '5 hours ago',
    details: 'Submitted identical order claims across two distinct farmer accounts simultaneously.',
    status: 'Frozen',
  },
  {
    id: 'FRD-105',
    entityName: 'Bandara Produce',
    entityType: 'Farmer',
    riskType: 'Abnormal Yield Surge',
    riskScore: 54,
    riskLevel: 'Low',
    impactAmount: 'LKR 85,000',
    detectedAt: '1 day ago',
    details: 'Reported harvest quantity exceeds registered land size potential by 300%.',
    status: 'Resolved',
  },
];

export const systemRiskRules = [
  {
    id: '1',
    ruleName: 'Price Ceiling Spike Monitor',
    triggerCount: '14 today',
    severity: 'High',
    description: 'Flags product listings exceeding district benchmark prices by > 40%.',
  },
  {
    id: '2',
    ruleName: 'Cross-Account NIC Matcher',
    triggerCount: '3 today',
    severity: 'Critical',
    description: 'Detects duplicate national identity numbers across multiple user profiles.',
  },
  {
    id: '3',
    ruleName: 'Logistics Route Geofence Alert',
    triggerCount: '8 today',
    severity: 'Medium',
    description: 'Triggers when transport vehicle strays from designated delivery corridor.',
  },
  {
    id: '4',
    ruleName: 'Rapid High-Value Transaction Velocity',
    triggerCount: '5 today',
    severity: 'High',
    description: 'Flags accounts executing > LKR 1,000,000 in transactions within 30 minutes.',
  },
];
