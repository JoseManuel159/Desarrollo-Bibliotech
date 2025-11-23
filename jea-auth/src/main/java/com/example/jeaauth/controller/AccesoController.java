package com.example.jeaauth.controller;

import com.example.jeaauth.dto.AccesoDto;
import com.example.jeaauth.service.AccesoService;
import com.example.jeaauth.entity.Acceso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accesos")
public class AccesoController {

    @Autowired
    private AccesoService accesoService;

    @GetMapping
    public ResponseEntity<List<AccesoDto>> listarAccesosDelUsuario(@RequestParam String username) {
        List<AccesoDto> accesos = accesoService.obtenerAccesosDeUsuario(username);
        return ResponseEntity.ok(accesos);
    }

    @GetMapping("/por-rol/{rolId}")
    public ResponseEntity<List<Acceso>> obtenerAccesosPorRol(@PathVariable Long rolId) {
        List<Acceso> accesos = accesoService.obtenerAccesosPorRol(rolId);
        return ResponseEntity.ok(accesos);
    }

}
