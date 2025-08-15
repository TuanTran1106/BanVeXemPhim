package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Showtimes")
public class Showtimes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "startTime")
    private LocalDateTime startTime;

    @Column(name = "ticketPrice")
    private BigDecimal ticketPrice;

    @ManyToOne
    @JoinColumn(name = "screeningRoom_id",referencedColumnName = "id")
    private ScreeningRooms screeningRooms;

    @ManyToOne
    @JoinColumn(name = "movie_id",referencedColumnName = "id")
    private Movies movies;
}
