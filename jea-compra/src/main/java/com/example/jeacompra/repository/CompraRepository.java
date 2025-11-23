package com.example.jeacompra.repository;

import com.example.jeacompra.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

    List<Compra> findByFechaCompraBetween(LocalDateTime inicio, LocalDateTime fin);

    List<Compra> findBySerie(String serie);

    List<Compra> findByNumero(String numero);

    Optional<Compra> findBySerieAndNumero(String serie, String numero);
}