package com.arunella.farmerservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "crop")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    private String productName;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Farmer farmer;

    private BigDecimal pricePerKg;
    private Integer stock;
    private String status;
    private LocalDate uploadedDate;
    private LocalDate expDate;
    private BigDecimal minPrice;
    private String description;

    @Lob
    private byte[] image;

    public Crop() {}

    public Crop(Long productId, String productName, Farmer farmer, BigDecimal pricePerKg, Integer stock, String status, LocalDate uploadedDate, LocalDate expDate, BigDecimal minPrice, String description, byte[] image) {
        this.productId = productId;
        this.productName = productName;
        this.farmer = farmer;
        this.pricePerKg = pricePerKg;
        this.stock = stock;
        this.status = status;
        this.uploadedDate = uploadedDate;
        this.expDate = expDate;
        this.minPrice = minPrice;
        this.description = description;
        this.image = image;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Farmer getFarmer() { return farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }

    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getUploadedDate() { return uploadedDate; }
    public void setUploadedDate(LocalDate uploadedDate) { this.uploadedDate = uploadedDate; }

    public LocalDate getExpDate() { return expDate; }
    public void setExpDate(LocalDate expDate) { this.expDate = expDate; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }
}
