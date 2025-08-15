package com.example.demo.service.impl;


import com.example.demo.entity.Seats;
import com.example.demo.repository.SeatRepository;
import com.example.demo.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatServiceImpl implements SeatService {
    @Autowired
    private SeatRepository seatRepository;

    @Override
    public List<Seats> getAllSeats() {
        return seatRepository.findAll();
    }

    @Override
    public Seats getSeatById(int id) {
        return seatRepository.findById(id).orElse(null);
    }
}
