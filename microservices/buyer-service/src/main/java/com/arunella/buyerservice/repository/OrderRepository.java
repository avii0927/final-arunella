package com.arunella.buyerservice.repository;

import com.arunella.buyerservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerUserId(Long buyerId);
    List<Order> findByStatus(String status);
}
