package com.farmchainx.repository;

import com.farmchainx.model.RetailerCrop;
import com.farmchainx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetailerCropRepository extends JpaRepository<RetailerCrop, Long> {
    List<RetailerCrop> findByUser(User user);
    List<RetailerCrop> findByUserOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
