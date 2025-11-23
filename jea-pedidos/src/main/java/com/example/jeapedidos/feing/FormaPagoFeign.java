package com.example.jeapedidos.feing;

import com.example.jeapedidos.dto.FormaPago;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "jea-pagos-service", path = "/pagos")
public interface FormaPagoFeign {

    @GetMapping("/{id}")
    @CircuitBreaker(name = "formaPagoByIdCB", fallbackMethod = "fallbackFormaPagoById")
    ResponseEntity<FormaPago> obtenerFormaPago(@PathVariable Long id);

    default ResponseEntity<FormaPago> fallbackFormaPagoById(Long id, Exception e) {
        FormaPago formaPago = new FormaPago();
        formaPago.setNombre("Servicio no disponible de forma de pago");
        return ResponseEntity.ok(formaPago);
    }
}
