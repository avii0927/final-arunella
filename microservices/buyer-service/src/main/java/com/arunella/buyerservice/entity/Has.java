package com.arunella.buyerservice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "has")
public class Has {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "product_id")
    private Long productId;

    public Has() {}

    public Has(Long orderId, Long productId) {
        this.orderId = orderId;
        this.productId = productId;
    }

    public Has(Long id, Long orderId, Long productId) {
        this.id = id;
        this.orderId = orderId;
        this.productId = productId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
