/**
 * ─────────────────────────────────────────────────────────────
 *  ARUNELLA SYSTEM — MICROSERVICE ARCHITECTURE
 *  DEVELOPER OWNER: Member 3 (Transporter & Delivery Service)
 *  MODULE: TransporterServiceApplication
 *  RESPONSIBILITY: Spring Boot Main Application Entry Point
 * ─────────────────────────────────────────────────────────────
 */
package com.arunella.transporterservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TransporterServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(TransporterServiceApplication.class, args);
    }
}
