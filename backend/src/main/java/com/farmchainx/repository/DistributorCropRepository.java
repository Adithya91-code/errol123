package com.farmchainx.repository;

import com.farmchainx.model.DistributorCrop;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributorCropRepository extends JpaRepository<DistributorCrop, Long> {
    List<DistributorCrop> findByUser(User user);
    List<DistributorCrop> findByUserOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
