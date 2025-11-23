package com.example.jeaventa.entity;

import com.example.jeaventa.dto.Producto;
import jakarta.persistence.*;

@Entity
public class VentaDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Double cantidad;
    private Double precio;

    private Double baseImponible;
    private Double igv;
    private Double total;

    @Column(name = "producto_id")
    private Long productoId;

    @Transient
    private Producto producto;

    public VentaDetalle() {
        this.cantidad = 0.0;
        this.precio = 0.0;
    }

    @PrePersist
    @PreUpdate
    public void calcularMontos() {
        if (precio != null && cantidad != null) {
            double baseUnitario = precio / 1.18;
            double igvUnitario = precio - baseUnitario;

            this.baseImponible = baseUnitario * cantidad;
            this.igv = igvUnitario * cantidad;
            this.total = precio * cantidad;
        }
    }

    public VentaDetalle(Integer id, Double cantidad, Double precio, Double baseImponible, Double igv, Double total, Long productoId, Producto producto) {
        this.id = id;
        this.cantidad = cantidad;
        this.precio = precio;
        this.baseImponible = baseImponible;
        this.igv = igv;
        this.total = total;
        this.productoId = productoId;
        this.producto = producto;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getCantidad() {
        return cantidad;
    }

    public void setCantidad(Double cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
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
}