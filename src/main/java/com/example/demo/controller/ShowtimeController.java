package com.example.demo.controller;


import com.example.demo.entity.Showtimes;
import com.example.demo.service.ShowtimeService;
import com.example.demo.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {
    @Autowired
    private ShowtimeService showtimeService;
    @Autowired
    private SeatRepository seatRepository;

    @GetMapping
    public List<Showtimes> getAllShowtimes() {
        return showtimeService.getAllShowtimes();
    }

    @GetMapping("/{id}")
    public Showtimes getShowtimeById(@PathVariable int id) {
        return showtimeService.getShowtimeById(id);
    }

    @GetMapping("/movie/{movieId}")
    public List<Showtimes> getShowtimesByMovie(@PathVariable int movieId) {
        return showtimeService.getShowtimesByMovie(movieId);
    }

    @PostMapping
    public Showtimes createShowtime(@RequestBody Map<String, Object> body) {
        int movieId = (int) body.get("movieId");
        int roomId = (int) body.get("roomId");
        String start = (String) body.get("startTime");
        String price = String.valueOf(body.get("ticketPrice"));
        return showtimeService.createShowtime(movieId, roomId, LocalDateTime.parse(start), new BigDecimal(price));
    }

    @GetMapping("/{id}/meta")
    public java.util.Map<String, Object> getShowtimeMeta(@PathVariable int id) {
        Showtimes st = showtimeService.getShowtimeById(id);
        int roomId = st.getScreeningRooms().getId();
        long totalSeats = seatRepository.countByScreeningRooms_Id(roomId);
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("showtime", st);
        map.put("totalSeats", totalSeats);
        return map;
    }
}
