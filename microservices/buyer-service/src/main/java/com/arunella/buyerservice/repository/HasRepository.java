package com.arunella.buyerservice.repository;

import com.arunella.buyerservice.entity.Has;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HasRepository extends JpaRepository<Has, Long> {
    List<Has> findByOrderId(Long orderId);
    List<Has> findByProductId(Long productId);
    void deleteByOrderIdAndProductId(Long orderId, Long productId);
}
