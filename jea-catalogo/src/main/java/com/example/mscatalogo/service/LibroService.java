package com.example.mscatalogo.service;


import com.example.mscatalogo.entity.Libro;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface LibroService {

    Libro guardarConImagen(Libro libro, MultipartFile imagenFile);

    List<Libro> listar();

    Optional<Libro> obtenerPorId(Long id);

    Libro actualizar(Long id, Libro libroActualizado);

    void eliminar(Long id);

    void desactivar(Long id);

    Libro actualizarCantidad(Long id, Integer nuevaCantidad);

    Libro actualizarConImagen(Long id, Libro libroActualizado, MultipartFile nuevaImagen);

    Optional<Libro> buscarPorCodigo(String codigo);

}