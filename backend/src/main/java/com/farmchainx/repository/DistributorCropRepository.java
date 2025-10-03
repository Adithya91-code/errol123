package com.farmchainx.repository;

import com.farmchainx.model.DistributorCrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributorCropRepository extends JpaRepository<DistributorCrop, Long> {
    List<DistributorCrop> findByUserId(Long userId);
    List<DistributorCrop> findByStatus(String status);
    List<DistributorCrop> findByDistributorId(String distributorId);
    List<DistributorCrop> findByFarmerCropId(Long farmerCropId);
}
