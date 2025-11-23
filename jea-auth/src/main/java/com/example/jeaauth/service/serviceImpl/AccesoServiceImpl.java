package com.example.jeaauth.service.serviceImpl;

import com.example.jeaauth.dto.AccesoDto;
import com.example.jeaauth.entity.Acceso;
import com.example.jeaauth.repository.AccesoRepository;
import com.example.jeaauth.repository.AccesoRolRepository;
import com.example.jeaauth.service.AccesoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccesoServiceImpl implements AccesoService {

    @Autowired
    private AccesoRepository accesoRepository;

    @Autowired
    private AccesoRolRepository accesoRolRepository;

    @Override
    public List<AccesoDto> obtenerAccesosDeUsuario(String username) {
        List<Acceso> accesos = accesoRepository.findAccesosByUsername(username);
        return accesos.stream()
                .map(a -> new AccesoDto(a.getNombre(), a.getUrl(), a.getIcono(), a.getOrden()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Acceso> obtenerAccesosPorRol(Long rolId) {
        return accesoRolRepository.findAccesosByRolId(rolId);
    }

}