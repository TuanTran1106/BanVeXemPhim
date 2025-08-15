package com.example.demo.repository;

import com.example.demo.entity.Movies;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface MovieRepository extends JpaRepository<Movies, Integer> {
    List<Movies> findByTitle(String title);
}
