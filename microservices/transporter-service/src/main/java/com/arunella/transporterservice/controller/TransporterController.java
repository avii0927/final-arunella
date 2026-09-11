package com.arunella.transporterservice.controller;

import com.arunella.transporterservice.entity.Transporter;
import com.arunella.transporterservice.service.TransporterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/transporters")
public class TransporterController {

    private final TransporterService transporterService;

    public TransporterController(TransporterService transporterService) {
        this.transporterService = transporterService;
    }

    @PostMapping
    public ResponseEntity<Transporter> createTransporter(@RequestBody Transporter transporter) {
        Transporter saved = transporterService.saveTransporter(transporter);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Transporter>> getAllTransporters() {
        return ResponseEntity.ok(transporterService.getAllTransporters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transporter> getTransporterById(@PathVariable Long id) {
        Transporter transporter = transporterService.getTransporterById(id);
        if (transporter != null) {
            return ResponseEntity.ok(transporter);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transporter> updateTransporter(@PathVariable Long id, @RequestBody Transporter transporterData) {
        Transporter updated = transporterService.updateTransporter(id, transporterData);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransporter(@PathVariable Long id) {
        transporterService.deleteTransporter(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<Transporter> transporter = transporterService.login(email, password);
        if (transporter.isPresent()) {
            return ResponseEntity.ok(transporter.get());
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }
}
