package com.example.demo.controller;


import com.example.demo.entity.Cinema;
import com.example.demo.service.CinemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
public class CinemaController {
    @Autowired
    private CinemaService cinemaService;

    @GetMapping
    public List<Cinema> getAllCinemas() {
        return cinemaService.getAllCinemas();
    }

    @GetMapping("/{id}")
    public Cinema getCinemaById(@PathVariable int id) {
        return cinemaService.getCinemaById(id);
    }
}
