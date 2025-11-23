package com.example.jeaventa.dto;

public class ProductoMasVendidoDTO {
    private Long productoId;
    private String nombreProducto;
    private Double cantidadVendida;

    public ProductoMasVendidoDTO() {
    }

    // Constructor
    public ProductoMasVendidoDTO(Long productoId, String nombreProducto, Double cantidadVendida) {
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.cantidadVendida = cantidadVendida;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public Double getCantidadVendida() {
        return cantidadVendida;
    }

    public void setCantidadVendida(Double cantidadVendida) {
        this.cantidadVendida = cantidadVendida;
    }
}