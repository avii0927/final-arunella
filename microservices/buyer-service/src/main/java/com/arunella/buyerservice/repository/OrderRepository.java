package com.arunella.buyerservice.repository;

import com.arunella.buyerservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerUserId(Long buyerId);

    List<Order> findByStatus(String status);
}
