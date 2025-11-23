package com.example.jeaauth.service;

import com.example.jeaauth.dto.AccesoDto;
import com.example.jeaauth.entity.Acceso;

import java.util.List;

public interface AccesoService {
    List<AccesoDto> obtenerAccesosDeUsuario(String username);
    List<Acceso> obtenerAccesosPorRol(Long rolId);
}
