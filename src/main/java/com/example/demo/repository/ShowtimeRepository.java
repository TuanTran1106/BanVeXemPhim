package com.example.demo.repository;


import com.example.demo.entity.Showtimes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtimes, Integer> {
    List<Showtimes> findByMovies_Id(int movieId);
}
