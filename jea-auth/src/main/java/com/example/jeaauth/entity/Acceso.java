package com.example.jeaauth.entity;

import javax.persistence.*;

@Entity
@Table(name = "accesos")
public class Acceso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_acceso")
    private Long idAcceso;

    @Column(name = "nombre", nullable = false, length = 60)
    private String nombre;

    @Column(name = "url", nullable = false, length = 100)
    private String url;

    @Column(name = "icono", nullable = false, length = 60)
    private String icono;

    private Long orden;

    public Acceso() {
    }

    public Acceso(Long idAcceso, String nombre, String url, String icono, Long orden) {
        this.idAcceso = idAcceso;
        this.nombre = nombre;
        this.url = url;
        this.icono = icono;
        this.orden = orden;
    }

    public Long getIdAcceso() {
        return idAcceso;
    }

    public void setIdAcceso(Long idAcceso) {
        this.idAcceso = idAcceso;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcono() {
        return icono;
    }

    public void setIcono(String icono) {
        this.icono = icono;
    }


    public Long getOrden() {
        return orden;
    }

    public void setOrden(Long orden) {
        this.orden = orden;
    }
}