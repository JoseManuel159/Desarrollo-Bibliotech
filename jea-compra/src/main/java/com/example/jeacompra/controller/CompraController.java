package com.example.jeacompra.controller;

import com.example.jeacompra.entity.Compra;
import com.example.jeacompra.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/compra")
public class CompraController {

    @Autowired
    private CompraService compraService;

    @PostMapping
    public ResponseEntity<Compra> crearCompra(@RequestBody Compra compra) {
        Compra nuevaCompra = compraService.createCompra(compra);
        return ResponseEntity.ok(nuevaCompra);
    }

    @GetMapping
    public List<Compra> listarCompras() {
        return compraService.getAllCompra();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra> obtenerCompra(@PathVariable Long id) {
        return compraService.getCompraById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Compra> actualizarCompra(@PathVariable Long id, @RequestBody Compra compra) {
        Compra actualizada = compraService.updateCompra(id, compra);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCompra(@PathVariable Long id) {
        compraService.deleteCompra(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar-por-fechas")
    public ResponseEntity<List<Compra>> buscarPorRangoFechas(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        List<Compra> compras = compraService.buscarPorRangoFechas(inicio, fin);
        return ResponseEntity.ok(compras);
    }

    // Buscar compras por serie
    @GetMapping("/buscar/serie")
    public ResponseEntity<List<Compra>> buscarPorSerie(@RequestParam String serie) {
        return ResponseEntity.ok(compraService.buscarPorSerie(serie));
    }

    // Buscar compras por número
    @GetMapping("/buscar/numero")
    public ResponseEntity<List<Compra>> buscarPorNumero(@RequestParam String numero) {
        return ResponseEntity.ok(compraService.buscarPorNumero(numero));
    }

    // Buscar compra por serie y número
    @GetMapping("/buscar/serie-numero")
    public ResponseEntity<Compra> buscarPorSerieYNumero(
            @RequestParam String serie,
            @RequestParam String numero) {
        return compraService.buscarPorSerieYNumero(serie, numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}