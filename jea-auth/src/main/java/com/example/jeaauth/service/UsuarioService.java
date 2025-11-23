package com.example.jeaauth.service;

import com.example.jeaauth.dto.UsuarioDto;
import com.example.jeaauth.dto.UsuarioListadoDto;
import com.example.jeaauth.dto.UsuarioRolDto;
import com.example.jeaauth.entity.Usuario;

import java.util.List;

public interface UsuarioService {
    Usuario save(UsuarioDto usuarioDto);

    void asignarRol(UsuarioRolDto dto);

    List<Usuario> listarPorEstado(boolean estado);

    public List<UsuarioListadoDto> listarUsuariosPorEstadoConRol(boolean estado);

    Usuario actualizar(Long id, UsuarioDto dto);


}