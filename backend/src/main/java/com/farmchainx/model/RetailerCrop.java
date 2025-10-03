package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "retailer_crops")
public class RetailerCrop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "distributor_crop_id")
    private Long distributorCropId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "retailer_id", length = 10)
    private String retailerId;

    @Size(max = 100)
    @Column(name = "retailer_name")
    private String retailerName;

    @Size(max = 200)
    @Column(name = "retailer_location")
    private String retailerLocation;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "received_from_distributor_id")
    private String receivedFromDistributorId;

    @Size(max = 100)
    @Column(name = "received_from_distributor_name")
    private String receivedFromDistributorName;

    @Size(max = 200)
    @Column(name = "distributor_location")
    private String distributorLocation;

    @NotNull
    @Column(name = "quantity")
    private Double quantity;

    @Size(max = 20)
    @Column(name = "quantity_unit")
    private String quantityUnit;

    @Column(name = "price_per_unit")
    private Double pricePerUnit;

    @Size(max = 20)
    @Column(name = "status")
    private String status = "IN_STOCK";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RetailerCrop() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDistributorCropId() {
        return distributorCropId;
    }

    public void setDistributorCropId(Long distributorCropId) {
        this.distributorCropId = distributorCropId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRetailerId() {
        return retailerId;
    }

    public void setRetailerId(String retailerId) {
        this.retailerId = retailerId;
    }

    public String getRetailerName() {
        return retailerName;
    }

    public void setRetailerName(String retailerName) {
        this.retailerName = retailerName;
    }

    public String getRetailerLocation() {
        return retailerLocation;
    }

    public void setRetailerLocation(String retailerLocation) {
        this.retailerLocation = retailerLocation;
    }

    public LocalDate getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDate receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getReceivedFromDistributorId() {
        return receivedFromDistributorId;
    }

    public void setReceivedFromDistributorId(String receivedFromDistributorId) {
        this.receivedFromDistributorId = receivedFromDistributorId;
    }

    public String getReceivedFromDistributorName() {
        return receivedFromDistributorName;
    }

    public void setReceivedFromDistributorName(String receivedFromDistributorName) {
        this.receivedFromDistributorName = receivedFromDistributorName;
    }

    public String getDistributorLocation() {
        return distributorLocation;
    }

    public void setDistributorLocation(String distributorLocation) {
        this.distributorLocation = distributorLocation;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
