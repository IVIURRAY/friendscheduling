package com.example.demo.repository;

import com.example.demo.entity.Friendship;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("SELECT f FROM Friendship f WHERE (f.user = :user OR f.friend = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendshipsByUser(@Param("user") User user);
    
    @Query("SELECT f FROM Friendship f WHERE f.user = :user AND f.status = 'PENDING'")
    List<Friendship> findPendingFriendshipsByUser(@Param("user") User user);
    
    @Query("SELECT f FROM Friendship f WHERE f.friend = :user AND f.status = 'PENDING'")
    List<Friendship> findPendingFriendshipRequestsForUser(@Param("user") User user);
    
    Optional<Friendship> findByUserAndFriend(User user, User friend);
    
    @Query("SELECT f FROM Friendship f WHERE (f.user = :user OR f.friend = :user) AND f.status = 'ACCEPTED' AND f.isCloseFriend = true")
    List<Friendship> findCloseFriendshipsByUser(@Param("user") User user);
    
    @Query("SELECT f FROM Friendship f WHERE f.user = :user OR f.friend = :user")
    List<Friendship> findByUserOrFriend(@Param("user") User user);
}
