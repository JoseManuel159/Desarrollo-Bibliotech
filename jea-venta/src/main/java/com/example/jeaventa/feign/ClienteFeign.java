package com.example.jeaventa.feign;

import com.example.jeaventa.dto.Cliente;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "jea-cliente-service", path = "/cliente")
public interface ClienteFeign {
    @GetMapping("/{id}")
    @CircuitBreaker(name = "clientByIdCB", fallbackMethod = "fallbackClientById")
    public ResponseEntity<Cliente> listarcliente(@PathVariable Long id);

    default ResponseEntity<Cliente> fallbackClientById(Long id, Exception e) {
        Cliente clientDto = new Cliente();
        clientDto.setNombre("Servicio no disponible de cliente");
        return ResponseEntity.ok(clientDto);
    }

}
