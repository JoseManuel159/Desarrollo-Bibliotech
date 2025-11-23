package com.example.mscatalogo.service.serviceImpl;

import com.example.mscatalogo.entity.Libro;
import com.example.mscatalogo.repository.LibroRepository;
import com.example.mscatalogo.service.LibroService;
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
public class LibroServiceImpl implements LibroService {

    @Autowired
    private LibroRepository libroRepository;

    private static final String RUTA_IMAGENES = "C:\\cursos\\gestion\\proyecto\\Sistema-ventas-ms-master\\imagenes";

    @Override
    public Libro guardarConImagen(Libro libro, MultipartFile imagenFile) {

        boolean existeCodigo = libroRepository.existsByCodigo(libro.getCodigo());
        boolean existeNombre = libroRepository.existsByTitulo(libro.getTitulo());

        if (existeCodigo || existeNombre) {
            throw new RuntimeException("Ya existe un libro con ese código o título");
        }

        // Guardar imagen
        if (imagenFile != null && !imagenFile.isEmpty()) {
            try {
                Files.createDirectories(Paths.get(RUTA_IMAGENES));
                String nombreArchivo = UUID.randomUUID() + "_" + imagenFile.getOriginalFilename();
                Path rutaArchivo = Paths.get(RUTA_IMAGENES).resolve(nombreArchivo);
                Files.copy(imagenFile.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
                libro.setPortada(nombreArchivo);
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar la portada: " + e.getMessage());
            }
        }

        return libroRepository.save(libro);
    }

    @Override
    public List<Libro> listar() {
        return libroRepository.findAll();
    }

    @Override
    public Optional<Libro> obtenerPorId(Long id) {
        return libroRepository.findById(id);
    }

    @Override
    public Libro actualizar(Long id, Libro libroActualizado) {

        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        libro.setCodigo(libroActualizado.getCodigo());
        libro.setTitulo(libroActualizado.getTitulo());
        libro.setDescripcion(libroActualizado.getDescripcion());
        libro.setAutor(libroActualizado.getAutor());
        libro.setEditorial(libroActualizado.getEditorial());
        libro.setIsbn(libroActualizado.getIsbn());
        libro.setAnioPublicacion(libroActualizado.getAnioPublicacion());
        libro.setStockTotal(libroActualizado.getStockTotal());
        libro.setStockDisponible(libroActualizado.getStockDisponible());
        libro.setCategoria(libroActualizado.getCategoria());
        libro.setEstado(libroActualizado.isEstado());

        return libroRepository.save(libro);
    }

    @Override
    public void eliminar(Long id) {
        libroRepository.deleteById(id);
    }

    @Override
    public void desactivar(Long id) {
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        libro.setEstado(false);
        libroRepository.save(libro);
    }

    @Override
    public Libro actualizarCantidad(Long id, Integer nuevaCantidad) {
        // Este método ahora actualiza stockTotal
        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado con ID: " + id));

        libro.setStockTotal(nuevaCantidad);
        // opcional: recalcular disponible
        if (libro.getStockDisponible() > nuevaCantidad) {
            libro.setStockDisponible(nuevaCantidad);
        }

        return libroRepository.save(libro);
    }

    @Override
    public Libro actualizarConImagen(Long id, Libro libroActualizado, MultipartFile nuevaImagen) {

        Libro libro = libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        libro.setCodigo(libroActualizado.getCodigo());
        libro.setTitulo(libroActualizado.getTitulo());
        libro.setDescripcion(libroActualizado.getDescripcion());
        libro.setAutor(libroActualizado.getAutor());
        libro.setEditorial(libroActualizado.getEditorial());
        libro.setIsbn(libroActualizado.getIsbn());
        libro.setAnioPublicacion(libroActualizado.getAnioPublicacion());
        libro.setStockTotal(libroActualizado.getStockTotal());
        libro.setStockDisponible(libroActualizado.getStockDisponible());
        libro.setCategoria(libroActualizado.getCategoria());
        libro.setEstado(libroActualizado.isEstado());

        // Guardar nueva portada si llega
        if (nuevaImagen != null && !nuevaImagen.isEmpty()) {
            try {
                Files.createDirectories(Paths.get(RUTA_IMAGENES));
                String nombreArchivo = UUID.randomUUID() + "_" + nuevaImagen.getOriginalFilename();
                Path rutaArchivo = Paths.get(RUTA_IMAGENES).resolve(nombreArchivo);
                Files.copy(nuevaImagen.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);
                libro.setPortada(nombreArchivo);
            } catch (IOException e) {
                throw new RuntimeException("Error al guardar la nueva portada: " + e.getMessage());
            }
        }

        return libroRepository.save(libro);
    }

    @Override
    public Optional<Libro> buscarPorCodigo(String codigo) {
        return libroRepository.findByCodigo(codigo);
    }
}
