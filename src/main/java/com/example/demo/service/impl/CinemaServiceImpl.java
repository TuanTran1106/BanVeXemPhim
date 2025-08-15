package com.example.demo.service.impl;


import com.example.demo.entity.Cinema;
import com.example.demo.repository.CinemaRepository;
import com.example.demo.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CinemaServiceImpl implements CinemaService {
    @Autowired
    private CinemaRepository cinemaRepository;

    @Override
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    @Override
    public Cinema getCinemaById(int id) {
        return cinemaRepository.findById(id).orElse(null);
    }
}
