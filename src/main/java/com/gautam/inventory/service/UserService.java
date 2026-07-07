package com.gautam.inventory.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.gautam.inventory.entity.User;
import com.gautam.inventory.exception.ResourceNotFoundException;
import com.gautam.inventory.repository.UserRepository;
import com.gautam.inventory.dto.CreateUserRequest;
import com.gautam.inventory.dto.UpdateUserRequest;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                   PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(CreateUserRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id){

        return userRepository.findById(id).orElseThrow(() ->new ResourceNotFoundException("User not found with id : " + id));

    }

    public User updateUser(Long id,UpdateUserRequest request) {

        User user = userRepository.findById(id).orElseThrow(() ->new ResourceNotFoundException("User not found with id : " + id));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() ->new ResourceNotFoundException("User not found with id : " + id));
        userRepository.delete(user);
    }
}