package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Override
    public void run(String... args) throws Exception {
        // Database schema will be automatically created by JPA/Hibernate
        // No sample data will be pre-loaded
        System.out.println("Database initialized successfully - no sample data loaded");
    }
}
