package com.example.jeacompra.feign;
import com.example.jeacompra.dto.Producto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "jea-catalogo-service", path = "/producto")
public interface ProductoFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "orderByIdCB", fallbackMethod = "fallbackProductById")
    public ResponseEntity<Producto> listarProducto(@PathVariable Long id);

    @PutMapping("/{id}/cantidad")
    @CircuitBreaker(name = "orderByIdCB", fallbackMethod = "fallbackProductById")
    ResponseEntity<Producto> actualizarCantidad(@PathVariable Long id, @RequestBody Integer nuevaCantidad);


    default ResponseEntity<Producto> fallbackProductById(Long id, Exception e) {
        Producto productDto = new Producto();
        productDto.setNombre("Servicio no disponible de producto");
        return ResponseEntity.ok(productDto);
    }
}
