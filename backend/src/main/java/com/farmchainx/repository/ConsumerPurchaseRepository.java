package com.farmchainx.repository;

import com.farmchainx.model.ConsumerPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsumerPurchaseRepository extends JpaRepository<ConsumerPurchase, Long> {
    List<ConsumerPurchase> findByUserId(Long userId);
    List<ConsumerPurchase> findByConsumerId(String consumerId);
    List<ConsumerPurchase> findByRetailerCropId(Long retailerCropId);
    List<ConsumerPurchase> findByPaymentStatus(String paymentStatus);
}
