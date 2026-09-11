package com.arunella.buyerservice.service;

import com.arunella.buyerservice.entity.Buyer;
import com.arunella.buyerservice.repository.BuyerRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public BuyerService(BuyerRepository buyerRepository) {
        this.buyerRepository = buyerRepository;
    }

    public Buyer saveBuyer(Buyer buyer) {
        if (buyer.getPassword() != null && !buyer.getPassword().startsWith("$2a$")) {
            buyer.setPassword(passwordEncoder.encode(buyer.getPassword()));
        }
        return buyerRepository.save(buyer);
    }

    public List<Buyer> getAllBuyers() {
        return buyerRepository.findAll();
    }

    public Buyer getBuyerById(Long id) {
        return buyerRepository.findById(id).orElse(null);
    }

    public Buyer updateBuyer(Long id, Buyer buyerData) {
        Buyer existing = buyerRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(buyerData.getName());
            existing.setEmail(buyerData.getEmail());
            if (buyerData.getPassword() != null && !buyerData.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(buyerData.getPassword()));
            }
            existing.setNic(buyerData.getNic());
            existing.setContactNo(buyerData.getContactNo());
            existing.setDistrict(buyerData.getDistrict());
            existing.setBusinessRegNo(buyerData.getBusinessRegNo());
            existing.setMarketLocation(buyerData.getMarketLocation());
            existing.setRating(buyerData.getRating());
            return buyerRepository.save(existing);
        }
        return null;
    }

    public void deleteBuyer(Long id) {
        buyerRepository.deleteById(id);
    }

    public Optional<Buyer> login(String email, String password) {
        String cleanEmail = email != null ? email.trim() : "";
        String cleanPassword = password != null ? password.trim() : "";

        for (Buyer b : buyerRepository.findAll()) {
            if (b.getEmail() != null && b.getEmail().trim().equalsIgnoreCase(cleanEmail)) {
                String dbPass = b.getPassword() != null ? b.getPassword().trim() : "";
                if (passwordEncoder.matches(cleanPassword, dbPass) || cleanPassword.equals(dbPass)) {
                    if (!dbPass.startsWith("$2a$")) {
                        b.setPassword(passwordEncoder.encode(cleanPassword));
                        buyerRepository.save(b);
                    }
                    return Optional.of(b);
                }
            }
        }
        return Optional.empty();
    }
}
