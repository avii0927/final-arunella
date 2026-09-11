package com.arunella.farmerservice.service;

import com.arunella.farmerservice.entity.Farmer;
import com.arunella.farmerservice.repository.FarmerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public FarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public Farmer saveFarmer(Farmer farmer) {
        if (farmer.getPassword() != null && !farmer.getPassword().startsWith("$2a$")) {
            farmer.setPassword(passwordEncoder.encode(farmer.getPassword()));
        }
        return farmerRepository.save(farmer);
    }

    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id).orElse(null);
    }

    public List<Farmer> getFarmersByDistrict(String district) {
        return farmerRepository.findByDistrict(district);
    }

    public Farmer updateFarmer(Long id, Farmer farmerData) {
        Farmer existing = farmerRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(farmerData.getName());
            existing.setEmail(farmerData.getEmail());
            if (farmerData.getPassword() != null && !farmerData.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(farmerData.getPassword()));
            }
            existing.setNic(farmerData.getNic());
            existing.setContactNo(farmerData.getContactNo());
            existing.setDistrict(farmerData.getDistrict());
            existing.setLocation(farmerData.getLocation());
            existing.setWallet(farmerData.getWallet());
            existing.setBankAccountNo(farmerData.getBankAccountNo());
            existing.setRating(farmerData.getRating());
            return farmerRepository.save(existing);
        }
        return null;
    }

    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }

    public Optional<Farmer> login(String email, String password) {
        String cleanEmail = email != null ? email.trim() : "";
        String cleanPassword = password != null ? password.trim() : "";

        for (Farmer f : farmerRepository.findAll()) {
            if (f.getEmail() != null && f.getEmail().trim().equalsIgnoreCase(cleanEmail)) {
                String dbPass = f.getPassword() != null ? f.getPassword().trim() : "";
                if (passwordEncoder.matches(cleanPassword, dbPass) || cleanPassword.equals(dbPass)) {
                    if (!dbPass.startsWith("$2a$")) {
                        f.setPassword(passwordEncoder.encode(cleanPassword));
                        farmerRepository.save(f);
                    }
                    return Optional.of(f);
                }
            }
        }
        return Optional.empty();
    }
}
