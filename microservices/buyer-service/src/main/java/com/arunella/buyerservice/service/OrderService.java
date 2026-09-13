package com.arunella.buyerservice.service;

import com.arunella.buyerservice.entity.Order;
import com.arunella.buyerservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public List<Order> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerUserId(buyerId);
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrder(Long id, Order orderData) {
        Order existing = orderRepository.findById(id).orElse(null);
        if (existing != null) {
            if (orderData.getFarmerId() != null) existing.setFarmerId(orderData.getFarmerId());
            if (orderData.getProductId() != null) existing.setProductId(orderData.getProductId());
            if (orderData.getPrice() != null) existing.setPrice(orderData.getPrice());
            if (orderData.getQuantity() != null) existing.setQuantity(orderData.getQuantity());
            if (orderData.getDate() != null) existing.setDate(orderData.getDate());
            if (orderData.getStatus() != null) existing.setStatus(orderData.getStatus());
            if (orderData.getBuyer() != null) existing.setBuyer(orderData.getBuyer());
            return orderRepository.save(existing);
        }
        return null;
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
