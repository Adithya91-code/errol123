package com.farmchainx.service;

import com.farmchainx.model.DistributorCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.DistributorCropRepository;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DistributorCropService {

    @Autowired
    private DistributorCropRepository distributorCropRepository;

    @Autowired
    private UserRepository userRepository;

    public DistributorCrop createCrop(DistributorCrop crop, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        crop.setUser(user);
        return distributorCropRepository.save(crop);
    }

    public List<DistributorCrop> getAllCrops() {
        return distributorCropRepository.findAll();
    }

    public List<DistributorCrop> getCropsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return distributorCropRepository.findByUserId(user.getId());
    }

    public List<DistributorCrop> getCropsByStatus(String status) {
        return distributorCropRepository.findByStatus(status);
    }

    public Optional<DistributorCrop> getCropById(Long id) {
        return distributorCropRepository.findById(id);
    }

    public DistributorCrop updateCrop(Long id, DistributorCrop cropDetails) {
        DistributorCrop crop = distributorCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        crop.setFarmerCropId(cropDetails.getFarmerCropId());
        crop.setDistributorId(cropDetails.getDistributorId());
        crop.setDistributorName(cropDetails.getDistributorName());
        crop.setDistributorLocation(cropDetails.getDistributorLocation());
        crop.setReceivedDate(cropDetails.getReceivedDate());
        crop.setReceivedFromFarmerId(cropDetails.getReceivedFromFarmerId());
        crop.setReceivedFromFarmerName(cropDetails.getReceivedFromFarmerName());
        crop.setFarmerLocation(cropDetails.getFarmerLocation());
        crop.setQuantity(cropDetails.getQuantity());
        crop.setQuantityUnit(cropDetails.getQuantityUnit());
        crop.setPricePerUnit(cropDetails.getPricePerUnit());
        crop.setStatus(cropDetails.getStatus());

        return distributorCropRepository.save(crop);
    }

    public void deleteCrop(Long id) {
        distributorCropRepository.deleteById(id);
    }
}
