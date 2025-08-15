package com.example.demo.controller;

import com.example.demo.entity.Seats;
import com.example.demo.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {
    @Autowired
    private SeatService seatService;

    @GetMapping
    public List<Seats> getAllSeats() {
        return seatService.getAllSeats();
    }

    @GetMapping("/{id}")
    public Seats getSeatById(@PathVariable int id) {
        return seatService.getSeatById(id);
    }
}
