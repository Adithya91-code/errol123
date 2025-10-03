package com.farmchainx.controller;

import com.farmchainx.model.ConsumerPurchase;
import com.farmchainx.service.ConsumerPurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/consumer-purchases")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ConsumerPurchaseController {

    @Autowired
    private ConsumerPurchaseService consumerPurchaseService;

    @PostMapping
    public ResponseEntity<ConsumerPurchase> createPurchase(@Valid @RequestBody ConsumerPurchase purchase, Authentication authentication) {
        ConsumerPurchase savedPurchase = consumerPurchaseService.createPurchase(purchase, authentication.getName());
        return ResponseEntity.ok(savedPurchase);
    }

    @GetMapping
    public ResponseEntity<List<ConsumerPurchase>> getAllPurchases() {
        List<ConsumerPurchase> purchases = consumerPurchaseService.getAllPurchases();
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/my-purchases")
    public ResponseEntity<List<ConsumerPurchase>> getMyPurchases(Authentication authentication) {
        List<ConsumerPurchase> purchases = consumerPurchaseService.getPurchasesByUser(authentication.getName());
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/payment-status/{status}")
    public ResponseEntity<List<ConsumerPurchase>> getPurchasesByPaymentStatus(@PathVariable String status) {
        List<ConsumerPurchase> purchases = consumerPurchaseService.getPurchasesByPaymentStatus(status);
        return ResponseEntity.ok(purchases);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsumerPurchase> getPurchaseById(@PathVariable Long id) {
        return consumerPurchaseService.getPurchaseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsumerPurchase> updatePurchase(@PathVariable Long id, @Valid @RequestBody ConsumerPurchase purchaseDetails) {
        ConsumerPurchase updatedPurchase = consumerPurchaseService.updatePurchase(id, purchaseDetails);
        return ResponseEntity.ok(updatedPurchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(@PathVariable Long id) {
        consumerPurchaseService.deletePurchase(id);
        return ResponseEntity.ok().build();
    }
}
