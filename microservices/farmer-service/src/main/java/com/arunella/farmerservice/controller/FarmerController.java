package com.arunella.farmerservice.controller;

import com.arunella.farmerservice.entity.Farmer;
import com.arunella.farmerservice.service.FarmerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    @PostMapping
    public ResponseEntity<Farmer> createFarmer(@RequestBody Farmer farmer) {
        Farmer saved = farmerService.saveFarmer(farmer);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return ResponseEntity.ok(farmerService.getAllFarmers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Farmer> getFarmerById(@PathVariable Long id) {
        Farmer farmer = farmerService.getFarmerById(id);
        if (farmer != null) {
            return ResponseEntity.ok(farmer);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<List<Farmer>> getFarmersByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(farmerService.getFarmersByDistrict(district));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farmer> updateFarmer(@PathVariable Long id, @RequestBody Farmer farmerData) {
        Farmer updated = farmerService.updateFarmer(id, farmerData);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        Optional<Farmer> farmer = farmerService.login(email, password);
        if (farmer.isPresent()) {
            return ResponseEntity.ok(farmer.get());
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }
}
