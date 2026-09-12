-- ============================================================================
-- ARUNELLA SYSTEM - DATABASE INITIALIZATION & DUMMY DATA SCRIPT
-- Database: arunella_db
-- Matching Entity Schema: Farmer, Crop, Buyer, Order, Has, Transporter, Delivery, Admin
-- ============================================================================

CREATE DATABASE IF NOT EXISTS arunella_db;
USE arunella_db;

-- Temporarily disable foreign key constraints for clean table setup
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Table 1: admin
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 2: farmer
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `farmer`;
CREATE TABLE `farmer` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `admin_id` BIGINT DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'FARMER',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nic` VARCHAR(50) DEFAULT NULL,
  `contact_no` VARCHAR(50) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT '5.00',
  `location` VARCHAR(255) DEFAULT NULL,
  `wallet` DECIMAL(10,2) DEFAULT '0.00',
  `bank_account_no` VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `fk_farmer_admin` (`admin_id`),
  CONSTRAINT `fk_farmer_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 3: crop
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `crop`;
CREATE TABLE `crop` (
  `product_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `user_id` BIGINT DEFAULT NULL,
  `price_per_kg` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'Active',
  `uploaded_date` DATE DEFAULT NULL,
  `exp_date` DATE DEFAULT NULL,
  `min_price` DECIMAL(10,2) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image` LONGBLOB DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `fk_crop_farmer` (`user_id`),
  CONSTRAINT `fk_crop_farmer` FOREIGN KEY (`user_id`) REFERENCES `farmer` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 4: buyer
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `buyer`;
CREATE TABLE `buyer` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(50) DEFAULT 'BUYER',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nic` VARCHAR(50) DEFAULT NULL,
  `contact_no` VARCHAR(50) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT '5.00',
  `business_reg_no` VARCHAR(100) DEFAULT NULL,
  `market_location` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 5: order
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `order_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL,
  `farmer_id` BIGINT DEFAULT NULL,
  `product_id` BIGINT DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quantity` INT NOT NULL,
  `date` DATE DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (`order_id`),
  KEY `fk_order_buyer` (`user_id`),
  CONSTRAINT `fk_order_buyer` FOREIGN KEY (`user_id`) REFERENCES `buyer` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 6: has
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `has`;
CREATE TABLE `has` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT DEFAULT NULL,
  `product_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 7: transporter
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `transporter`;
CREATE TABLE `transporter` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(50) DEFAULT 'TRANSPORTER',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nic` VARCHAR(50) DEFAULT NULL,
  `contact_no` VARCHAR(50) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT '5.00',
  `vehicle_plate_no` VARCHAR(50) DEFAULT NULL,
  `max_capacity` DOUBLE DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Table 8: delivery
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `delivery_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL,
  `order_id` BIGINT DEFAULT NULL,
  `pickup_location` VARCHAR(255) DEFAULT NULL,
  `delivery_location` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) DEFAULT 'In Transit',
  `confirmation_img` LONGBLOB DEFAULT NULL,
  `date` DATE DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  KEY `fk_delivery_transporter` (`user_id`),
  CONSTRAINT `fk_delivery_transporter` FOREIGN KEY (`user_id`) REFERENCES `transporter` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Re-enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- DUMMY DATA INSERTS
-- ============================================================================

-- 1. Insert Admins
INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`) VALUES
(1, 'Super Admin', 'admin@arunella.lk', 'admin123'),
(2, 'System Administrator', 'sysadmin@arunella.lk', 'admin123');

-- 2. Insert Farmers
INSERT INTO `farmer` (`user_id`, `admin_id`, `role`, `name`, `email`, `password`, `nic`, `contact_no`, `district`, `rating`, `location`, `wallet`, `bank_account_no`) VALUES
(1, 1, 'FARMER', 'Sunil Perera', 'sunil@farmer.lk', 'pass123', '781920384V', '0771234567', 'Nuwara Eliya', 4.85, 'Keppetipola, Nuwara Eliya', 45000.00, '8001928374'),
(2, 1, 'FARMER', 'Bandara Menike', 'bandara@farmer.lk', 'pass123', '825910293V', '0719876543', 'Badulla', 4.90, 'Welimada, Badulla', 62000.00, '8002938475'),
(3, 1, 'FARMER', 'K. Rajapaksha', 'rajapaksha@farmer.lk', 'pass123', '691029384V', '0753344556', 'Matale', 4.70, 'Dambulla Agro Zone', 28000.00, '8003847561'),
(4, 1, 'FARMER', 'Kamal Silva', 'kamal@farmer.lk', 'pass123', '901293847V', '0761122334', 'Anuradhapura', 4.60, 'Kekirawa, Anuradhapura', 34500.00, '8004958273'),
(5, 1, 'FARMER', 'Chaminda Kumara', 'chaminda@farmer.lk', 'pass123', '851029485V', '0789988776', 'Jaffna', 4.95, 'Chunnakam, Jaffna', 89000.00, '8005847362');

-- 3. Insert Crop Listings
INSERT INTO `crop` (`product_id`, `product_name`, `user_id`, `price_per_kg`, `stock`, `status`, `uploaded_date`, `exp_date`, `min_price`, `description`, `image`) VALUES
(101, 'Fresh Nuwara Eliya Carrots', 1, 280.00, 1500, 'Active', '2026-09-01', '2026-09-25', 250.00, 'Grade A organic carrots harvested fresh from Nuwara Eliya hills.', NULL),
(102, 'Dambulla Big Onions', 3, 190.00, 3200, 'Active', '2026-09-05', '2026-10-15', 175.00, 'High quality dry big onions ready for bulk distribution.', NULL),
(103, 'Jaffna Red Onions', 5, 420.00, 800, 'Nearing Expiry', '2026-08-20', '2026-09-18', 380.00, 'Premium red onions from Jaffna farms.', NULL),
(104, 'Welimada Organic Potatoes', 2, 310.00, 120, 'Low Stock', '2026-09-02', '2026-09-28', 290.00, 'Cleaned red potatoes, ideal for retail grocery packaging.', NULL),
(105, 'Kandy Green Leeks', 1, 160.00, 950, 'Active', '2026-09-10', '2026-09-24', 140.00, 'Crisp green leeks ready for central market delivery.', NULL),
(106, 'Kekirawa Samba Rice', 4, 220.00, 5000, 'Active', '2026-08-15', '2026-12-31', 200.00, 'Araliya style polished Samba rice batch.', NULL);

-- 4. Insert Buyers
INSERT INTO `buyer` (`user_id`, `role`, `name`, `email`, `password`, `nic`, `contact_no`, `district`, `rating`, `business_reg_no`, `market_location`) VALUES
(1, 'BUYER', 'Keells Super Distribution', 'procurement@keells.lk', 'buyer123', '751920384V', '0112345678', 'Colombo', 4.90, 'PV-00192', 'Keells Central Depot, Ranala'),
(2, 'BUYER', 'Cargills Food City', 'purchasing@cargills.lk', 'buyer123', '801928374V', '0118765432', 'Gampaha', 4.85, 'PV-00843', 'Cargills Logistics Hub, Mabima'),
(3, 'BUYER', 'Pettah Wholesale Traders', 'pettah.traders@gmail.com', 'buyer123', '651029384V', '0778899001', 'Colombo', 4.60, 'PV-01948', '5th Cross Street, Pettah'),
(4, 'BUYER', 'Arpico Supercentre', 'fresh@arpico.lk', 'buyer123', '791029384V', '0115566778', 'Colombo', 4.80, 'PV-00432', 'Navinna Distribution Hub');

-- 5. Insert Orders
INSERT INTO `order` (`order_id`, `user_id`, `farmer_id`, `product_id`, `price`, `quantity`, `date`, `status`) VALUES
(501, 1, 1, 101, 140000.00, 500, '2026-09-08', 'In Transit'),
(502, 2, 3, 102, 190000.00, 1000, '2026-09-09', 'Delivered'),
(503, 3, 5, 103, 126000.00, 300, '2026-09-10', 'In Transit'),
(504, 4, 2, 104, 31000.00, 100, '2026-09-11', 'Pending');

-- 6. Insert Has (Order-Product mapping)
INSERT INTO `has` (`id`, `order_id`, `product_id`) VALUES
(1, 501, 101),
(2, 502, 102),
(3, 503, 103),
(4, 504, 104);

-- 7. Insert Transporters
INSERT INTO `transporter` (`user_id`, `role`, `name`, `email`, `password`, `nic`, `contact_no`, `district`, `rating`, `vehicle_plate_no`, `max_capacity`) VALUES
(1, 'TRANSPORTER', 'Lanka Freight Express', 'logistics@lankafreight.lk', 'trans123', '841029384V', '0774455667', 'Colombo', 4.90, 'WP-DA-4892', 10000.0),
(2, 'TRANSPORTER', 'Jayasinghe Transport', 'jayasinghe.trans@gmail.com', 'trans123', '761029384V', '0712233445', 'Kurunegala', 4.75, 'NW-LH-1029', 5000.0),
(3, 'TRANSPORTER', 'Ruhunu Express Freight', 'ruhunu.express@gmail.com', 'trans123', '881029384V', '0781122334', 'Galle', 4.80, 'SP-LB-9932', 7500.0);

-- 8. Insert Deliveries
INSERT INTO `delivery` (`delivery_id`, `user_id`, `order_id`, `pickup_location`, `delivery_location`, `status`, `confirmation_img`, `date`) VALUES
(1001, 1, 501, 'Keppetipola, Nuwara Eliya', 'Keells Central Depot, Ranala', 'In Transit', NULL, '2026-09-08'),
(1002, 2, 502, 'Dambulla Agro Zone', 'Cargills Logistics Hub, Mabima', 'Delivered', NULL, '2026-09-09'),
(1003, 1, 503, 'Chunnakam, Jaffna', '5th Cross Street, Pettah', 'In Transit', NULL, '2026-09-10');

-- ============================================================================
-- SCRIPT COMPLETE
-- ============================================================================
