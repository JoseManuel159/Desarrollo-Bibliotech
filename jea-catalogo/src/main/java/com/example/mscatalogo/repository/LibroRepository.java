package com.example.mscatalogo.repository;

import com.example.mscatalogo.entity.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByTitulo(String titulo);

    Optional<Libro> findByCodigo(String codigo);

}