package com.example.jeaventa.repository;

import com.example.jeaventa.entity.Venta;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Integer> {

    List<Venta> findByFechaVentaBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Venta> findBySerie(String serie);

    // Buscar por número exacto
    List<Venta> findByNumero(String numero);

    // Buscar por serie y número
    Optional<Venta> findBySerieAndNumero(String serie, String numero);

    @Query("SELECT FUNCTION('MONTH', v.fechaVenta), SUM(v.total) " +
            "FROM Venta v GROUP BY FUNCTION('MONTH', v.fechaVenta) ORDER BY FUNCTION('MONTH', v.fechaVenta)")
    List<Object[]> ventasPorMes();

    @Query("SELECT SUM(v.total) FROM Venta v")
    Double obtenerTotalVentas();

}