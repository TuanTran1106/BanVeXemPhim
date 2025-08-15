package com.example.demo.service;

import com.example.demo.entity.Showtimes;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface ShowtimeService {
    List<Showtimes> getAllShowtimes();
    Showtimes getShowtimeById(int id);
    List<Showtimes> getShowtimesByMovie(int movieId);

    Showtimes createShowtime(int movieId, int roomId, LocalDateTime startTime, BigDecimal ticketPrice);
}
