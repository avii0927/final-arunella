package com.arunella.farmerservice.service;

import com.arunella.farmerservice.entity.Crop;
import com.arunella.farmerservice.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;

    public CropService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public Crop saveCrop(Crop crop) {
        return cropRepository.save(crop);
    }

    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    public Crop getCropById(Long id) {
        return cropRepository.findById(id).orElse(null);
    }

    public List<Crop> getCropsByStatus(String status) {
        return cropRepository.findByStatus(status);
    }

    public List<Crop> getCropsByFarmer(Long farmerId) {
        return cropRepository.findByFarmerUserId(farmerId);
    }

    public List<Crop> searchCropsByName(String name) {
        return cropRepository.findByProductNameContainingIgnoreCase(name);
    }

    public Crop updateCrop(Long id, Crop cropData) {
        Crop existing = cropRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setProductName(cropData.getProductName());
            existing.setPricePerKg(cropData.getPricePerKg());
            existing.setStock(cropData.getStock());
            existing.setStatus(cropData.getStatus());
            existing.setExpDate(cropData.getExpDate());
            existing.setDescription(cropData.getDescription());
            return cropRepository.save(existing);
        }
        return null;
    }

    public void deleteCrop(Long id) {
        cropRepository.deleteById(id);
    }
}
