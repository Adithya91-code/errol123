package com.farmchainx.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "distributor_crops")
public class DistributorCrop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "farmer_crop_id")
    private Long farmerCropId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "distributor_id", length = 10)
    private String distributorId;

    @Size(max = 100)
    @Column(name = "distributor_name")
    private String distributorName;

    @Size(max = 200)
    @Column(name = "distributor_location")
    private String distributorLocation;

    @Column(name = "received_date")
    private LocalDate receivedDate;

    @Column(name = "received_from_farmer_id")
    private String receivedFromFarmerId;

    @Size(max = 100)
    @Column(name = "received_from_farmer_name")
    private String receivedFromFarmerName;

    @Size(max = 200)
    @Column(name = "farmer_location")
    private String farmerLocation;

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

    public DistributorCrop() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmerCropId() {
        return farmerCropId;
    }

    public void setFarmerCropId(Long farmerCropId) {
        this.farmerCropId = farmerCropId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDistributorId() {
        return distributorId;
    }

    public void setDistributorId(String distributorId) {
        this.distributorId = distributorId;
    }

    public String getDistributorName() {
        return distributorName;
    }

    public void setDistributorName(String distributorName) {
        this.distributorName = distributorName;
    }

    public String getDistributorLocation() {
        return distributorLocation;
    }

    public void setDistributorLocation(String distributorLocation) {
        this.distributorLocation = distributorLocation;
    }

    public LocalDate getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDate receivedDate) {
        this.receivedDate = receivedDate;
    }

    public String getReceivedFromFarmerId() {
        return receivedFromFarmerId;
    }

    public void setReceivedFromFarmerId(String receivedFromFarmerId) {
        this.receivedFromFarmerId = receivedFromFarmerId;
    }

    public String getReceivedFromFarmerName() {
        return receivedFromFarmerName;
    }

    public void setReceivedFromFarmerName(String receivedFromFarmerName) {
        this.receivedFromFarmerName = receivedFromFarmerName;
    }

    public String getFarmerLocation() {
        return farmerLocation;
    }

    public void setFarmerLocation(String farmerLocation) {
        this.farmerLocation = farmerLocation;
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
