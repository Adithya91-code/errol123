package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumer_purchases")
public class ConsumerPurchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "retailer_crop_id")
    private Long retailerCropId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "consumer_id", length = 10)
    private String consumerId;

    @Size(max = 100)
    @Column(name = "consumer_name")
    private String consumerName;

    @Size(max = 200)
    @Column(name = "consumer_location")
    private String consumerLocation;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "purchased_from_retailer_id")
    private String purchasedFromRetailerId;

    @Size(max = 100)
    @Column(name = "purchased_from_retailer_name")
    private String purchasedFromRetailerName;

    @Size(max = 200)
    @Column(name = "retailer_location")
    private String retailerLocation;

    @NotNull
    @Column(name = "quantity")
    private Double quantity;

    @Size(max = 20)
    @Column(name = "quantity_unit")
    private String quantityUnit;

    @Column(name = "price_per_unit")
    private Double pricePerUnit;

    @Column(name = "total_price")
    private Double totalPrice;

    @Size(max = 20)
    @Column(name = "payment_status")
    private String paymentStatus = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ConsumerPurchase() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRetailerCropId() {
        return retailerCropId;
    }

    public void setRetailerCropId(Long retailerCropId) {
        this.retailerCropId = retailerCropId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getConsumerId() {
        return consumerId;
    }

    public void setConsumerId(String consumerId) {
        this.consumerId = consumerId;
    }

    public String getConsumerName() {
        return consumerName;
    }

    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
    }

    public String getConsumerLocation() {
        return consumerLocation;
    }

    public void setConsumerLocation(String consumerLocation) {
        this.consumerLocation = consumerLocation;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getPurchasedFromRetailerId() {
        return purchasedFromRetailerId;
    }

    public void setPurchasedFromRetailerId(String purchasedFromRetailerId) {
        this.purchasedFromRetailerId = purchasedFromRetailerId;
    }

    public String getPurchasedFromRetailerName() {
        return purchasedFromRetailerName;
    }

    public void setPurchasedFromRetailerName(String purchasedFromRetailerName) {
        this.purchasedFromRetailerName = purchasedFromRetailerName;
    }

    public String getRetailerLocation() {
        return retailerLocation;
    }

    public void setRetailerLocation(String retailerLocation) {
        this.retailerLocation = retailerLocation;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getQuantityUnit() {
        return quantityUnit;
    }

    public void setQuantityUnit(String quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

    public Double getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(Double pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
