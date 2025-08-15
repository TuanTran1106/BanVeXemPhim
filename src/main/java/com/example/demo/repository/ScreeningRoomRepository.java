package com.example.demo.repository;

import com.example.demo.entity.ScreeningRooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreeningRoomRepository extends JpaRepository<ScreeningRooms, Integer> {
}
