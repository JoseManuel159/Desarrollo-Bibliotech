package com.example.jeapedidos.entity;

import com.example.jeapedidos.dto.Cliente;
import com.example.jeapedidos.dto.FormaPago;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false, unique = true)
    private String serie;

    private String descripcion;
    private String estado;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Transient
    private Cliente cliente;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "pedido_id")
    private List<PedidoDetalle> detalle;

    private LocalDateTime fechaPedido;
    private LocalDate fechaEntrega;

    private Double baseImponible;
    private Double igv;
    private Double total;

    @Column(name = "formapago_id")
    private Long formapagoId;

    @Transient
    private FormaPago formaPago;



    public Pedido() {
        this.fechaPedido = LocalDateTime.now();
        this.fechaEntrega = this.fechaPedido.toLocalDate().plusWeeks(1); // Entrega 1 semana después
        this.estado = "PENDIENTE";
    }

    public Pedido(Integer id, String codigo, String serie,String descripcion, String estado, Long clienteId, Cliente cliente, List<PedidoDetalle> detalle, LocalDateTime fechaPedido, LocalDate fechaEntrega, Double baseImponible, Double igv, Double total, Long formapagoId, FormaPago formaPago) {
        this.id = id;
        this.codigo = codigo;
        this.serie = serie;
        this.descripcion = descripcion;
        this.estado = estado;
        this.clienteId = clienteId;
        this.cliente = cliente;
        this.detalle = detalle;
        this.fechaPedido = fechaPedido;
        this.fechaEntrega = fechaEntrega;
        this.baseImponible = baseImponible;
        this.igv = igv;
        this.total = total;
        this.formapagoId = formapagoId;
        this.formaPago = formaPago;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<PedidoDetalle> getDetalle() {
        return detalle;
    }

    public void setDetalle(List<PedidoDetalle> detalle) {
        this.detalle = detalle;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public LocalDate getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDate fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public Double getBaseImponible() {
        return baseImponible;
    }

    public void setBaseImponible(Double baseImponible) {
        this.baseImponible = baseImponible;
    }

    public Double getIgv() {
        return igv;
    }

    public void setIgv(Double igv) {
        this.igv = igv;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Long getFormapagoId() {
        return formapagoId;
    }

    public void setFormapagoId(Long formapagoId) {
        this.formapagoId = formapagoId;
    }

    public FormaPago getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(FormaPago formaPago) {
        this.formaPago = formaPago;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }
}