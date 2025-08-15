package com.example.demo.service;


import com.example.demo.entity.Movies;

import java.util.List;

public interface MovieService {
    List<Movies> getAllMovies(int page, int size);
    List<Movies> searchMovies(String title);
    Movies getMovieById(int id);
}
