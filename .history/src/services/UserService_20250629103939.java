package com.example.services;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        // Check if email is already registered
        userRepository.findByEmail(user.getEmail()).ifPresent(existing -> {
            throw new RuntimeException("Email already registered");
        });

        // Set user as verified since OTP was already verified
        user.setVerified(true);
        
        // Save user with encoded password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
} 