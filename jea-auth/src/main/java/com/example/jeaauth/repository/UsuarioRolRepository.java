package com.example.jeaauth.repository;

import com.example.jeaauth.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsuarioRolRepository extends JpaRepository<UsuarioRol, UsuarioRolPK> {
    List<UsuarioRol> findByUsuario(Usuario usuario);
}
