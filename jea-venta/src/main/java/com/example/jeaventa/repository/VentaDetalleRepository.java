package com.example.jeaventa.repository;

import com.example.jeaventa.entity.VentaDetalle;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaDetalleRepository extends JpaRepository<VentaDetalle, Integer> {

    @Query("SELECT vd.productoId, SUM(vd.cantidad) " +
            "FROM VentaDetalle vd " +
            "GROUP BY vd.productoId " +
            "ORDER BY SUM(vd.cantidad) DESC")
    List<Object[]> obtenerTopProductosVendidos(Pageable pageable);
}