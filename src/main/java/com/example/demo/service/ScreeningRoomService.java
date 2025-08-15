package com.example.demo.service;


import com.example.demo.entity.ScreeningRooms;

import java.util.List;

public interface ScreeningRoomService {
    List<ScreeningRooms> getAllScreeningRooms();
    ScreeningRooms getScreeningRoomById(int id);
}
