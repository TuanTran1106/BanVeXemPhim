package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Movies")
public class Movies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "duration")
    private int duration;

    @Column(name = "genre")
    private String genre;

    @Column(name = "director")
    private String director;

    @Column(name = "actors")
    private String actors;

    @Column(name = "trailerUrl")
    private String trailerUrl;

    @Column(name = "releaseDate")
    private Date releaseDate;

    @Column(name = "imageUrl")
    private String imageUrl;
}
