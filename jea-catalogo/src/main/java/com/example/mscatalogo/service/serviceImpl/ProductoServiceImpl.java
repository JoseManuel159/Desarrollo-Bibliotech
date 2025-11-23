package com.example.mscatalogo.service.serviceImpl;

import com.example.mscatalogo.entity.Producto;
import com.example.mscatalogo.repository.ProductoRepository;
import com.example.mscatalogo.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductoServiceImpl implements ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    private static final String RUTA_IMAGENES = "D:\\Sis-ventas-master\\imagenes";


    @Override
    public Producto guardarConImagen(Producto producto, MultipartFile imagenFile) {
        boolean existeCodigo = productoRepository.existsByCodigo(producto.getCodigo());
        boolean existeNombre = productoRepository.existsByNombre(producto.getNombre());

        if (existeCodigo || existeNombre) {
            throw new RuntimeException("Ya existe un producto con ese código o nombre");
        }

        // Procesar imagen
        if (imagenFile != null && !imagenFile.isEmpty()) {
            try {
                Files.createDirectories(Paths.get(RUTA_IMAGENES));
                String nombreArchivo = UUID.randomUUID() + "_" + imagenFile.getOriginalFilename();
                Path rutaArchivo = Paths.get(RUTA_IMAGENES).resolve(nombreArchivo);
                Files.copy(imagenFile.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
                producto.setImagen(nombreArchivo);
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar la imagen: " + e.getMessage());
            }
        }

        return productoRepository.save(producto);
    }


    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> obtenerPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto actualizar(Long id, Producto productoActualizado) {
        Optional<Producto> productoExistente = productoRepository.findById(id);

        if (productoExistente.isEmpty()) {
            throw new RuntimeException("Producto no encontrado");
        }

        Producto producto = productoExistente.get();
        producto.setCodigo(productoActualizado.getCodigo());
        producto.setNombre(productoActualizado.getNombre());
        producto.setDescripcion(productoActualizado.getDescripcion());
        producto.setCantidad(productoActualizado.getCantidad());
        producto.setPrecioVenta(productoActualizado.getPrecioVenta());
        producto.setCostoCompra(productoActualizado.getCostoCompra());
        producto.setCategoria(productoActualizado.getCategoria());
        producto.setEstado(productoActualizado.isEstado());

        return productoRepository.save(producto);
    }

    @Override
    public void eliminar(Long id) {
        productoRepository.deleteById(id);
    }

    @Override
    public void desactivar(Long id) {
        Optional<Producto> producto = productoRepository.findById(id);

        if (producto.isPresent()) {
            Producto prod = producto.get();
            prod.setEstado(false);
            productoRepository.save(prod);
        } else {
            throw new RuntimeException("Producto no encontrado");
        }
    }

    @Override
    public Producto actualizarCantidad(Long id, Integer nuevaCantidad) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.setCantidad(nuevaCantidad);
        return productoRepository.save(producto);
    }


    @Override
    public Producto actualizarConImagen(Long id, Producto productoActualizado, MultipartFile nuevaImagen) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // Actualizar datos
        productoExistente.setCodigo(productoActualizado.getCodigo());
        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setCantidad(productoActualizado.getCantidad());
        productoExistente.setPrecioVenta(productoActualizado.getPrecioVenta());
        productoExistente.setCostoCompra(productoActualizado.getCostoCompra());
        productoExistente.setCategoria(productoActualizado.getCategoria());
        productoExistente.setEstado(productoActualizado.isEstado());

        // Si llega nueva imagen, la guardamos y reemplazamos
        if (nuevaImagen != null && !nuevaImagen.isEmpty()) {
            try {
                Files.createDirectories(Paths.get(RUTA_IMAGENES));
                String nombreArchivo = UUID.randomUUID() + "_" + nuevaImagen.getOriginalFilename();
                Path rutaArchivo = Paths.get(RUTA_IMAGENES).resolve(nombreArchivo);
                Files.copy(nuevaImagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
                productoExistente.setImagen(nombreArchivo);
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar la nueva imagen: " + e.getMessage());
            }
        }

        return productoRepository.save(productoExistente);
    }


    @Override
    public Optional<Producto> buscarPorCodigo(String codigo) {
        return productoRepository.findByCodigo(codigo);
    }


}