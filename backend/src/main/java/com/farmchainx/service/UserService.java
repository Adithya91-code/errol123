package com.farmchainx.service;

import com.farmchainx.model.User;
import com.farmchainx.model.UserRole;
import com.farmchainx.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Random;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }

    public User registerUser(String email, String password, UserRole role, String name, String location) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setName(name);
        user.setLocation(location);

        if (role == UserRole.FARMER) {
            user.setFarmerId(generateUniqueFarmerId());
        } else if (role == UserRole.DISTRIBUTOR) {
            user.setDistributorId(generateUniqueDistributorId());
        }

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private String generateUniqueFarmerId() {
        String farmerId;
        do {
            farmerId = String.format("%03d", new Random().nextInt(1000));
        } while (userRepository.findByFarmerId(farmerId).isPresent());
        return farmerId;
    }

    private String generateUniqueDistributorId() {
        String distributorId;
        do {
            distributorId = String.format("%03d", new Random().nextInt(1000));
        } while (userRepository.findByDistributorId(distributorId).isPresent());
        return distributorId;
    }
}
