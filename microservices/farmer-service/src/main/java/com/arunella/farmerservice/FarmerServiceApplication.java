/**
 * ─────────────────────────────────────────────────────────────
 *  ARUNELLA SYSTEM — MICROSERVICE ARCHITECTURE
 *  DEVELOPER OWNER: Member 1 (Auth & Farmer Service)
 *  MODULE: FarmerServiceApplication
 *  RESPONSIBILITY: Spring Boot Main Application Entry Point
 * ─────────────────────────────────────────────────────────────
 */
package com.arunella.farmerservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FarmerServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FarmerServiceApplication.class, args);
    }
}
