package com.example.demo.service;

import com.example.demo.dto.MeetingDto;
import com.example.demo.dto.UserDto;
import com.example.demo.entity.Meeting;
import com.example.demo.entity.User;
import com.example.demo.repository.MeetingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingService {
    
    @Autowired
    private MeetingRepository meetingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    public List<MeetingDto> getUpcomingMeetings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Meeting> meetings = meetingRepository.findUpcomingMeetingsByUser(user, LocalDateTime.now());
        
        return meetings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MeetingDto> getMeetingsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Meeting> meetings = meetingRepository.findMeetingsByUserAndDateRange(user, startDate, endDate);
        
        return meetings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public MeetingDto createMeeting(Long organizerId, Long friendId, String title, String description,
                                   LocalDateTime startTime, LocalDateTime endTime, String location) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        Meeting meeting = new Meeting(title, description, startTime, endTime, location, organizer, friend);
        meeting = meetingRepository.save(meeting);
        
        return convertToDto(meeting);
    }
    
    public MeetingDto updateMeetingStatus(Long meetingId, Meeting.MeetingStatus status) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        meeting.setStatus(status);
        meeting = meetingRepository.save(meeting);
        
        return convertToDto(meeting);
    }
    
    public void deleteMeeting(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));
        
        meetingRepository.delete(meeting);
    }
    
    private MeetingDto convertToDto(Meeting meeting) {
        UserDto organizerDto = userService.convertToDto(meeting.getOrganizer());
        UserDto friendDto = userService.convertToDto(meeting.getFriend());
        
        return new MeetingDto(
                meeting.getId(),
                meeting.getTitle(),
                meeting.getDescription(),
                meeting.getStartTime(),
                meeting.getEndTime(),
                meeting.getLocation(),
                organizerDto,
                friendDto,
                meeting.getStatus().toString(),
                meeting.getCreatedAt()
        );
    }
}
