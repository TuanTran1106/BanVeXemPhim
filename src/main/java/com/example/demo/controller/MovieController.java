package com.example.demo.controller;

import com.example.demo.entity.Movies;
import com.example.demo.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @GetMapping
    public List<Movies> getAllMovies(@RequestParam int page, @RequestParam int size) {
        return movieService.getAllMovies(page, size);
    }

    @GetMapping("/search")
    public List<Movies> searchMovies(@RequestParam String title) {
        return movieService.searchMovies(title);
    }

    @GetMapping("/{id}")
    public Movies getMovieById(@PathVariable int id) {
        return movieService.getMovieById(id);
    }
}
