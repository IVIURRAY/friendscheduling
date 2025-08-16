package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        try {
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (!userService.validatePassword(user, password)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
            }
            
            UserDto userDto = userService.convertToDto(user);
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mock-jwt-token-" + System.currentTimeMillis());
            response.put("user", userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String name = registerRequest.get("name");
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        
        try {
            User user = userService.createUser(name, email, password);
            UserDto userDto = userService.convertToDto(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mock-jwt-token-" + System.currentTimeMillis());
            response.put("user", userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // In a real app, you would validate the JWT token here
            // For now, we'll just return a mock response
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("user", Map.of(
                "id", 1L,
                "name", "John Doe",
                "email", "john@example.com"
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token"));
        }
    }
    
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userService.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserDto userDto = userService.convertToDto(user);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
