package com.example.demo.controller;


import com.example.demo.entity.ScreeningRooms;
import com.example.demo.service.ScreeningRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/screening-rooms")
public class ScreeningRoomController {
    @Autowired
    private ScreeningRoomService screeningRoomService;

    @GetMapping
    public List<ScreeningRooms> getAllScreeningRooms() {
        return screeningRoomService.getAllScreeningRooms();
    }

    @GetMapping("/{id}")
    public ScreeningRooms getScreeningRoomById(@PathVariable int id) {
        return screeningRoomService.getScreeningRoomById(id);
    }
}
