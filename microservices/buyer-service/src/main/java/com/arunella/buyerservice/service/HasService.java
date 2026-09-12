package com.arunella.buyerservice.service;

import com.arunella.buyerservice.entity.Has;
import com.arunella.buyerservice.repository.HasRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HasService {

    private final HasRepository hasRepository;

    public HasService(HasRepository hasRepository) {
        this.hasRepository = hasRepository;
    }

    public Has saveHas(Has has) {
        return hasRepository.save(has);
    }

    public List<Has> getAllHasLinks() {
        return hasRepository.findAll();
    }

    public List<Has> getHasByOrderId(Long orderId) {
        return hasRepository.findByOrderId(orderId);
    }

    public List<Has> getHasByProductId(Long productId) {
        return hasRepository.findByProductId(productId);
    }

    public void deleteHas(Long id) {
        hasRepository.deleteById(id);
    }
}
