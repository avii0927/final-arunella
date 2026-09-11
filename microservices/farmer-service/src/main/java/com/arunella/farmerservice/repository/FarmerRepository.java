package com.arunella.farmerservice.repository;

import com.arunella.farmerservice.entity.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerRepository extends JpaRepository<Farmer, Long> {
    List<Farmer> findByDistrict(String district);
    Optional<Farmer> findByEmailAndPassword(String email, String password);
}
