package com.example.jeapagos.controller;

import com.example.jeapagos.entity.FormaPago;
import com.example.jeapagos.service.FormaPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
public class FormaPagoController {

    @Autowired
    private FormaPagoService formaPagoService;

    @GetMapping
    public List<FormaPago> listar() {
        return formaPagoService.listarFormasPago();
    }

    @GetMapping("/{id}")
    public FormaPago obtenerPorId(@PathVariable Long id) {
        return formaPagoService.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Forma de pago no encontrada con id: " + id));
    }

    @PostMapping
    public FormaPago guardar(@RequestBody FormaPago formaPago) {
        return formaPagoService.guardar(formaPago);
    }

    @PutMapping("/{id}")
    public FormaPago actualizar(@PathVariable Long id, @RequestBody FormaPago formaPago) {
        return formaPagoService.actualizar(id, formaPago);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        formaPagoService.eliminar(id);
    }
}