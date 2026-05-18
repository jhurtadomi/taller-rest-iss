package com.unas.backend.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "empleado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;

    @Column(length = 8, unique = true)
    private String dni;

    private String genero;

    @Column(name = "estado_civil")
    private String estadoCivil;
}