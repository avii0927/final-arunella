package com.arunella.farmerservice.repository;

import com.arunella.farmerservice.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByStatus(String status);
    List<Crop> findByFarmerUserId(Long farmerId);
    List<Crop> findByProductNameContainingIgnoreCase(String name);
}
