package com.arunella.farmerservice.repository;

import com.arunella.farmerservice.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    List<Farmer> findByDistrict(String district);
    Optional<Farmer> findByEmailAndPassword(String email, String password);
}
