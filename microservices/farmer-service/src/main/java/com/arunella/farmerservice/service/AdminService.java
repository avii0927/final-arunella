package com.arunella.farmerservice.service;

import com.arunella.farmerservice.entity.Admin;
import com.arunella.farmerservice.repository.AdminRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin saveAdmin(Admin admin) {
        if (admin.getPassword() != null && !admin.getPassword().startsWith("$2a$")) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }

    public Admin updateAdmin(Long id, Admin adminData) {
        Admin existing = adminRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(adminData.getName());
            existing.setEmail(adminData.getEmail());
            if (adminData.getPassword() != null && !adminData.getPassword().isEmpty()) {
                existing.setPassword(passwordEncoder.encode(adminData.getPassword()));
            }
            return adminRepository.save(existing);
        }
        return null;
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public Optional<Admin> login(String email, String password) {
        String cleanEmail = email != null ? email.trim() : "";
        String cleanPassword = password != null ? password.trim() : "";

        List<Admin> allAdmins = adminRepository.findAll();

        // 1. Match against existing admins in DB using BCrypt or plain text fallback
        for (Admin a : allAdmins) {
            if (a.getEmail() != null && a.getEmail().trim().equalsIgnoreCase(cleanEmail)) {
                String dbPass = a.getPassword() != null ? a.getPassword().trim() : "";
                if (passwordEncoder.matches(cleanPassword, dbPass) || cleanPassword.equals(dbPass)) {
                    // Upgrade plain text password to BCrypt hash in DB if needed
                    if (!dbPass.startsWith("$2a$")) {
                        a.setPassword(passwordEncoder.encode(cleanPassword));
                        adminRepository.save(a);
                    }
                    return Optional.of(a);
                }
            }
        }

        // 2. Auto-seed default super admin with BCrypt hash if missing from DB
        if ("admin@arunella.lk".equalsIgnoreCase(cleanEmail) && "admin123".equals(cleanPassword)) {
            Optional<Admin> defaultFound = allAdmins.stream()
                .filter(a -> "admin@arunella.lk".equalsIgnoreCase(a.getEmail()))
                .findFirst();
            if (defaultFound.isPresent()) {
                Admin admin = defaultFound.get();
                admin.setPassword(passwordEncoder.encode("admin123"));
                return Optional.of(adminRepository.save(admin));
            }
            Admin defaultAdmin = new Admin(null, "Super Admin", "admin@arunella.lk", passwordEncoder.encode("admin123"));
            return Optional.of(adminRepository.save(defaultAdmin));
        }

        return Optional.empty();
    }
}
