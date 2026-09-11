package com.arunella.buyerservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "buyer")
public class Buyer {

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
    private String businessRegNo;
    private String marketLocation;

    public Buyer() {}

    public Buyer(Long userId, String name, String email, String password, String nic, String contactNo, String district, BigDecimal rating, String role, String businessRegNo, String marketLocation) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.nic = nic;
        this.contactNo = contactNo;
        this.district = district;
        this.rating = rating;
        this.role = role;
        this.businessRegNo = businessRegNo;
        this.marketLocation = marketLocation;
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

    public String getBusinessRegNo() { return businessRegNo; }
    public void setBusinessRegNo(String businessRegNo) { this.businessRegNo = businessRegNo; }

    public String getMarketLocation() { return marketLocation; }
    public void setMarketLocation(String marketLocation) { this.marketLocation = marketLocation; }
}
