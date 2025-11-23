package com.example.jeaproveedor.service.serviceImpl;

import com.example.jeaproveedor.entity.Proveedor;
import com.example.jeaproveedor.repository.ProveedorRepository;
import com.example.jeaproveedor.service.ProveedorService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProveedorServiceImpl implements ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    public List<Proveedor> listarTodos() {
        return proveedorRepository.findAll();
    }

    @Override
    public Optional<Proveedor> obtenerPorId(Long id) {
        return proveedorRepository.findById(id);
    }

    @Override
    public Proveedor crear(Proveedor proveedor) {
        proveedor.setEstado(true); // ✅ Estado por defecto TRUE
        return proveedorRepository.save(proveedor);
    }

    @Override
    public Proveedor actualizar(Long id, Proveedor proveedorActualizado) {
        Optional<Proveedor> proveedorOptional = proveedorRepository.findById(id);
        if (proveedorOptional.isPresent()) {
            Proveedor proveedor = proveedorOptional.get();
            proveedor.setRuc(proveedorActualizado.getRuc());
            proveedor.setNombre(proveedorActualizado.getNombre());
            proveedor.setTelefono(proveedorActualizado.getTelefono());
            proveedor.setDireccion(proveedorActualizado.getDireccion());
            proveedor.setCorreo(proveedorActualizado.getCorreo());
            // estado no se modifica aquí
            return proveedorRepository.save(proveedor);
        }
        return null;
    }

    @Override
    public void eliminar(Long id) {
        proveedorRepository.deleteById(id);
    }

    @Override
    public void desactivar(Long id) {
        Optional<Proveedor> proveedorOptional = proveedorRepository.findById(id);
        if (proveedorOptional.isPresent()) {
            Proveedor proveedor = proveedorOptional.get();
            proveedor.setEstado(false);
            proveedorRepository.save(proveedor);
        } else {
            throw new EntityNotFoundException("Proveedor con ID " + id + " no encontrado.");
        }
    }

    @Override
    public void activar(Long id) {
        Optional<Proveedor> proveedorOptional = proveedorRepository.findById(id);
        if (proveedorOptional.isPresent()) {
            Proveedor proveedor = proveedorOptional.get();
            proveedor.setEstado(true);
            proveedorRepository.save(proveedor);
        } else {
            throw new EntityNotFoundException("Proveedor con ID " + id + " no encontrado.");
        }
    }



    @Override
    public Optional<Proveedor> buscarPorRuc(String ruc) {
        return proveedorRepository.findByruc(ruc);
    }

}