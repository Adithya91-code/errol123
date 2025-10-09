package com.farmchainx.controller;

import com.farmchainx.model.FarmerCrop;
import com.farmchainx.model.User;
import com.farmchainx.repository.FarmerCropRepository;
import com.farmchainx.security.JwtUtil;
import com.farmchainx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmer/crops")
@CrossOrigin(origins = "*")
public class FarmerCropController {

    @Autowired
    private FarmerCropRepository farmerCropRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<FarmerCrop>> getAllCrops(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            List<FarmerCrop> crops = farmerCropRepository.findByUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@RequestHeader("Authorization") String authHeader, @RequestBody FarmerCrop crop) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            User user = userService.findById(userId);

            crop.setUser(user);
            FarmerCrop savedCrop = farmerCropRepository.save(crop);
            return ResponseEntity.ok(savedCrop);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(@RequestHeader("Authorization") String authHeader,
                                       @PathVariable Long id,
                                       @RequestBody FarmerCrop cropDetails) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);

            FarmerCrop crop = farmerCropRepository.findById(id)
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
            crop.setFarmerLocation(cropDetails.getFarmerLocation());

            FarmerCrop updatedCrop = farmerCropRepository.save(crop);
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

            FarmerCrop crop = farmerCropRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

            if (!crop.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }

            farmerCropRepository.delete(crop);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<FarmerCrop>> getAllFarmerCrops() {
        try {
            List<FarmerCrop> crops = farmerCropRepository.findAll();
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/by-farmer/{farmerId}")
    public ResponseEntity<List<FarmerCrop>> getCropsByFarmerId(@PathVariable String farmerId) {
        try {
            List<FarmerCrop> crops = farmerCropRepository.findAll()
                .stream()
                .filter(crop -> farmerId.equals(crop.getUser().getFarmerId()))
                .toList();
            return ResponseEntity.ok(crops);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
