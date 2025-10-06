package com.farmchainx.controller;

import com.farmchainx.model.RetailerCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.RetailerCropRepository;
import com.farmchainx.security.JwtUtil;
import com.farmchainx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/retailer/crops")
@CrossOrigin(origins = "*")
public class RetailerCropController {

    @Autowired
    private RetailerCropRepository retailerCropRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<RetailerCrop>> getAllCrops(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            List<RetailerCrop> crops = retailerCropRepository.findByUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@RequestHeader("Authorization") String authHeader, @RequestBody RetailerCrop crop) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            crop.setUser(user);
            RetailerCrop savedCrop = retailerCropRepository.save(crop);
            return ResponseEntity.ok(savedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable Long id,
                                       @RequestBody RetailerCrop cropDetails) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            RetailerCrop crop = retailerCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

            if (!crop.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }

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
            crop.setDistributorId(cropDetails.getDistributorId());
            crop.setDistributorName(cropDetails.getDistributorName());
            crop.setDistributorLocation(cropDetails.getDistributorLocation());
            crop.setRetailerLocation(cropDetails.getRetailerLocation());
            crop.setReceivedDate(cropDetails.getReceivedDate());

            RetailerCrop updatedCrop = retailerCropRepository.save(crop);
            return ResponseEntity.ok(updatedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrop(@RequestHeader("Authorization") String authHeader, @PathVariable Long id) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            RetailerCrop crop = retailerCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

            if (!crop.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }

            retailerCropRepository.delete(crop);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
