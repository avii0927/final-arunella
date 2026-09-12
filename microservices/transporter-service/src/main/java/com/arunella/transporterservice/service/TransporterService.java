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
        if (transporter.getRole() == null || transporter.getRole().trim().isEmpty()) {
            transporter.setRole("TRANSPORTER");
        }
        if (transporter.getPassword() != null && !transporter.getPassword().isEmpty() &&
            !isBCryptHashed(transporter.getPassword())) {
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
            if (transporterData.getName() != null) existing.setName(transporterData.getName());
            if (transporterData.getEmail() != null) existing.setEmail(transporterData.getEmail());
            if (transporterData.getPassword() != null && !transporterData.getPassword().isEmpty()) {
                if (!isBCryptHashed(transporterData.getPassword())) {
                    existing.setPassword(passwordEncoder.encode(transporterData.getPassword()));
                } else {
                    existing.setPassword(transporterData.getPassword());
                }
            }
            if (transporterData.getNic() != null) existing.setNic(transporterData.getNic());
            if (transporterData.getContactNo() != null) existing.setContactNo(transporterData.getContactNo());
            if (transporterData.getDistrict() != null) existing.setDistrict(transporterData.getDistrict());
            if (transporterData.getVehiclePlateNo() != null) existing.setVehiclePlateNo(transporterData.getVehiclePlateNo());
            if (transporterData.getMaxCapacity() != null) existing.setMaxCapacity(transporterData.getMaxCapacity());
            if (transporterData.getRating() != null) existing.setRating(transporterData.getRating());
            if (transporterData.getRole() != null) existing.setRole(transporterData.getRole());
            return transporterRepository.save(existing);
        }
        return null;
    }

    public void deleteTransporter(Long id) {
        transporterRepository.deleteById(id);
    }

    public Optional<Transporter> login(String email, String password) {
        if (email == null || password == null) {
            return Optional.empty();
        }
        String cleanEmail = email.trim();
        String cleanPassword = password.trim();
        if (cleanEmail.isEmpty() || cleanPassword.isEmpty()) {
            return Optional.empty();
        }

        Optional<Transporter> transporterOpt = transporterRepository.findByEmail(cleanEmail);
        if (transporterOpt.isEmpty()) {
            for (Transporter t : transporterRepository.findAll()) {
                if (t.getEmail() != null && t.getEmail().trim().equalsIgnoreCase(cleanEmail)) {
                    transporterOpt = Optional.of(t);
                    break;
                }
            }
        }

        if (transporterOpt.isPresent()) {
            Transporter t = transporterOpt.get();
            String dbPass = t.getPassword() != null ? t.getPassword().trim() : "";
            boolean matches = false;
            try {
                if (isBCryptHashed(dbPass)) {
                    matches = passwordEncoder.matches(cleanPassword, dbPass);
                }
            } catch (Exception ignored) {}

            if (matches || cleanPassword.equals(dbPass)) {
                if (!isBCryptHashed(dbPass)) {
                    t.setPassword(passwordEncoder.encode(cleanPassword));
                    transporterRepository.save(t);
                }
                return Optional.of(t);
            }
        }
        return Optional.empty();
    }

    private boolean isBCryptHashed(String password) {
        return password != null && (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$"));
    }
}
