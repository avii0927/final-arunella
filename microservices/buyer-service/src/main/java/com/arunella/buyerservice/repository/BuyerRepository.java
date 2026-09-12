package com.arunella.buyerservice.repository;

import com.arunella.buyerservice.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByEmailAndPassword(String email, String password);
}
