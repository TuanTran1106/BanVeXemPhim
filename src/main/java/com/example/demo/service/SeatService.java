package com.example.demo.service;


import com.example.demo.entity.Seats;

import java.util.List;

public interface SeatService {
    List<Seats> getAllSeats();
    Seats getSeatById(int id);
}
