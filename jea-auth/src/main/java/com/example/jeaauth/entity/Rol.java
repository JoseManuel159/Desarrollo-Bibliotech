package com.example.jeaauth.entity;

import lombok.Builder;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Rol {

    public enum RolNombre {
        ADMIN, BIBLIOTECARIO, LECTOR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    @Enumerated(EnumType.STRING)
    @Column(name = "nombre", nullable = false, length = 60)
    private RolNombre nombre;

    @Column(name = "descripcion", nullable = false, length = 120)
    private String descripcion;

    public Rol() {
    }

    public Rol(Long idRol, RolNombre nombre, String descripcion) {
        this.idRol = idRol;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Long getIdRol() {
        return idRol;
    }

    public void setIdRol(Long idRol) {
        this.idRol = idRol;
    }

    public RolNombre getNombre() {
        return nombre;
    }

    public void setNombre(RolNombre nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}