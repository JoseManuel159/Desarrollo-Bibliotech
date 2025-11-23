package com.example.jeaproveedor.repository;

import com.example.jeaproveedor.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    @Modifying
    @Query("UPDATE Proveedor p SET p.estado = :estado WHERE p.id = :id")
    void cambiarEstado(@Param("id") Long id, @Param("estado") boolean estado);
    Optional<Proveedor> findByruc(String ruc);
}