package com.example.demo.repository;

import com.example.demo.entity.Tickets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Tickets, Integer> {
    List<Tickets> findByShowtimes_Id(int showtimeId);

    boolean existsByShowtimes_IdAndSeats_SeatNumber(int showtimeId, String seatNumber);

    List<Tickets> findByShowtimes_IdAndSeats_SeatNumberIn(int showtimeId, Collection<String> seatNumbers);
}
