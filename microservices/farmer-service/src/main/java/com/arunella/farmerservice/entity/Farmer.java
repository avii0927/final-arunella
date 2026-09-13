package com.arunella.farmerservice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "farmer")
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    private String role;
    private String name;
    private String email;
    private String password;
    private String nic;
    private String contactNo;
    private String district;
    private BigDecimal rating;
    private String location;
    private String bankAccountNo;

    public Farmer() {}

    public Farmer(Long userId, Admin admin, String role, String name, String email, String password, String nic, String contactNo, String district, BigDecimal rating, String location, String bankAccountNo) {
        this.userId = userId;
        this.admin = admin;
        this.role = role;
        this.name = name;
        this.email = email;
        this.password = password;
        this.nic = nic;
        this.contactNo = contactNo;
        this.district = district;
        this.rating = rating;
        this.location = location;
        this.bankAccountNo = bankAccountNo;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBankAccountNo() { return bankAccountNo; }
    public void setBankAccountNo(String bankAccountNo) { this.bankAccountNo = bankAccountNo; }
}
