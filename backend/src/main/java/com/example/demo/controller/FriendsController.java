package com.example.demo.controller;

import com.example.demo.dto.FriendDto;
import com.example.demo.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendsController {
    
    @Autowired
    private FriendshipService friendshipService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<List<FriendDto>> getFriends(@PathVariable Long userId) {
        try {
            List<FriendDto> friends = friendshipService.getFriends(userId);
            return ResponseEntity.ok(friends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{userId}/close")
    public ResponseEntity<List<FriendDto>> getCloseFriends(@PathVariable Long userId) {
        try {
            List<FriendDto> closeFriends = friendshipService.getCloseFriends(userId);
            return ResponseEntity.ok(closeFriends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = friendshipService.getDashboardStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addFriend(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String friendEmail = request.get("email");
            friendshipService.addFriend(userId, friendEmail);
            return ResponseEntity.ok(Map.of("message", "Friend request sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/toggle-close/{friendId}")
    public ResponseEntity<?> toggleCloseFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.toggleCloseFriend(userId, friendId);
            return ResponseEntity.ok(Map.of("message", "Close friend status updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/accept/{friendId}")
    public ResponseEntity<?> acceptFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.acceptFriendRequest(userId, friendId);
            return ResponseEntity.ok(Map.of("message", "Friend request accepted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/reject/{friendId}")
    public ResponseEntity<?> rejectFriendRequest(@PathVariable Long userId, @PathVariable Long friendId) {
        try {
            friendshipService.rejectFriendRequest(userId, friendId);
            return ResponseEntity.ok(Map.of("message", "Friend request rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
