package com.arunella.transporterservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "transporter")
public class Transporter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    private String email;
    private String password;
    private String nic;
    private String contactNo;
    private String district;
    private BigDecimal rating;
    private String role;
    private String vehiclePlateNo;
    private Double maxCapacity;

    public Transporter() {}

    public Transporter(Long userId, String name, String email, String password, String nic, String contactNo, String district, BigDecimal rating, String role, String vehiclePlateNo, Double maxCapacity) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.nic = nic;
        this.contactNo = contactNo;
        this.district = district;
        this.rating = rating;
        this.role = role;
        this.vehiclePlateNo = vehiclePlateNo;
        this.maxCapacity = maxCapacity;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getVehiclePlateNo() { return vehiclePlateNo; }
    public void setVehiclePlateNo(String vehiclePlateNo) { this.vehiclePlateNo = vehiclePlateNo; }

    public Double getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Double maxCapacity) { this.maxCapacity = maxCapacity; }
}
