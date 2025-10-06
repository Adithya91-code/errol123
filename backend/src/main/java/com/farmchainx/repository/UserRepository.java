package com.farmchainx.repository;

import com.farmchainx.model.User;
import com.farmchainx.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    Optional<User> findByFarmerId(String farmerId);
    Optional<User> findByDistributorId(String distributorId);
}
