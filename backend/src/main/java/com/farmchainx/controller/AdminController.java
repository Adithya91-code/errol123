package com.farmchainx.controller;

import com.farmchainx.model.User;
import com.farmchainx.repository.DistributorCropRepository;
import com.farmchainx.repository.FarmerCropRepository;
import com.farmchainx.repository.RetailerCropRepository;
import com.farmchainx.repository.UserRepository;
import com.farmchainx.security.JwtUtil;
import com.farmchainx.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmerCropRepository farmerCropRepository;

    @Autowired
    private DistributorCropRepository distributorCropRepository;

    @Autowired
    private RetailerCropRepository retailerCropRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Transactional
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String authHeader, @PathVariable Long userId) {
        try {
            String token = authHeader.substring(7);
            Long adminId = jwtUtil.extractUserId(token);
            User admin = userService.findById(adminId);

            if (!admin.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(403).body("Only admins can delete users");
            }

            User userToDelete = userService.findById(userId);

            farmerCropRepository.deleteByUser(userToDelete);
            distributorCropRepository.deleteByUser(userToDelete);
            retailerCropRepository.deleteByUser(userToDelete);

            userRepository.delete(userToDelete);

            return ResponseEntity.ok("User and all associated crops deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestHeader("Authorization") String authHeader) {
        try {
            long totalUsers = userRepository.count();
            long totalFarmerCrops = farmerCropRepository.count();
            long totalDistributorCrops = distributorCropRepository.count();
            long totalRetailerCrops = retailerCropRepository.count();

            return ResponseEntity.ok(new StatsResponse(totalUsers, totalFarmerCrops, totalDistributorCrops, totalRetailerCrops));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    static class StatsResponse {
        public long totalUsers;
        public long totalFarmerCrops;
        public long totalDistributorCrops;
        public long totalRetailerCrops;

        public StatsResponse(long totalUsers, long totalFarmerCrops, long totalDistributorCrops, long totalRetailerCrops) {
            this.totalUsers = totalUsers;
            this.totalFarmerCrops = totalFarmerCrops;
            this.totalDistributorCrops = totalDistributorCrops;
            this.totalRetailerCrops = totalRetailerCrops;
        }
    }
}
