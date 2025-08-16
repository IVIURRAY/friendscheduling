package com.example.demo.dto;

import java.time.LocalDateTime;

public class MeetingDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private UserDto organizer;
    private UserDto friend;
    private String status;
    private LocalDateTime createdAt;
    
    public MeetingDto() {}
    
    public MeetingDto(Long id, String title, String description, LocalDateTime startTime, 
                     LocalDateTime endTime, String location, UserDto organizer, UserDto friend, 
                     String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.organizer = organizer;
        this.friend = friend;
        this.status = status;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public UserDto getOrganizer() {
        return organizer;
    }
    
    public void setOrganizer(UserDto organizer) {
        this.organizer = organizer;
    }
    
    public UserDto getFriend() {
        return friend;
    }
    
    public void setFriend(UserDto friend) {
        this.friend = friend;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
