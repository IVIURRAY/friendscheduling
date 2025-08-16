package com.example.demo.dto;

import java.time.LocalDateTime;

public class FriendDto {
    private Long id;
    private String name;
    private String email;
    private Boolean isClose;
    private LocalDateTime createdAt;
    
    public FriendDto() {}
    
    public FriendDto(Long id, String name, String email, Boolean isClose, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isClose = isClose;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Boolean getIsClose() {
        return isClose;
    }
    
    public void setIsClose(Boolean isClose) {
        this.isClose = isClose;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
