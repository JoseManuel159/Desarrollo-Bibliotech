package com.example.jeaauth.service.serviceImpl;

import com.example.jeaauth.dto.AccesoDto;
import com.example.jeaauth.dto.AuthResponseDto;
import com.example.jeaauth.dto.AuthUserDto;
import com.example.jeaauth.dto.TokenDto;
import com.example.jeaauth.entity.*;
import com.example.jeaauth.repository.AccesoRolRepository;
import com.example.jeaauth.repository.AuthUserRepository;
import com.example.jeaauth.repository.UsuarioRepository;
import com.example.jeaauth.repository.UsuarioRolRepository;
import com.example.jeaauth.security.JwtProvider;
import com.example.jeaauth.service.AuthUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthUserServiceImpl implements AuthUserService {
    @Autowired
    AuthUserRepository authUserRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtProvider jwtProvider;
    @Autowired
    private UsuarioRolRepository usuarioRolRepository;
    @Autowired
    private AccesoRolRepository accesoRolRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;


    @Override
    public AuthUser save(AuthUserDto authUserDto) {
        Optional<AuthUser> user = authUserRepository.findByUserName(authUserDto.getUserName());
        if (user.isPresent())
            return null;
        String password = passwordEncoder.encode(authUserDto.getPassword());
        AuthUser authUser = new AuthUser();
        authUser.setUserName(authUserDto.getUserName());
        authUser.setPassword(password);

        return authUserRepository.save(authUser);
    }




    @Override
    public AuthResponseDto login(AuthUserDto authUserDto) {
        Optional<AuthUser> userOpt = authUserRepository.findByUserName(authUserDto.getUserName());
        if (!userOpt.isPresent()) {
            return null;
        }

        AuthUser user = userOpt.get();

        if (!passwordEncoder.matches(authUserDto.getPassword(), user.getPassword())) {
            return null;
        }

        // Buscar Usuario asociado al AuthUser
        Optional<Usuario> usuarioOpt = usuarioRepository.findByAuthUser(user);
        if (!usuarioOpt.isPresent()) {
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        // 🔴 Aquí va la validación del estado
        if (usuario.getEstado() != null && !usuario.getEstado()) {
            // Usuario está inactivo
            return null; // o lanzar una excepción personalizada si prefieres
        }

        // Generar token
        String token = jwtProvider.createToken(user);

        // Obtener roles del usuario
        List<UsuarioRol> usuarioRoles = usuarioRolRepository.findByUsuario(usuario);

        // Obtener accesos por cada rol
        Set<Acceso> accesos = new HashSet<>();
        for (UsuarioRol ur : usuarioRoles) {
            List<AccesoRol> accesoRoles = accesoRolRepository.findByRol(ur.getRol());
            for (AccesoRol ar : accesoRoles) {
                accesos.add(ar.getAcceso());
            }
        }

        // Convertir a AccesoDto
        List<AccesoDto> accesoDtos = accesos.stream()
                .map(a -> new AccesoDto(a.getNombre(), a.getUrl(), a.getIcono(), a.getOrden()))
                .collect(Collectors.toList());

        return new AuthResponseDto(token, user.getUserName(), accesoDtos);
    }




    @Override
    public TokenDto validate(String token) {
        if (!jwtProvider.validate(token))
            return null;
        String username = jwtProvider.getUserNameFromToken(token);
        if (!authUserRepository.findByUserName(username).isPresent())
            return null;
        return new TokenDto(token);
    }
}