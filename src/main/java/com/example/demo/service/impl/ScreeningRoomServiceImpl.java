package com.example.demo.service.impl;


import com.example.demo.entity.ScreeningRooms;
import com.example.demo.repository.ScreeningRoomRepository;
import com.example.demo.service.ScreeningRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreeningRoomServiceImpl implements ScreeningRoomService {
    @Autowired
    private ScreeningRoomRepository screeningRoomRepository;

    @Override
    public List<ScreeningRooms> getAllScreeningRooms() {
        return screeningRoomRepository.findAll();
    }

    @Override
    public ScreeningRooms getScreeningRoomById(int id) {
        return screeningRoomRepository.findById(id).orElse(null);
    }
}
