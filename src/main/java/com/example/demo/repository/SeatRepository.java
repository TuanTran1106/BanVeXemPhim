package com.example.demo.repository;


import com.example.demo.entity.Seats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seats, Integer> {
    Optional<Seats> findByScreeningRooms_IdAndSeatNumber(int screeningRoomId, String seatNumber);

    long countByScreeningRooms_Id(int screeningRoomId);
}
