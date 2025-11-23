package com.example.jeaauth.entity;

import lombok.Builder;

import javax.persistence.*;

@Entity
@Table(name = "acceso_rol")
public class AccesoRol {

    @EmbeddedId
    private AccesoRolPK id;

    @ManyToOne
    @MapsId("rolId")
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @ManyToOne
    @MapsId("accesoId")
    @JoinColumn(name = "acceso_id")
    private Acceso acceso;

    public AccesoRol() {
    }

    public AccesoRol(AccesoRolPK id, Rol rol, Acceso acceso) {
        this.id = id;
        this.rol = rol;
        this.acceso = acceso;
    }

    public AccesoRolPK getId() {
        return id;
    }

    public void setId(AccesoRolPK id) {
        this.id = id;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Acceso getAcceso() {
        return acceso;
    }

    public void setAcceso(Acceso acceso) {
        this.acceso = acceso;
    }
}
