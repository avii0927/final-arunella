package com.arunella.transporterservice.service;

import com.arunella.transporterservice.entity.Delivery;
import com.arunella.transporterservice.repository.DeliveryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;

    public DeliveryService(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    public Delivery saveDelivery(Delivery delivery) {
        return deliveryRepository.save(delivery);
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    public Delivery getDeliveryById(Long id) {
        return deliveryRepository.findById(id).orElse(null);
    }

    public List<Delivery> getDeliveriesByTransporter(Long transporterId) {
        return deliveryRepository.findByTransporterUserId(transporterId);
    }

    public Delivery getDeliveryByOrder(Long orderId) {
        return deliveryRepository.findByOrderId(orderId).orElse(null);
    }

    public List<Delivery> getDeliveriesByStatus(String status) {
        return deliveryRepository.findByStatus(status);
    }

    public Delivery updateDelivery(Long id, Delivery deliveryData) {
        Delivery existing = deliveryRepository.findById(id).orElse(null);
        if (existing != null) {
            if (deliveryData.getPickupLocation() != null) existing.setPickupLocation(deliveryData.getPickupLocation());
            if (deliveryData.getDeliveryLocation() != null) existing.setDeliveryLocation(deliveryData.getDeliveryLocation());
            if (deliveryData.getStatus() != null) existing.setStatus(deliveryData.getStatus());
            if (deliveryData.getDate() != null) existing.setDate(deliveryData.getDate());
            if (deliveryData.getTransporter() != null) existing.setTransporter(deliveryData.getTransporter());
            if (deliveryData.getOrderId() != null) existing.setOrderId(deliveryData.getOrderId());
            return deliveryRepository.save(existing);
        }
        return null;
    }

    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }
}
