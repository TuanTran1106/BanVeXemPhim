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
@Table(name = "ScreeningRooms")
public class ScreeningRooms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "roomName")
    private String roomName;

    @ManyToOne
    @JoinColumn(name = "cinema_id",referencedColumnName = "id")
    private Cinema cinema;

}
