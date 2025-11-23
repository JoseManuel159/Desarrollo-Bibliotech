package com.example.jeaauth.entity;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AccesoRolPK implements Serializable {

    @Column(name = "rol_id")
    private Long rolId;

    @Column(name = "acceso_id")
    private Long accesoId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AccesoRolPK)) return false;
        AccesoRolPK that = (AccesoRolPK) o;
        return Objects.equals(rolId, that.rolId) && Objects.equals(accesoId, that.accesoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rolId, accesoId);
    }

    public AccesoRolPK() {
    }

    public AccesoRolPK(Long rolId, Long accesoId) {
        this.rolId = rolId;
        this.accesoId = accesoId;
    }

    public Long getRolId() {
        return rolId;
    }

    public void setRolId(Long rolId) {
        this.rolId = rolId;
    }

    public Long getAccesoId() {
        return accesoId;
    }

    public void setAccesoId(Long accesoId) {
        this.accesoId = accesoId;
    }
}