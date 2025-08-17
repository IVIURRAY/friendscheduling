package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.service.GoogleCalendarService;
import com.example.demo.service.UserService;
import com.google.api.services.calendar.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "*")
public class CalendarController {

    @Autowired
    private GoogleCalendarService googleCalendarService;

    @Autowired
    private UserService userService;

    @GetMapping("/events/upcoming")
    public ResponseEntity<?> getUpcomingEvents(
            @AuthenticationPrincipal OidcUser oidcUser,
            @RequestParam(defaultValue = "10") int maxResults) {
        try {
            if (oidcUser == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }

            String email = oidcUser.getEmail();
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            List<Event> events = googleCalendarService.getUpcomingEvents(user, maxResults);

            Map<String, Object> response = new HashMap<>();
            response.put("events", events);
            response.put("count", events.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/events/range")
    public ResponseEntity<?> getEventsByDateRange(
            @AuthenticationPrincipal OidcUser oidcUser,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            if (oidcUser == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }

            String email = oidcUser.getEmail();
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);

            List<Event> events = googleCalendarService.getUserCalendarEvents(user, start, end);

            Map<String, Object> response = new HashMap<>();
            response.put("events", events);
            response.put("count", events.size());
            response.put("startDate", startDate);
            response.put("endDate", endDate);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}