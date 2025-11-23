package com.example.jeaauth.controller;

import com.example.jeaauth.entity.Rol;
import com.example.jeaauth.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rol")
public class RolController {

    @Autowired
    private RolRepository rolRepository;

    @GetMapping("/listar")
    public List<Rol> listar() {
        return rolRepository.findAll();
    }
}