package com.farmchainx.dto;

import com.farmchainx.model.UserRole;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private UserRole role;
    private String name;
    private String location;
    private String farmerId;
    private String distributorId;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, UserRole role, String name, String location, String farmerId, String distributorId) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.role = role;
        this.name = name;
        this.location = location;
        this.farmerId = farmerId;
        this.distributorId = distributorId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getDistributorId() {
        return distributorId;
    }

    public void setDistributorId(String distributorId) {
        this.distributorId = distributorId;
    }
}
