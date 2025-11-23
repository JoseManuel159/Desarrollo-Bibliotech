package com.example.jeaauth.controller;

import com.example.jeaauth.dto.UsuarioDto;
import com.example.jeaauth.dto.UsuarioListadoDto;
import com.example.jeaauth.dto.UsuarioRolDto;
import com.example.jeaauth.entity.Usuario;
import com.example.jeaauth.repository.UsuarioRepository;
import com.example.jeaauth.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/crear")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody UsuarioDto usuarioDto) {
        Usuario usuario = usuarioService.save(usuarioDto);
        if (usuario == null) {
            return ResponseEntity.badRequest().build(); // Ya existe el username, por ejemplo
        }
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/asignar-rol")
    public ResponseEntity<String> asignarRol(@RequestBody UsuarioRolDto dto) {
        usuarioService.asignarRol(dto);
        return ResponseEntity.ok("Rol asignado con éxito");
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam boolean estado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (!usuarioOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = usuarioOpt.get();
        usuario.setEstado(estado);
        usuarioRepository.save(usuario);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/estado")
    public ResponseEntity<List<UsuarioListadoDto>> listarUsuariosPorEstado(@RequestParam boolean estado) {
        List<UsuarioListadoDto> usuarios = usuarioService.listarUsuariosPorEstadoConRol(estado);
        return ResponseEntity.ok(usuarios);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDto dto) {
        Usuario usuarioActualizado = usuarioService.actualizar(id, dto);
        return ResponseEntity.ok(usuarioActualizado);
    }


}