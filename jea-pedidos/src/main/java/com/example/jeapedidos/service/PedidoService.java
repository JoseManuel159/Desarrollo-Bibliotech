package com.example.jeapedidos.service;

import com.example.jeapedidos.entity.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoService {
    Pedido createPedido(Pedido pedido);

    List<Pedido> getAllPedidos();

    Optional<Pedido> getPedidoById(Integer id);

    Pedido updatePedido(Integer id, Pedido pedido);

    void deletePedido(Integer id);
}