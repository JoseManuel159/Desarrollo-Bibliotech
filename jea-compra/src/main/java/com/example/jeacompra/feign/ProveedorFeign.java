package com.example.jeacompra.feign;

import com.example.jeacompra.dto.FormaPago;
import com.example.jeacompra.dto.Proveedor;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "jea-proveedor-service", path = "/proveedor")

public interface ProveedorFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "proveedorByIdCB", fallbackMethod = "fallbackFormaPagoById")
    ResponseEntity<Proveedor> obtenerproveedor(@PathVariable Long id);

    default ResponseEntity<Proveedor> fallbackFormaPagoById(Long id, Exception e) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre("Servicio no disponible de proveedor");
        return ResponseEntity.ok(proveedor);
    }

}