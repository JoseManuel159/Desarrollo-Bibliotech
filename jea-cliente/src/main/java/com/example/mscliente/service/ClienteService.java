package com.example.mscliente.service;

import com.example.mscliente.entity.Cliente;

import java.util.List;
import java.util.Optional;

public interface ClienteService {
    Cliente guardarCliente(Cliente cliente);
    Optional<Cliente> obtenerClientePorId(Long id);
    Optional<Cliente> obtenerClientePorDni(String dni);
    List<Cliente> obtenerTodosLosClientes();
    Cliente actualizarCliente(Cliente cliente);
    void eliminarCliente(Long id);
}
