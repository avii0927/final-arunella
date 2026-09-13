package com.arunella.transporterservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "delivery")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deliveryId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Transporter transporter;

    private Long orderId;

    private String pickupLocation;
    private String deliveryLocation;
    private String status;

    private LocalDate date;

    public Delivery() {}

    public Delivery(Long deliveryId, Transporter transporter, Long orderId, String pickupLocation, String deliveryLocation, String status, LocalDate date) {
        this.deliveryId = deliveryId;
        this.transporter = transporter;
        this.orderId = orderId;
        this.pickupLocation = pickupLocation;
        this.deliveryLocation = deliveryLocation;
        this.status = status;
        this.date = date;
    }

    public Long getDeliveryId() { return deliveryId; }
    public void setDeliveryId(Long deliveryId) { this.deliveryId = deliveryId; }

    public Transporter getTransporter() { return transporter; }
    public void setTransporter(Transporter transporter) { this.transporter = transporter; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
