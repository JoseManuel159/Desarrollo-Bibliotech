package com.example.jeaventa.service;

import com.example.jeaventa.dto.ProductoMasVendidoDTO;
import com.example.jeaventa.dto.VentaPorMesDTO;
import com.example.jeaventa.entity.Venta;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VentaService {
    Venta createVenta(Venta venta);

    List<Venta> getAllVentas();

    Optional<Venta> getVentaById(Integer id);

    Venta updateVenta(Integer id, Venta venta);

    void deleteVenta(Integer id);

    List<Venta> buscarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);

    List<Venta> buscarPorSerie(String serie);
    List<Venta> buscarPorNumero(String numero);
    Optional<Venta> buscarPorSerieYNumero(String serie, String numero);

    List<ProductoMasVendidoDTO> obtenerTop10ProductosVendidos();

    public List<VentaPorMesDTO> obtenerVentasPorMes();

    Double obtenerTotalVentas();


}