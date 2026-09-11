package com.arunella.transporterservice.service;

import com.arunella.transporterservice.entity.Transporter;
import com.arunella.transporterservice.repository.TransporterRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransporterService {

    private final TransporterRepository transporterRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public TransporterService(TransporterRepository transporterRepository) {
        this.transporterRepository = transporterRepository;
    }

    public Transporter saveTransporter(Transporter transporter) {
        if (transporter.getPassword() != null && !transporter.getPassword().startsWith("$2a$")) {
            transporter.setPassword(passwordEncoder.encode(transporter.getPassword()));
        }
        return transporterRepository.save(transporter);
    }

    public List<Transporter> getAllTransporters() {
        return transporterRepository.findAll();
    }

    public Transporter getTransporterById(Long id) {
        return transporterRepository.findById(id).orElse(null);
    }

    public Transporter updateTransporter(Long id, Transporter transporterData) {
        Transporter existing = transporterRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(transporterData.getName());
            existing.setEmail(transporterData.getEmail());
            if (transporterData.getPassword() != null && !transporterData.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(transporterData.getPassword()));
            }
            existing.setNic(transporterData.getNic());
            existing.setContactNo(transporterData.getContactNo());
            existing.setDistrict(transporterData.getDistrict());
            existing.setVehiclePlateNo(transporterData.getVehiclePlateNo());
            existing.setMaxCapacity(transporterData.getMaxCapacity());
            existing.setRating(transporterData.getRating());
            return transporterRepository.save(existing);
        }
        return null;
    }

    public void deleteTransporter(Long id) {
        transporterRepository.deleteById(id);
    }

    public Optional<Transporter> login(String email, String password) {
        String cleanEmail = email != null ? email.trim() : "";
        String cleanPassword = password != null ? password.trim() : "";

        for (Transporter t : transporterRepository.findAll()) {
            if (t.getEmail() != null && t.getEmail().trim().equalsIgnoreCase(cleanEmail)) {
                String dbPass = t.getPassword() != null ? t.getPassword().trim() : "";
                if (passwordEncoder.matches(cleanPassword, dbPass) || cleanPassword.equals(dbPass)) {
                    if (!dbPass.startsWith("$2a$")) {
                        t.setPassword(passwordEncoder.encode(cleanPassword));
                        transporterRepository.save(t);
                    }
                    return Optional.of(t);
                }
            }
        }
        return Optional.empty();
    }
}
