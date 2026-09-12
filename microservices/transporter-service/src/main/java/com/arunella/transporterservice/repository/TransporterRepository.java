package com.arunella.transporterservice.repository;

import com.arunella.transporterservice.entity.Transporter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TransporterRepository extends JpaRepository<Transporter, Long> {
    Optional<Transporter> findByEmailAndPassword(String email, String password);
    Optional<Transporter> findByEmail(String email);
}
