package com.farmchainx.controller;

import com.farmchainx.model.DistributorCrop;
import com.farmchainx.service.DistributorCropService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/distributor-crops")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DistributorCropController {

    @Autowired
    private DistributorCropService distributorCropService;

    @PostMapping
    public ResponseEntity<DistributorCrop> createCrop(@Valid @RequestBody DistributorCrop crop, Authentication authentication) {
        DistributorCrop savedCrop = distributorCropService.createCrop(crop, authentication.getName());
        return ResponseEntity.ok(savedCrop);
    }

    @GetMapping
    public ResponseEntity<List<DistributorCrop>> getAllCrops() {
        List<DistributorCrop> crops = distributorCropService.getAllCrops();
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/my-crops")
    public ResponseEntity<List<DistributorCrop>> getMyCrops(Authentication authentication) {
        List<DistributorCrop> crops = distributorCropService.getCropsByUser(authentication.getName());
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DistributorCrop>> getCropsByStatus(@PathVariable String status) {
        List<DistributorCrop> crops = distributorCropService.getCropsByStatus(status);
        return ResponseEntity.ok(crops);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DistributorCrop> getCropById(@PathVariable Long id) {
        return distributorCropService.getCropById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DistributorCrop> updateCrop(@PathVariable Long id, @Valid @RequestBody DistributorCrop cropDetails) {
        DistributorCrop updatedCrop = distributorCropService.updateCrop(id, cropDetails);
        return ResponseEntity.ok(updatedCrop);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrop(@PathVariable Long id) {
        distributorCropService.deleteCrop(id);
        return ResponseEntity.ok().build();
    }
}
