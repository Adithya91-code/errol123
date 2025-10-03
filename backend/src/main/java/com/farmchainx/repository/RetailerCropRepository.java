package com.farmchainx.repository;

import com.farmchainx.model.RetailerCrop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetailerCropRepository extends JpaRepository<RetailerCrop, Long> {
    List<RetailerCrop> findByUserId(Long userId);
    List<RetailerCrop> findByStatus(String status);
    List<RetailerCrop> findByRetailerId(String retailerId);
    List<RetailerCrop> findByDistributorCropId(Long distributorCropId);
}
