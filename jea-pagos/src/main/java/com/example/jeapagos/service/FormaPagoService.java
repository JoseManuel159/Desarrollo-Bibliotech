package com.example.jeapagos.service;

import com.example.jeapagos.entity.FormaPago;

import java.util.List;
import java.util.Optional;

public interface FormaPagoService {

    List<FormaPago> listarFormasPago();
    FormaPago guardar(FormaPago formaPago);
    Optional<FormaPago> buscarPorId(Long id);
    FormaPago actualizar(Long id, FormaPago formaPago);
    void eliminar(Long id);
}