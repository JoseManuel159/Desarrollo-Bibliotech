package com.example.jeaproveedor.service;

import com.example.jeaproveedor.entity.Proveedor;

import java.util.List;
import java.util.Optional;

public interface ProveedorService {

    List<Proveedor> listarTodos();

    Optional<Proveedor> obtenerPorId(Long id);

    Proveedor crear(Proveedor proveedor);

    Proveedor actualizar(Long id, Proveedor proveedor);

    void eliminar(Long id);

    void desactivar(Long id);

    void activar(Long id);

    Optional<Proveedor> buscarPorRuc(String ruc);

}