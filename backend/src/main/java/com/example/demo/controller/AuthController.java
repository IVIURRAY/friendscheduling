package com.example.demo.controller;

import com.example.demo.dto.UserDto;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ClientRegistrationRepository clientRegistrationRepository;
    
    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal OidcUser oidcUser) {
        try {
            if (oidcUser == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not authenticated"));
            }
            
            String email = oidcUser.getEmail();
            Optional<User> userOpt = userService.findByEmail(email);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserDto userDto = userService.convertToDto(user);
                return ResponseEntity.ok(userDto);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
    
    @GetMapping("/providers")
    public ResponseEntity<?> getAvailableProviders() {
        try {
            List<String> providers = new ArrayList<>();
            
            // Check which clients are actually registered
            try {
                var googleReg = clientRegistrationRepository.findByRegistrationId("google");
                if (googleReg != null) {
                    providers.add("google");
                }
            } catch (Exception e) {
                // Google not configured
            }
            
            try {
                var appleReg = clientRegistrationRepository.findByRegistrationId("apple");
                if (appleReg != null) {
                    providers.add("apple");
                }
            } catch (Exception e) {
                // Apple not configured
            }
            return ResponseEntity.ok(Map.of("providers", providers));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
}
