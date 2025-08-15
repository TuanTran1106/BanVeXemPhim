package com.example.demo.service.impl;


import com.example.demo.entity.Movies;
import com.example.demo.entity.ScreeningRooms;
import com.example.demo.entity.Showtimes;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.ScreeningRoomRepository;
import com.example.demo.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {
    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ScreeningRoomRepository screeningRoomRepository;

    @Override
    public List<Showtimes> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    @Override
    public Showtimes getShowtimeById(int id) {
        return showtimeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Showtimes> getShowtimesByMovie(int movieId) {
        return showtimeRepository.findByMovies_Id(movieId);
    }

    @Override
    public Showtimes createShowtime(int movieId, int roomId, LocalDateTime startTime, BigDecimal ticketPrice) {
        Movies movie = movieRepository.findById(movieId).orElseThrow();
        ScreeningRooms room = screeningRoomRepository.findById(roomId).orElseThrow();
        Showtimes st = new Showtimes();
        st.setMovies(movie);
        st.setScreeningRooms(room);
        st.setStartTime(startTime);
        st.setTicketPrice(ticketPrice);
        return showtimeRepository.save(st);
    }
}
