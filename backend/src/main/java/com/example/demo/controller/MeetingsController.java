package com.example.demo.controller;

import com.example.demo.dto.MeetingDto;
import com.example.demo.entity.Meeting;
import com.example.demo.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*")
public class MeetingsController {
    
    @Autowired
    private MeetingService meetingService;
    
    @GetMapping("/{userId}/upcoming")
    public ResponseEntity<List<MeetingDto>> getUpcomingMeetings(@PathVariable Long userId) {
        try {
            List<MeetingDto> meetings = meetingService.getUpcomingMeetings(userId);
            return ResponseEntity.ok(meetings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{userId}/range")
    public ResponseEntity<List<MeetingDto>> getMeetingsByDateRange(
            @PathVariable Long userId,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            
            List<MeetingDto> meetings = meetingService.getMeetingsByDateRange(userId, start, end);
            return ResponseEntity.ok(meetings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createMeeting(@RequestBody Map<String, Object> request) {
        try {
            Long organizerId = Long.valueOf(request.get("organizerId").toString());
            Long friendId = Long.valueOf(request.get("friendId").toString());
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            String location = (String) request.get("location");
            
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime startTime = LocalDateTime.parse((String) request.get("startTime"), formatter);
            LocalDateTime endTime = LocalDateTime.parse((String) request.get("endTime"), formatter);
            
            MeetingDto meeting = meetingService.createMeeting(organizerId, friendId, title, description, startTime, endTime, location);
            return ResponseEntity.ok(meeting);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{meetingId}/status")
    public ResponseEntity<?> updateMeetingStatus(
            @PathVariable Long meetingId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            MeetingDto meeting = meetingService.updateMeetingStatus(meetingId, Meeting.MeetingStatus.valueOf(status));
            return ResponseEntity.ok(meeting);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{meetingId}")
    public ResponseEntity<?> deleteMeeting(@PathVariable Long meetingId) {
        try {
            meetingService.deleteMeeting(meetingId);
            return ResponseEntity.ok(Map.of("message", "Meeting deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
