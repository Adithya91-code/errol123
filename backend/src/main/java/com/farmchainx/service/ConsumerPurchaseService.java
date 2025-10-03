package com.farmchainx.service;

import com.farmchainx.model.ConsumerPurchase;
import com.farmchainx.model.User;
import com.farmchainx.repository.ConsumerPurchaseRepository;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ConsumerPurchaseService {

    @Autowired
    private ConsumerPurchaseRepository consumerPurchaseRepository;

    @Autowired
    private UserRepository userRepository;

    public ConsumerPurchase createPurchase(ConsumerPurchase purchase, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        purchase.setUser(user);
        return consumerPurchaseRepository.save(purchase);
    }

    public List<ConsumerPurchase> getAllPurchases() {
        return consumerPurchaseRepository.findAll();
    }

    public List<ConsumerPurchase> getPurchasesByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return consumerPurchaseRepository.findByUserId(user.getId());
    }

    public List<ConsumerPurchase> getPurchasesByPaymentStatus(String status) {
        return consumerPurchaseRepository.findByPaymentStatus(status);
    }

    public Optional<ConsumerPurchase> getPurchaseById(Long id) {
        return consumerPurchaseRepository.findById(id);
    }

    public ConsumerPurchase updatePurchase(Long id, ConsumerPurchase purchaseDetails) {
        ConsumerPurchase purchase = consumerPurchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        purchase.setRetailerCropId(purchaseDetails.getRetailerCropId());
        purchase.setConsumerId(purchaseDetails.getConsumerId());
        purchase.setConsumerName(purchaseDetails.getConsumerName());
        purchase.setConsumerLocation(purchaseDetails.getConsumerLocation());
        purchase.setPurchaseDate(purchaseDetails.getPurchaseDate());
        purchase.setPurchasedFromRetailerId(purchaseDetails.getPurchasedFromRetailerId());
        purchase.setPurchasedFromRetailerName(purchaseDetails.getPurchasedFromRetailerName());
        purchase.setRetailerLocation(purchaseDetails.getRetailerLocation());
        purchase.setQuantity(purchaseDetails.getQuantity());
        purchase.setQuantityUnit(purchaseDetails.getQuantityUnit());
        purchase.setPricePerUnit(purchaseDetails.getPricePerUnit());
        purchase.setTotalPrice(purchaseDetails.getTotalPrice());
        purchase.setPaymentStatus(purchaseDetails.getPaymentStatus());

        return consumerPurchaseRepository.save(purchase);
    }

    public void deletePurchase(Long id) {
        consumerPurchaseRepository.deleteById(id);
    }
}
