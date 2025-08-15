package com.example.demo.controller;


import com.example.demo.entity.Tickets;
import com.example.demo.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketService ticketService;

    @GetMapping
    public List<Tickets> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Tickets getTicketById(@PathVariable int id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/showtime/{showtimeId}")
    public List<Tickets> getTicketsByShowtime(@PathVariable int showtimeId) {
        return ticketService.getTicketsByShowtime(showtimeId);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookTickets(@RequestBody Map<String, Object> body) {
        try {
            Number st = (Number) body.get("showtimeId");
            Number u = (Number) body.get("userId");
            if (st == null || u == null) {
                return ResponseEntity.badRequest().body("Missing showtimeId or userId");
            }
            int showtimeId = st.intValue();
            int userId = u.intValue();

            Object seatsObj = body.get("seatNumbers");
            if (!(seatsObj instanceof List<?> list) || list.isEmpty()) {
                return ResponseEntity.badRequest().body("seatNumbers must be a non-empty array");
            }
            List<String> seatNumbers = list.stream().map(String::valueOf).toList();
            List<Tickets> tickets = ticketService.bookMultipleSeats(showtimeId, userId, seatNumbers);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
