package com.example.jeaauth.repository;

import com.example.jeaauth.entity.Acceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccesoRepository extends JpaRepository<Acceso, Long> {

    @Query("SELECT DISTINCT a FROM Acceso a " +
            "JOIN AccesoRol ar ON a.id = ar.acceso.id " +
            "JOIN Rol r ON ar.rol.idRol = r.idRol " +
            "JOIN UsuarioRol ur ON ur.rol.idRol = r.idRol " +
            "JOIN Usuario u ON u.id = ur.usuario.id " +
            "WHERE u.authUser.userName = :username")
    List<Acceso> findAccesosByUsername(@Param("username") String username);
}
