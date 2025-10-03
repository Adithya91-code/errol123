package com.farmchainx.repository;

import com.farmchainx.model.FarmerCrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmerCropRepository extends JpaRepository<FarmerCrop, Long> {
    List<FarmerCrop> findByUserId(Long userId);
    List<FarmerCrop> findByStatus(String status);
    List<FarmerCrop> findByFarmerId(String farmerId);
}
