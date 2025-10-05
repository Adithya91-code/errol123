package com.farmchainx.controller;

import com.farmchainx.model.*;
import com.farmchainx.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/crops")
public class CropController {

    @Autowired
    private FarmerCropService farmerCropService;

    @Autowired
    private DistributorCropService distributorCropService;

    @Autowired
    private RetailerCropService retailerCropService;

    @Autowired
    private ConsumerPurchaseService consumerPurchaseService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserCrops() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        List<Map<String, Object>> crops = new ArrayList<>();

        if (user.getRole() == UserRole.FARMER) {
            List<FarmerCrop> farmerCrops = farmerCropService.getCropsByUser(user.getEmail());
            farmerCrops.forEach(fc -> crops.add(convertFarmerCropToMap(fc)));
        } else if (user.getRole() == UserRole.DISTRIBUTOR) {
            List<DistributorCrop> distributorCrops = distributorCropService.getCropsByUser(user.getEmail());
            distributorCrops.forEach(dc -> crops.add(convertDistributorCropToMap(dc)));
        } else if (user.getRole() == UserRole.RETAILER) {
            List<RetailerCrop> retailerCrops = retailerCropService.getCropsByUser(user.getEmail());
            retailerCrops.forEach(rc -> crops.add(convertRetailerCropToMap(rc)));
        } else if (user.getRole() == UserRole.CONSUMER) {
            List<ConsumerPurchase> purchases = consumerPurchaseService.getPurchasesByUser(user.getEmail());
            purchases.forEach(cp -> crops.add(convertConsumerPurchaseToMap(cp)));
        }

        return ResponseEntity.ok(crops);
    }

    @PostMapping
    public ResponseEntity<?> createCrop(@Valid @RequestBody Map<String, Object> cropData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            if (user.getRole() == UserRole.FARMER) {
                FarmerCrop farmerCrop = mapToFarmerCrop(cropData);
                farmerCrop.setFarmerId(user.getFarmerId());
                farmerCrop.setFarmerName(user.getName());
                farmerCrop.setFarmerLocation(user.getLocation());
                FarmerCrop saved = farmerCropService.createCrop(farmerCrop, user.getEmail());
                return ResponseEntity.ok(convertFarmerCropToMap(saved));
            } else {
                return ResponseEntity.badRequest().body("Only farmers can create crops");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating crop: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCrop(@PathVariable Long id, @Valid @RequestBody Map<String, Object> cropData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            if (user.getRole() == UserRole.FARMER) {
                FarmerCrop farmerCrop = mapToFarmerCrop(cropData);
                FarmerCrop updated = farmerCropService.updateCrop(id, farmerCrop);
                return ResponseEntity.ok(convertFarmerCropToMap(updated));
            } else if (user.getRole() == UserRole.DISTRIBUTOR) {
                DistributorCrop distributorCrop = mapToDistributorCrop(cropData);
                DistributorCrop updated = distributorCropService.updateCrop(id, distributorCrop);
                return ResponseEntity.ok(convertDistributorCropToMap(updated));
            } else if (user.getRole() == UserRole.RETAILER) {
                RetailerCrop retailerCrop = mapToRetailerCrop(cropData);
                RetailerCrop updated = retailerCropService.updateCrop(id, retailerCrop);
                return ResponseEntity.ok(convertRetailerCropToMap(updated));
            }

            return ResponseEntity.badRequest().body("Invalid user role");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating crop: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCrop(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) auth.getPrincipal();

            if (user.getRole() == UserRole.FARMER) {
                farmerCropService.deleteCrop(id);
            } else if (user.getRole() == UserRole.DISTRIBUTOR) {
                distributorCropService.deleteCrop(id);
            } else if (user.getRole() == UserRole.RETAILER) {
                retailerCropService.deleteCrop(id);
            } else {
                return ResponseEntity.badRequest().body("Invalid user role");
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting crop: " + e.getMessage());
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Map<String, Object>>> getCropsByFarmerId(@PathVariable String farmerId) {
        List<FarmerCrop> farmerCrops = farmerCropService.getCropsByUser(farmerId);
        List<Map<String, Object>> crops = new ArrayList<>();
        farmerCrops.forEach(fc -> crops.add(convertFarmerCropToMap(fc)));
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/distributor/{distributorId}")
    public ResponseEntity<List<Map<String, Object>>> getCropsByDistributorId(@PathVariable String distributorId) {
        List<DistributorCrop> distributorCrops = distributorCropService.getCropsByUser(distributorId);
        List<Map<String, Object>> crops = new ArrayList<>();
        distributorCrops.forEach(dc -> crops.add(convertDistributorCropToMap(dc)));
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/scan/{cropId}")
    public ResponseEntity<?> getCropForScanning(@PathVariable Long cropId) {
        try {
            Optional<FarmerCrop> farmerCropOpt = farmerCropService.getCropById(cropId);
            if (farmerCropOpt.isPresent()) {
                return ResponseEntity.ok(convertFarmerCropToMap(farmerCropOpt.get()));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Crop not found");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving crop: " + e.getMessage());
        }
    }

    private Map<String, Object> convertFarmerCropToMap(FarmerCrop fc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", fc.getId());
        map.put("name", fc.getName());
        map.put("cropType", fc.getCropType());
        map.put("harvestDate", fc.getHarvestDate());
        map.put("expiryDate", fc.getExpiryDate());
        map.put("soilType", fc.getSoilType());
        map.put("pesticidesUsed", fc.getPesticidesUsed());
        map.put("imageUrl", fc.getImageUrl());
        map.put("farmerId", fc.getFarmerId());
        map.put("farmerName", fc.getFarmerName());
        map.put("farmerLocation", fc.getFarmerLocation());
        map.put("quantity", fc.getQuantity());
        map.put("quantityUnit", fc.getQuantityUnit());
        map.put("pricePerUnit", fc.getPricePerUnit());
        map.put("status", fc.getStatus());
        map.put("createdAt", fc.getCreatedAt());
        return map;
    }

    private Map<String, Object> convertDistributorCropToMap(DistributorCrop dc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", dc.getId());
        map.put("farmerCropId", dc.getFarmerCropId());
        map.put("distributorId", dc.getDistributorId());
        map.put("distributorName", dc.getDistributorName());
        map.put("distributorLocation", dc.getDistributorLocation());
        map.put("receivedDate", dc.getReceivedDate());
        map.put("quantity", dc.getQuantity());
        map.put("quantityUnit", dc.getQuantityUnit());
        map.put("pricePerUnit", dc.getPricePerUnit());
        map.put("status", dc.getStatus());
        return map;
    }

    private Map<String, Object> convertRetailerCropToMap(RetailerCrop rc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", rc.getId());
        map.put("distributorCropId", rc.getDistributorCropId());
        map.put("retailerId", rc.getRetailerId());
        map.put("retailerName", rc.getRetailerName());
        map.put("retailerLocation", rc.getRetailerLocation());
        map.put("receivedDate", rc.getReceivedDate());
        map.put("quantity", rc.getQuantity());
        map.put("quantityUnit", rc.getQuantityUnit());
        map.put("pricePerUnit", rc.getPricePerUnit());
        map.put("status", rc.getStatus());
        return map;
    }

    private Map<String, Object> convertConsumerPurchaseToMap(ConsumerPurchase cp) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", cp.getId());
        map.put("retailerCropId", cp.getRetailerCropId());
        map.put("consumerId", cp.getConsumerId());
        map.put("consumerName", cp.getConsumerName());
        map.put("purchaseDate", cp.getPurchaseDate());
        map.put("quantity", cp.getQuantity());
        map.put("totalPrice", cp.getTotalPrice());
        map.put("paymentStatus", cp.getPaymentStatus());
        return map;
    }

    private FarmerCrop mapToFarmerCrop(Map<String, Object> data) {
        FarmerCrop fc = new FarmerCrop();
        fc.setName((String) data.get("name"));
        fc.setCropType((String) data.get("cropType"));
        fc.setHarvestDate(LocalDate.parse((String) data.get("harvestDate")));
        fc.setExpiryDate(LocalDate.parse((String) data.get("expiryDate")));
        fc.setSoilType((String) data.get("soilType"));
        fc.setPesticidesUsed((String) data.get("pesticidesUsed"));
        fc.setImageUrl((String) data.get("imageUrl"));
        if (data.containsKey("quantity")) fc.setQuantity(((Number) data.get("quantity")).doubleValue());
        if (data.containsKey("quantityUnit")) fc.setQuantityUnit((String) data.get("quantityUnit"));
        if (data.containsKey("pricePerUnit")) fc.setPricePerUnit(((Number) data.get("pricePerUnit")).doubleValue());
        if (data.containsKey("status")) fc.setStatus((String) data.get("status"));
        return fc;
    }

    private DistributorCrop mapToDistributorCrop(Map<String, Object> data) {
        DistributorCrop dc = new DistributorCrop();
        if (data.containsKey("farmerCropId")) dc.setFarmerCropId(((Number) data.get("farmerCropId")).longValue());
        if (data.containsKey("quantity")) dc.setQuantity(((Number) data.get("quantity")).doubleValue());
        if (data.containsKey("quantityUnit")) dc.setQuantityUnit((String) data.get("quantityUnit"));
        if (data.containsKey("pricePerUnit")) dc.setPricePerUnit(((Number) data.get("pricePerUnit")).doubleValue());
        if (data.containsKey("status")) dc.setStatus((String) data.get("status"));
        return dc;
    }

    private RetailerCrop mapToRetailerCrop(Map<String, Object> data) {
        RetailerCrop rc = new RetailerCrop();
        if (data.containsKey("distributorCropId")) rc.setDistributorCropId(((Number) data.get("distributorCropId")).longValue());
        if (data.containsKey("quantity")) rc.setQuantity(((Number) data.get("quantity")).doubleValue());
        if (data.containsKey("quantityUnit")) rc.setQuantityUnit((String) data.get("quantityUnit"));
        if (data.containsKey("pricePerUnit")) rc.setPricePerUnit(((Number) data.get("pricePerUnit")).doubleValue());
        if (data.containsKey("status")) rc.setStatus((String) data.get("status"));
        return rc;
    }
}
