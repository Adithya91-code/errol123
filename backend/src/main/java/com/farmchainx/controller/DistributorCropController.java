package com.farmchainx.controller;

import com.farmchainx.model.DistributorCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.DistributorCropRepository;
import com.farmchainx.security.JwtUtil;
import com.farmchainx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/distributor/crops")
@CrossOrigin(origins = "*")
public class DistributorCropController {

    @Autowired
    private DistributorCropRepository distributorCropRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<DistributorCrop>> getAllCrops(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            List<DistributorCrop> crops = distributorCropRepository.findByUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@RequestHeader("Authorization") String authHeader, @RequestBody DistributorCrop crop) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            crop.setUser(user);
            DistributorCrop savedCrop = distributorCropRepository.save(crop);
            return ResponseEntity.ok(savedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable Long id,
                                       @RequestBody DistributorCrop cropDetails) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            DistributorCrop crop = distributorCropRepository.findById(id)
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
            crop.setDistributorLocation(cropDetails.getDistributorLocation());
            crop.setReceivedDate(cropDetails.getReceivedDate());
            crop.setSentToRetailer(cropDetails.getSentToRetailer());
            crop.setRetailerLocation(cropDetails.getRetailerLocation());

            DistributorCrop updatedCrop = distributorCropRepository.save(crop);
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

            DistributorCrop crop = distributorCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

            if (!crop.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }

            distributorCropRepository.delete(crop);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<DistributorCrop>> getAllDistributorCrops() {
        try {
            List<DistributorCrop> crops = distributorCropRepository.findAll();
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
