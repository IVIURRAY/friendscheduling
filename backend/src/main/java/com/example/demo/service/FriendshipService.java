package com.example.demo.service;

import com.example.demo.dto.FriendDto;
import com.example.demo.entity.Friendship;
import com.example.demo.entity.User;
import com.example.demo.repository.FriendshipRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FriendshipService {
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    public List<FriendDto> getFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendshipsByUser(user);
        
        return friendships.stream()
                .map(friendship -> {
                    User friend = friendship.getUser().getId().equals(userId) ? 
                            friendship.getFriend() : friendship.getUser();
                    return new FriendDto(
                            friend.getId(),
                            friend.getName(),
                            friend.getEmail(),
                            friendship.getIsCloseFriend(),
                            friendship.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
    
    public List<FriendDto> getCloseFriends(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Friendship> friendships = friendshipRepository.findCloseFriendshipsByUser(user);
        
        return friendships.stream()
                .map(friendship -> {
                    User friend = friendship.getUser().getId().equals(userId) ? 
                            friendship.getFriend() : friendship.getUser();
                    return new FriendDto(
                            friend.getId(),
                            friend.getName(),
                            friend.getEmail(),
                            friendship.getIsCloseFriend(),
                            friendship.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getDashboardStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Friendship> allFriendships = friendshipRepository.findByUserOrFriend(user);
        
        long totalFriends = allFriendships.stream()
                .filter(friendship -> friendship.getStatus() == Friendship.FriendshipStatus.ACCEPTED)
                .count();
        
        long closeFriends = allFriendships.stream()
                .filter(friendship -> friendship.getStatus() == Friendship.FriendshipStatus.ACCEPTED && friendship.getIsCloseFriend())
                .count();
        
        long pendingRequests = allFriendships.stream()
                .filter(friendship -> friendship.getFriend().getId().equals(userId) && 
                        friendship.getStatus() == Friendship.FriendshipStatus.PENDING)
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFriends", totalFriends);
        stats.put("closeFriends", closeFriends);
        stats.put("pendingRequests", pendingRequests);
        
        return stats;
    }
    
    public void addFriend(Long userId, String friendEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User friend = userRepository.findByEmail(friendEmail)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        if (user.getId().equals(friend.getId())) {
            throw new RuntimeException("Cannot add yourself as a friend");
        }
        
        // Check if friendship already exists
        friendshipRepository.findByUserAndFriend(user, friend)
                .ifPresent(friendship -> {
                    throw new RuntimeException("Friendship already exists");
                });
        
        friendshipRepository.findByUserAndFriend(friend, user)
                .ifPresent(friendship -> {
                    throw new RuntimeException("Friendship already exists");
                });
        
        Friendship friendship = new Friendship(user, friend);
        friendshipRepository.save(friendship);
    }
    
    public void toggleCloseFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        // Find the friendship
        Friendship friendship = friendshipRepository.findByUserAndFriend(user, friend)
                .orElseGet(() -> friendshipRepository.findByUserAndFriend(friend, user)
                        .orElseThrow(() -> new RuntimeException("Friendship not found")));
        
        friendship.setIsCloseFriend(!friendship.getIsCloseFriend());
        friendshipRepository.save(friendship);
    }
    
    public void acceptFriendRequest(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        Friendship friendship = friendshipRepository.findByUserAndFriend(friend, user)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        friendship.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }
    
    public void rejectFriendRequest(Long userId, Long friendId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));
        
        Friendship friendship = friendshipRepository.findByUserAndFriend(friend, user)
                .orElseThrow(() -> new RuntimeException("Friend request not found"));
        
        friendship.setStatus(Friendship.FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship);
    }
}
