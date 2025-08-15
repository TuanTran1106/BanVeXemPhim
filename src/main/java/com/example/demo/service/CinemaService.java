package com.example.demo.service;

import com.example.demo.entity.Cinema;

import java.util.List;

public interface CinemaService {
    List<Cinema> getAllCinemas();
    Cinema getCinemaById(int id);
}
