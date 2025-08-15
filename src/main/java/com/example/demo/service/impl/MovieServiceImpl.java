package com.example.demo.service.impl;


import com.example.demo.entity.Movies;
import com.example.demo.repository.MovieRepository;
import com.example.demo.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {
    @Autowired
    private MovieRepository movieRepository;

    @Override
    public List<Movies> getAllMovies(int page, int size) {
        return movieRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    @Override
    public List<Movies> searchMovies(String title) {
        return movieRepository.findByTitle(title);
    }

    @Override
    public Movies getMovieById(int id) {
        return movieRepository.findById(id).orElse(null);
    }
}
