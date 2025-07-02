package org.project.services;

import lombok.RequiredArgsConstructor;
import org.project.models.User;
import org.project.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String id, User updatedUser) {
        User existingUser = getUserById(id);

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());

        return userRepository.save(existingUser);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
    
    public List<User> getUsersByProjectId(String projectId) {
        return userRepository.findByProjectIdsContaining(projectId);
    }
} 