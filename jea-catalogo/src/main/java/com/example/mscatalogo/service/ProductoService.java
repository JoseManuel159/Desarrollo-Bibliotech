package com.example.mscatalogo.service;


import com.example.mscatalogo.entity.Producto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductoService {

    Producto guardarConImagen(Producto producto, MultipartFile imagenFile);

    List<Producto> listar();

    Optional<Producto> obtenerPorId(Long id);

    Producto actualizar(Long id, Producto productoActualizado);

    void eliminar(Long id);

    void desactivar(Long id);

    Producto actualizarCantidad(Long id, Integer nuevaCantidad);

    Producto actualizarConImagen(Long id, Producto productoActualizado, MultipartFile nuevaImagen);

    Optional<Producto> buscarPorCodigo(String codigo);

}