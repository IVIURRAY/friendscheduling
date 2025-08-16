package com.example.demo.config;

import com.example.demo.entity.Friendship;
import com.example.demo.entity.Meeting;
import com.example.demo.entity.User;
import com.example.demo.repository.FriendshipRepository;
import com.example.demo.repository.MeetingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private MeetingRepository meetingRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample users
        User john = new User("John Doe", "john@example.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa"); // password: password
        User sarah = new User("Sarah Johnson", "sarah@example.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        User mike = new User("Mike Chen", "mike@example.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        User alex = new User("Alex Davis", "alex@example.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        User emma = new User("Emma Wilson", "emma@example.com", "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa");
        
        userRepository.save(john);
        userRepository.save(sarah);
        userRepository.save(mike);
        userRepository.save(alex);
        userRepository.save(emma);
        
        // Create friendships
        Friendship friendship1 = new Friendship(john, sarah);
        friendship1.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendship1.setIsCloseFriend(true);
        friendshipRepository.save(friendship1);
        
        Friendship friendship2 = new Friendship(john, mike);
        friendship2.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendship2.setIsCloseFriend(false);
        friendshipRepository.save(friendship2);
        
        Friendship friendship3 = new Friendship(john, alex);
        friendship3.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendship3.setIsCloseFriend(true);
        friendshipRepository.save(friendship3);
        
        // Create sample meetings
        Meeting meeting1 = new Meeting(
            "Coffee with Sarah",
            "Let's catch up over coffee",
            LocalDateTime.now().plusDays(1).withHour(14).withMinute(0),
            LocalDateTime.now().plusDays(1).withHour(15).withMinute(30),
            "Starbucks Downtown",
            john,
            sarah
        );
        meetingRepository.save(meeting1);
        
        Meeting meeting2 = new Meeting(
            "Lunch with Mike",
            "Business lunch discussion",
            LocalDateTime.now().plusDays(2).withHour(12).withMinute(30),
            LocalDateTime.now().plusDays(2).withHour(14).withMinute(0),
            "Pizza Place",
            john,
            mike
        );
        meetingRepository.save(meeting2);
        
        Meeting meeting3 = new Meeting(
            "Movie Night",
            "Watching the latest blockbuster",
            LocalDateTime.now().plusDays(3).withHour(19).withMinute(0),
            LocalDateTime.now().plusDays(3).withHour(22).withMinute(0),
            "AMC Theater",
            john,
            alex
        );
        meetingRepository.save(meeting3);
    }
}
