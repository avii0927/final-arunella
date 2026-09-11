package com.arunella.transporterservice.repository;

import com.arunella.transporterservice.entity.Transporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransporterRepository extends JpaRepository<Transporter, Long> {
    Optional<Transporter> findByEmailAndPassword(String email, String password);
}
