/**
 * ─────────────────────────────────────────────────────────────
 *  ARUNELLA SYSTEM — MICROSERVICE ARCHITECTURE
 *  DEVELOPER OWNER: Member 2 (Buyer & Commerce Service)
 *  MODULE: BuyerServiceApplication
 *  RESPONSIBILITY: Spring Boot Main Application Entry Point
 * ─────────────────────────────────────────────────────────────
 */
package com.arunella.buyerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BuyerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(BuyerServiceApplication.class, args);
    }
}
