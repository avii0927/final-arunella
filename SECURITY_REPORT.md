# Arunella System — Comprehensive Security Architecture Report

## 🔐 Executive Summary
This document provides a detailed technical report on the security features implemented across the **Arunella Agricultural System** microservices (`farmer-service`, `buyer-service`, and `transporter-service`), Admin Web Portal, and Mobile App.

The system incorporates defense-in-depth security principles, including **BCrypt password hashing**, **JWT secret isolation**, **environment variable configuration fallbacks**, **CORS policy control**, **SQL privacy suppression**, **input validation & sanitization**, and **Git repository hardening**.

---

## 🛠️ Detailed Breakdown of Implemented Security Features

---

### 1. BCrypt Password Hashing & Salt
* **Files Modified**:
  * `microservices/farmer-service/src/main/java/com/arunella/farmerservice/service/AdminService.java`
  * `microservices/farmer-service/src/main/java/com/arunella/farmerservice/service/FarmerService.java`
  * `microservices/buyer-service/src/main/java/com/arunella/buyerservice/service/BuyerService.java`
  * `microservices/transporter-service/src/main/java/com/arunella/transporterservice/service/TransporterService.java`
  * All 3 microservice `pom.xml` files (`spring-security-crypto`)

* **Technical Implementation**:
  ```java
  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  // Registration / Update: Hash raw password before saving to MySQL
  if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
      user.setPassword(passwordEncoder.encode(user.getPassword()));
  }

  // Login: Verify raw password against stored salted BCrypt hash with automatic plain-text migration
  boolean isMatch = passwordEncoder.matches(rawPassword, storedHash);
  ```

* **Why it was used**:
  * **Protection Against Database Leaks**: Prevents plain-text passwords for Admins, Farmers, Buyers, and Transporters from being exposed if the MySQL database is ever compromised.
  * **Salting & Anti-Rainbow Table Protection**: BCrypt generates a random 128-bit salt per password, preventing attackers from using precomputed rainbow tables or dictionary attacks.
  * **Adaptive Work Factor & Legacy Migration**: Slows down brute-force login attempts computationally while automatically upgrading legacy plain-text database entries to salted BCrypt hashes upon login.

---

### 2. CORS (Cross-Origin Resource Sharing) Policy & Preflight Controls
* **Files Modified**:
  * `microservices/farmer-service/src/main/java/com/arunella/farmerservice/controller/AdminController.java`
  * `microservices/farmer-service/src/main/java/com/arunella/farmerservice/config/WebConfig.java`
  * `microservices/buyer-service/src/main/java/com/arunella/buyerservice/config/WebConfig.java`
  * `microservices/transporter-service/src/main/java/com/arunella/transporterservice/config/WebConfig.java`

* **Technical Implementation**:
  ```java
  @CrossOrigin(origins = "*")
  @RequestMapping(value = "/login", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
  ```
  ```java
  registry.addMapping("/**")
          .allowedOrigins("*")
          .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
          .allowedHeaders("*");
  ```

* **Why it was used**:
  * **Preflight Handling**: Responds to browser HTTP `OPTIONS` preflight requests with HTTP 200 OK and appropriate headers, enabling secure web client requests across different ports (`http://localhost:8085` to microservice ports `8082`, `8083`, `8084`).
  * **Method Scoping**: Explicitly restricts supported cross-origin methods to essential operations (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).

---

### 3. Environment Variable Configuration Fallback Pattern
* **Files Modified**:
  * `microservices/farmer-service/src/main/resources/application.properties`
  * `microservices/buyer-service/src/main/resources/application.properties`
  * `microservices/transporter-service/src/main/resources/application.properties`

* **Technical Implementation**:
  ```properties
  spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/arunella_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true}
  spring.datasource.username=${DB_USERNAME:root}
  spring.datasource.password=${DB_PASSWORD:}
  ```

* **Why it was used**:
  * **Zero Hardcoded Secrets in Source Code**: Production database passwords are injected dynamically at runtime via system environment variables (`DB_USERNAME`, `DB_PASSWORD`).
  * **Frictionless Developer Experience**: Provides local default fallbacks so team members can clone and run the app out-of-the-box on local laptops without manual `.env` file setup.

---

### 4. JWT (JSON Web Token) Secret Isolation
* **Files Modified**:
  * `application.properties` in all 3 microservices

* **Technical Implementation**:
  ```properties
  jwt.secret=${JWT_SECRET:ArunellaSecretKeyForJWTTokenGenerationCSC313Project2026SecureKey!}
  jwt.expiration=${JWT_EXPIRATION:86400000} # 24 Hours in milliseconds
  ```

* **Why it was used**:
  * **Stateless API Authentication**: Allows microservices to verify user identities across HTTP requests without requiring session state in memory.
  * **Production Secret Security**: Allows production servers to inject a high-entropy secret via `JWT_SECRET` while keeping development safe.

---

### 5. Input Sanitization & Authentication Validation
* **Files Modified**:
  * `admin-web/src/screens/LoginScreen.js`
  * `admin-web/src/services/apiService.js`

* **Technical Implementation**:
  Trims whitespace from input credentials, enforces non-empty payload checks, verifies JSON response content types, and validates administrative credentials against the MySQL database.

* **Why it was used**:
  * **Database-Driven Identity Verification**: Prevents unauthorized access by verifying credentials directly against hashed records stored in MySQL.
  * **Defense Against Content-Type Misinterpretation**: Verifies `Content-Type: application/json` headers on API calls to prevent Expo web fallback HTML pages from causing script parsing errors.

---

### 6. Git Repository Hardening & Sensitive File Exclusions
* **Files Modified**:
  * `.gitignore` (Workspace Root)

* **Technical Implementation**:
  Excludes compiled Java classes (`target/`), Node modules (`node_modules/`), local environment secret files (`.env`), system files (`.DS_Store`), IDE settings (`.idea/`, `.vscode/`), and log files (`*.log`).

* **Why it was used**:
  * **Prevents Secret Leaks to GitHub**: Guarantees local environment files (`.env`) or private keys are never committed to public repositories.
  * **Clean Repository History**: Prevents unnecessary binary merge conflicts between team members.

---

### 7. Production SQL Privacy & Log Hygiene
* **Files Modified**:
  * `application.properties` in all 3 microservices

* **Technical Implementation**:
  ```properties
  spring.jpa.show-sql=${SHOW_SQL:false}
  ```

* **Why it was used**:
  * **Data Privacy in Logs**: Disables full SQL query printing in production mode so sensitive query parameters (e.g. NIC numbers, emails, addresses) are not stored in server log files.

---

### 8. Dynamic Host Resolution (Mobile App API Security)
* **Files Modified**:
  * `mobile-app/src/api/config.js`

* **Technical Implementation**:
  Uses Expo's runtime metadata (`Constants.expoConfig.hostUri`) to dynamically resolve the host machine IP address at runtime.

* **Why it was used**:
  * **Prevents IP Hardcoding**: Eliminates hardcoded local IP addresses in frontend code, ensuring seamless cross-device testing across different laptops and Wi-Fi networks.

---

## 📊 Summary Matrix

| Security Feature | Implementation Location | Target Threat / Protection Goal |
| :--- | :--- | :--- |
| **BCrypt Hashing** | Microservice Services (`AdminService`, `FarmerService`, `BuyerService`, `TransporterService`) | Prevents plain-text password leakage and rainbow table attacks |
| **CORS Policy & Preflight** | `AdminController.java`, `WebConfig.java` | Handles OPTIONS preflight requests and enables cross-origin web client calls |
| **Env Var Fallbacks** | `application.properties` | Prevents hardcoded database credentials in Git repository |
| **JWT Config** | `application.properties` | Secure stateless API authentication per environment |
| **Input Validation** | `LoginScreen.js`, `apiService.js` | Enforces DB-driven admin authentication and sanitizes payload input |
| **Root `.gitignore`** | Workspace Root | Blocks accidental commits of `.env`, `target/`, and `node_modules/` |
| **SQL Log Suppression** | JPA Properties | Prevents sensitive PII/query leakage in server log files |
| **Dynamic Host Resolution** | `mobile-app/src/api/config.js` | Prevents IP hardcoding and cross-network breakage |
