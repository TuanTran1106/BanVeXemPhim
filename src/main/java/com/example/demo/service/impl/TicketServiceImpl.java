package com.example.demo.service.impl;


import com.example.demo.entity.Seats;
import com.example.demo.entity.Showtimes;
import com.example.demo.entity.Tickets;
import com.example.demo.entity.User;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.TicketRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TicketServiceImpl implements TicketService {
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private SeatRepository seatRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Tickets> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public Tickets getTicketById(int id) {
        return ticketRepository.findById(id).orElse(null);
    }

    @Override
    public List<Tickets> getTicketsByShowtime(int showtimeId) {
        return ticketRepository.findByShowtimes_Id(showtimeId);
    }

    @Override
    public Tickets bookSingleSeat(int showtimeId, int userId, String seatNumber) {
        // Kiểm tra ghế đã được đặt cho suất chiếu này chưa
        if (ticketRepository.existsByShowtimes_IdAndSeats_SeatNumber(showtimeId, seatNumber)) {
            throw new RuntimeException("Seat already booked");
        }

        Showtimes showtimes = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid showtimeId"));
        int roomId = showtimes.getScreeningRooms().getId();
        Seats seat = seatRepository.findByScreeningRooms_IdAndSeatNumber(roomId, seatNumber)
                .orElseThrow(() -> new IllegalArgumentException("Seat not found in this room: " + seatNumber));
        User user = userRepository.findById(userId).orElseThrow();

        Tickets ticket = new Tickets();
        ticket.setShowtimes(showtimes);
        ticket.setSeats(seat);
        ticket.setUser(user);
        ticket.setBookingTime(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    @Override
    public List<Tickets> bookMultipleSeats(int showtimeId, int userId, List<String> seatNumbers) {
        List<Tickets> result = new ArrayList<>();
        for (String seatNumber : seatNumbers) {
            result.add(bookSingleSeat(showtimeId, userId, seatNumber));
        }
        return result;
    }
}
