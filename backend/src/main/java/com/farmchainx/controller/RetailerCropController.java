package com.farmchainx.controller;

import com.farmchainx.model.RetailerCrop;
import com.farmchainx.service.RetailerCropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/retailer-crops")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RetailerCropController {

    @Autowired
    private RetailerCropService retailerCropService;

    @PostMapping
    public ResponseEntity<RetailerCrop> createCrop(@Valid @RequestBody RetailerCrop crop, Authentication authentication) {
        RetailerCrop savedCrop = retailerCropService.createCrop(crop, authentication.getName());
        return ResponseEntity.ok(savedCrop);
    }

    @GetMapping
    public ResponseEntity<List<RetailerCrop>> getAllCrops() {
        List<RetailerCrop> crops = retailerCropService.getAllCrops();
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/my-crops")
    public ResponseEntity<List<RetailerCrop>> getMyCrops(Authentication authentication) {
        List<RetailerCrop> crops = retailerCropService.getCropsByUser(authentication.getName());
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RetailerCrop>> getCropsByStatus(@PathVariable String status) {
        List<RetailerCrop> crops = retailerCropService.getCropsByStatus(status);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RetailerCrop> getCropById(@PathVariable Long id) {
        return retailerCropService.getCropById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RetailerCrop> updateCrop(@PathVariable Long id, @Valid @RequestBody RetailerCrop cropDetails) {
        RetailerCrop updatedCrop = retailerCropService.updateCrop(id, cropDetails);
        return ResponseEntity.ok(updatedCrop);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        retailerCropService.deleteCrop(id);
        return ResponseEntity.ok().build();
    }
}
