package com.example.jeaventa.controller;

import com.example.jeaventa.dto.ProductoMasVendidoDTO;
import com.example.jeaventa.dto.VentaPorMesDTO;
import com.example.jeaventa.entity.Venta;
import com.example.jeaventa.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/venta")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping
    public ResponseEntity<Venta> crearVenta(@RequestBody Venta venta) {
        Venta nuevaVenta = ventaService.createVenta(venta);
        return ResponseEntity.ok(nuevaVenta);
    }

    @GetMapping
    public List<Venta> listarVentas() {
        return ventaService.getAllVentas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtenerVenta(@PathVariable Integer id) {
        return ventaService.getVentaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizarVenta(@PathVariable Integer id, @RequestBody Venta venta) {
        Venta actualizada = ventaService.updateVenta(id, venta);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarVenta(@PathVariable Integer id) {
        ventaService.deleteVenta(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/buscar-por-fechas")
    public ResponseEntity<List<Venta>> buscarPorRangoFechas(
            @RequestParam("inicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam("fin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        List<Venta> ventas = ventaService.buscarPorRangoFechas(inicio, fin);
        return ResponseEntity.ok(ventas);
    }

    @GetMapping("/buscar/serie")
    public ResponseEntity<List<Venta>> buscarPorSerie(@RequestParam String serie) {
        return ResponseEntity.ok(ventaService.buscarPorSerie(serie));
    }

    @GetMapping("/buscar/numero")
    public ResponseEntity<List<Venta>> buscarPorNumero(@RequestParam String numero) {
        return ResponseEntity.ok(ventaService.buscarPorNumero(numero));
    }

    @GetMapping("/buscar/serie-numero")
    public ResponseEntity<Venta> buscarPorSerieYNumero(
            @RequestParam String serie,
            @RequestParam String numero) {
        return ventaService.buscarPorSerieYNumero(serie, numero)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<List<ProductoMasVendidoDTO>> top10MasVendidos() {
        return ResponseEntity.ok(ventaService.obtenerTop10ProductosVendidos());
    }

    @GetMapping("/ventas-por-mes")
    public ResponseEntity<List<VentaPorMesDTO>> obtenerVentasPorMes() {
        return ResponseEntity.ok(ventaService.obtenerVentasPorMes());
    }

    @GetMapping("/total-ventas")
    public ResponseEntity<Double> obtenerTotalVentas() {
        return ResponseEntity.ok(ventaService.obtenerTotalVentas());
    }

}