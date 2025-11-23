package com.example.jeaventa.feign;

import com.example.jeaventa.dto.Categoria;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "jea-catalogo-service", contextId = "categoriaFeign", path = "/categoria")
public interface CategoriaFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "categoryByIdCB", fallbackMethod = "fallbackCategoriaById")
    ResponseEntity<Categoria> obtenerCategoria(@PathVariable Long id);

    default ResponseEntity<Categoria> fallbackCategoriaById(Long id, Exception e) {
        Categoria categoria = new Categoria();
        categoria.setNombre("Servicio no disponible de categoría");
        return ResponseEntity.ok(categoria);
    }
}