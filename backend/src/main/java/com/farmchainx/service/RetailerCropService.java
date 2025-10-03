package com.farmchainx.service;

import com.farmchainx.model.RetailerCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.RetailerCropRepository;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RetailerCropService {

    @Autowired
    private RetailerCropRepository retailerCropRepository;

    @Autowired
    private UserRepository userRepository;

    public RetailerCrop createCrop(RetailerCrop crop, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        crop.setUser(user);
        return retailerCropRepository.save(crop);
    }

    public List<RetailerCrop> getAllCrops() {
        return retailerCropRepository.findAll();
    }

    public List<RetailerCrop> getCropsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return retailerCropRepository.findByUserId(user.getId());
    }

    public List<RetailerCrop> getCropsByStatus(String status) {
        return retailerCropRepository.findByStatus(status);
    }

    public Optional<RetailerCrop> getCropById(Long id) {
        return retailerCropRepository.findById(id);
    }

    public RetailerCrop updateCrop(Long id, RetailerCrop cropDetails) {
        RetailerCrop crop = retailerCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        crop.setDistributorCropId(cropDetails.getDistributorCropId());
        crop.setRetailerId(cropDetails.getRetailerId());
        crop.setRetailerName(cropDetails.getRetailerName());
        crop.setRetailerLocation(cropDetails.getRetailerLocation());
        crop.setReceivedDate(cropDetails.getReceivedDate());
        crop.setReceivedFromDistributorId(cropDetails.getReceivedFromDistributorId());
        crop.setReceivedFromDistributorName(cropDetails.getReceivedFromDistributorName());
        crop.setDistributorLocation(cropDetails.getDistributorLocation());
        crop.setQuantity(cropDetails.getQuantity());
        crop.setQuantityUnit(cropDetails.getQuantityUnit());
        crop.setPricePerUnit(cropDetails.getPricePerUnit());
        crop.setStatus(cropDetails.getStatus());

        return retailerCropRepository.save(crop);
    }

    public void deleteCrop(Long id) {
        retailerCropRepository.deleteById(id);
    }
}
