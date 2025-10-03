package com.farmchainx.controller;

import com.farmchainx.model.FarmerCrop;
import com.farmchainx.service.FarmerCropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/farmer-crops")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmerCropController {

    @Autowired
    private FarmerCropService farmerCropService;

    @PostMapping
    public ResponseEntity<FarmerCrop> createCrop(@Valid @RequestBody FarmerCrop crop, Authentication authentication) {
        FarmerCrop savedCrop = farmerCropService.createCrop(crop, authentication.getName());
        return ResponseEntity.ok(savedCrop);
    }

    @GetMapping
    public ResponseEntity<List<FarmerCrop>> getAllCrops() {
        List<FarmerCrop> crops = farmerCropService.getAllCrops();
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/my-crops")
    public ResponseEntity<List<FarmerCrop>> getMyCrops(Authentication authentication) {
        List<FarmerCrop> crops = farmerCropService.getCropsByUser(authentication.getName());
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FarmerCrop>> getCropsByStatus(@PathVariable String status) {
        List<FarmerCrop> crops = farmerCropService.getCropsByStatus(status);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmerCrop> getCropById(@PathVariable Long id) {
        return farmerCropService.getCropById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmerCrop> updateCrop(@PathVariable Long id, @Valid @RequestBody FarmerCrop cropDetails) {
        FarmerCrop updatedCrop = farmerCropService.updateCrop(id, cropDetails);
        return ResponseEntity.ok(updatedCrop);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        farmerCropService.deleteCrop(id);
        return ResponseEntity.ok().build();
    }
}
