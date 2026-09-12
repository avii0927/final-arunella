package com.arunella.transporterservice.repository;

import com.arunella.transporterservice.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByTransporterUserId(Long transporterId);

    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByStatus(String status);
}
