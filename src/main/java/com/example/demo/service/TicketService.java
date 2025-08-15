package com.example.demo.service;


import com.example.demo.entity.Tickets;
import com.example.demo.entity.User;

import java.util.List;

public interface TicketService {
    List<Tickets> getAllTickets();
    Tickets getTicketById(int id);

    List<Tickets> getTicketsByShowtime(int showtimeId);

    Tickets bookSingleSeat(int showtimeId, int userId, String seatNumber);

    List<Tickets> bookMultipleSeats(int showtimeId, int userId, List<String> seatNumbers);
}
