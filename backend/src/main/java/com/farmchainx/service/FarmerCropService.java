package com.farmchainx.service;

import com.farmchainx.model.FarmerCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.FarmerCropRepository;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FarmerCropService {

    @Autowired
    private FarmerCropRepository farmerCropRepository;

    @Autowired
    private UserRepository userRepository;

    public FarmerCrop createCrop(FarmerCrop crop, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        crop.setUser(user);
        return farmerCropRepository.save(crop);
    }

    public List<FarmerCrop> getAllCrops() {
        return farmerCropRepository.findAll();
    }

    public List<FarmerCrop> getCropsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return farmerCropRepository.findByUserId(user.getId());
    }

    public List<FarmerCrop> getCropsByStatus(String status) {
        return farmerCropRepository.findByStatus(status);
    }

    public Optional<FarmerCrop> getCropById(Long id) {
        return farmerCropRepository.findById(id);
    }

    public FarmerCrop updateCrop(Long id, FarmerCrop cropDetails) {
        FarmerCrop crop = farmerCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        crop.setName(cropDetails.getName());
        crop.setCropType(cropDetails.getCropType());
        crop.setHarvestDate(cropDetails.getHarvestDate());
        crop.setExpiryDate(cropDetails.getExpiryDate());
        crop.setSoilType(cropDetails.getSoilType());
        crop.setPesticidesUsed(cropDetails.getPesticidesUsed());
        crop.setImageUrl(cropDetails.getImageUrl());
        crop.setFarmerId(cropDetails.getFarmerId());
        crop.setFarmerName(cropDetails.getFarmerName());
        crop.setFarmerLocation(cropDetails.getFarmerLocation());
        crop.setQuantity(cropDetails.getQuantity());
        crop.setQuantityUnit(cropDetails.getQuantityUnit());
        crop.setPricePerUnit(cropDetails.getPricePerUnit());
        crop.setStatus(cropDetails.getStatus());

        return farmerCropRepository.save(crop);
    }

    public void deleteCrop(Long id) {
        farmerCropRepository.deleteById(id);
    }
}
