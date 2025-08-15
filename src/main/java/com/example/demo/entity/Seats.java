package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Seats")
public class Seats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "seatNumber")
    private String seatNumber;

    @Column(name = "seatType")
    private String seatType;

    @ManyToOne
    @JoinColumn(name = "screeningRoom_id",referencedColumnName = "id")
    private ScreeningRooms screeningRooms;
}
