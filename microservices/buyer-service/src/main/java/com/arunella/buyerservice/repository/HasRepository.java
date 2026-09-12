package com.arunella.buyerservice.repository;

import com.arunella.buyerservice.entity.Has;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HasRepository extends JpaRepository<Has, Long> {
    List<Has> findByOrderId(Long orderId);

    List<Has> findByProductId(Long productId);

    void deleteByOrderIdAndProductId(Long orderId, Long productId);
}
