package com.example.demo.repository;

import com.example.demo.entity.Meeting;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    
    @Query("SELECT m FROM Meeting m WHERE (m.organizer = :user OR m.friend = :user) AND m.startTime >= :now ORDER BY m.startTime ASC")
    List<Meeting> findUpcomingMeetingsByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT m FROM Meeting m WHERE (m.organizer = :user OR m.friend = :user) AND m.startTime >= :startDate AND m.startTime < :endDate ORDER BY m.startTime ASC")
    List<Meeting> findMeetingsByUserAndDateRange(@Param("user") User user, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT m FROM Meeting m WHERE (m.organizer = :user OR m.friend = :user) AND m.status = 'SCHEDULED' ORDER BY m.startTime ASC")
    List<Meeting> findScheduledMeetingsByUser(@Param("user") User user);
}
