package com.example.jeacompra.service;

import com.example.jeacompra.entity.Compra;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CompraService {
    Compra createCompra(Compra compra);

    List<Compra> getAllCompra();

    Optional<Compra> getCompraById(Long id);

    Compra updateCompra(Long id, Compra compra);

    void deleteCompra(Long id);

    List<Compra> buscarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);

    List<Compra> buscarPorSerie(String serie);

    List<Compra> buscarPorNumero(String numero);

    Optional<Compra> buscarPorSerieYNumero(String serie, String numero);

}