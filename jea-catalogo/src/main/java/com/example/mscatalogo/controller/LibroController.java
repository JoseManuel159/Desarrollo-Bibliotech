package com.example.mscatalogo.controller;

import com.example.mscatalogo.entity.Categoria;
import com.example.mscatalogo.entity.Libro;
import com.example.mscatalogo.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/libros")
public class LibroController {

    @Autowired
    private LibroService libroService;

    // ---------------------------------------------
    // CREAR LIBRO CON PORTADA
    // ---------------------------------------------
    @PostMapping(value = "/crear-con-portada", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Libro> crearConPortada(
            @RequestParam("codigo") String codigo,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("autor") String autor,
            @RequestParam(value = "editorial", required = false) String editorial,
            @RequestParam(value = "isbn", required = false) String isbn,
            @RequestParam(value = "anioPublicacion", required = false) Integer anioPublicacion,
            @RequestParam("stockTotal") Integer stockTotal,
            @RequestParam("stockDisponible") Integer stockDisponible,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "portada", required = false) MultipartFile imagenFile
    ) {
        try {
            Libro libro = new Libro();
            libro.setCodigo(codigo);
            libro.setTitulo(titulo);
            libro.setDescripcion(descripcion);
            libro.setAutor(autor);
            libro.setEditorial(editorial);
            libro.setIsbn(isbn);
            libro.setAnioPublicacion(anioPublicacion);
            libro.setStockTotal(stockTotal);
            libro.setStockDisponible(stockDisponible);

            Categoria categoria = new Categoria();
            categoria.setId(categoriaId);
            libro.setCategoria(categoria);

            Libro nuevo = libroService.guardarConImagen(libro, imagenFile);
            return ResponseEntity.ok(nuevo);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // ---------------------------------------------
    // LISTAR LIBROS
    // ---------------------------------------------
    @GetMapping
    public ResponseEntity<List<Libro>> listarLibros() {
        return ResponseEntity.ok(libroService.listar());
    }

    // ---------------------------------------------
    // OBTENER LIBRO POR ID
    // ---------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Libro> obtenerPorId(@PathVariable Long id) {
        Optional<Libro> libro = libroService.obtenerPorId(id);
        return libro.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ---------------------------------------------
    // ACTUALIZAR LIBRO
    // ---------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id, @RequestBody Libro libro) {
        try {
            Libro actualizado = libroService.actualizar(id, libro);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------------------------------------
    // ELIMINAR LIBRO
    // ---------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        libroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // ---------------------------------------------
    // DESACTIVAR LIBRO
    // ---------------------------------------------
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarLibro(@PathVariable Long id) {
        try {
            libroService.desactivar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------------------------------------
    // ACTUALIZAR STOCK
    // ---------------------------------------------
    @PutMapping("/{id}/stock")
    public ResponseEntity<Libro> actualizarStock(@PathVariable Long id, @RequestBody Integer nuevoStock) {
        Libro libroActualizado = libroService.actualizarCantidad(id, nuevoStock);
        return ResponseEntity.ok(libroActualizado);
    }

    // ---------------------------------------------
    // ACTUALIZAR LIBRO CON NUEVA PORTADA
    // ---------------------------------------------
    @PutMapping(value = "/{id}/actualizar-con-portada", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Libro> actualizarConPortada(
            @PathVariable Long id,
            @RequestParam("codigo") String codigo,
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("autor") String autor,
            @RequestParam(value = "editorial", required = false) String editorial,
            @RequestParam(value = "isbn", required = false) String isbn,
            @RequestParam(value = "anioPublicacion", required = false) Integer anioPublicacion,
            @RequestParam("stockTotal") Integer stockTotal,
            @RequestParam("stockDisponible") Integer stockDisponible,
            @RequestParam("estado") boolean estado,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "portada", required = false) MultipartFile nuevaPortada
    ) {
        try {
            Libro libroActualizado = new Libro();
            libroActualizado.setCodigo(codigo);
            libroActualizado.setTitulo(titulo);
            libroActualizado.setDescripcion(descripcion);
            libroActualizado.setAutor(autor);
            libroActualizado.setEditorial(editorial);
            libroActualizado.setIsbn(isbn);
            libroActualizado.setAnioPublicacion(anioPublicacion);
            libroActualizado.setStockTotal(stockTotal);
            libroActualizado.setStockDisponible(stockDisponible);
            libroActualizado.setEstado(estado);

            Categoria categoria = new Categoria();
            categoria.setId(categoriaId);
            libroActualizado.setCategoria(categoria);

            Libro actualizado = libroService.actualizarConImagen(id, libroActualizado, nuevaPortada);
            return ResponseEntity.ok(actualizado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ---------------------------------------------
    // BUSCAR POR CÓDIGO
    // ---------------------------------------------
    @GetMapping("/buscar/codigo/{codigo}")
    public ResponseEntity<Libro> buscarPorCodigo(@PathVariable String codigo) {
        return libroService.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Libro> crearLibro(@RequestBody Libro libro) {
        try {
            Libro nuevoLibro = libroService.guardarConImagen(libro, null);
            return ResponseEntity.ok(nuevoLibro);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
