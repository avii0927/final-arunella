# Arunella Project — Member Contributions & Ownership

This project is divided into **3 distinct functional modules** for team member collaboration on GitHub. All 3 microservices share a **Single MySQL Database** (`arunella_db`).

---

## 👥 Member Responsibilities & File Ownership

### 🟢 Member 1: Authentication & Farmer Microservice
* **Backend Directory**: `microservices/farmer-service` (Port `8084`)
* **Database Tables Owned**: `farmer`, `crop`, `admin`
* **Mobile App Screens Owned**: `mobile-app/src/screens/auth/*`, `mobile-app/src/screens/farmer/*`
* **Admin Web Screens Owned**: `admin-web/src/screens/ProductsScreen.js`, `admin-web/src/screens/UsersScreen.js` (Farmer tab)

---

### 🔵 Member 2: Buyer & Commerce Microservice
* **Backend Directory**: `microservices/buyer-service` (Port `8082`)
* **Database Tables Owned**: `buyer`, `order`
* **Mobile App Screens Owned**: `mobile-app/src/screens/buyer/*`
* **Admin Web Screens Owned**: `admin-web/src/screens/OverviewScreen.js`, `admin-web/src/screens/UsersScreen.js` (Buyer tab)

---

### 🟣 Member 3: Transporter & Delivery Microservice
* **Backend Directory**: `microservices/transporter-service` (Port `8083`)
* **Database Tables Owned**: `transporter`, `delivery`
* **Mobile App Screens Owned**: `mobile-app/src/screens/transporter/*`
* **Admin Web Screens Owned**: `admin-web/src/screens/DeliveriesScreen.js`, `admin-web/src/screens/FraudDetectionScreen.js`, `admin-web/src/screens/UsersScreen.js` (Transporter tab)

---

## 🗄️ Database Setup
All microservices connect to a **Single Shared Database**:
* **Database Name**: `arunella_db`
* **MySQL URL**: `jdbc:mysql://localhost:3306/arunella_db?createDatabaseIfNotExist=true`
