package com.example.demo.service;

import com.example.demo.entity.User;

import java.util.List;

public interface UserService {
    User register(User user);
    User login(String email, String password);
    List<User> getAllUsers();
    User findByEmail(String email);
}
