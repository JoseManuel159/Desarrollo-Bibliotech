package com.example.jeaauth.repository;

import com.example.jeaauth.entity.Acceso;
import com.example.jeaauth.entity.AccesoRol;
import com.example.jeaauth.entity.AccesoRolPK;
import com.example.jeaauth.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
    public interface AccesoRolRepository extends JpaRepository<AccesoRol, AccesoRolPK> {
    @Query("SELECT ar.acceso FROM AccesoRol ar WHERE ar.rol.id = :rolId")
    List<Acceso> findAccesosByRolId(@Param("rolId") Long rolId);

    List<AccesoRol> findByRol(Rol rol);

}

