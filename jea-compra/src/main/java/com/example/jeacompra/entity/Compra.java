package com.example.jeacompra.entity;

import com.example.jeacompra.dto.FormaPago;
import com.example.jeacompra.dto.Proveedor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String serie;

    @Column(nullable = false, unique = true)
    private String numero;

    private String descripcion;

    @Column(name = "proveedor_id")
    private Long proveedorId;

    @Transient
    private Proveedor proveedor;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "compra_id")
    private List<CompraDetalle> detalle;

    private LocalDateTime fechaCompra;

    private Double baseImponible;
    private Double igv;
    private Double total;

    @Column(name = "formapago_id")
    private Long formapagoId;

    @Transient
    private FormaPago formaPago;

    @PrePersist
    public void prePersist() {
        calcularTotales();
        generarSerieYNumero();
    }

    @PreUpdate
    public void preUpdate() {
        calcularTotales();
    }

    private void calcularTotales() {
        this.baseImponible = 0.0;
        this.igv = 0.0;
        this.total = 0.0;

        if (detalle != null) {
            for (CompraDetalle d : detalle) {
                d.calcularMontos();
                this.baseImponible += d.getBaseImponible();
                this.igv += d.getIgv();
                this.total += d.getTotal();
            }
        }
    }

    private void generarSerieYNumero() {
        if (this.serie == null) {
            this.serie = generarSerie();
        }
        if (this.numero == null) {
            this.numero = generarNumero();
        }
    }


    private String generarSerie() {
        String letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(3);
        for (int i = 0; i < 3; i++) {
            int index = random.nextInt(letras.length());
            sb.append(letras.charAt(index));
        }
        return sb.toString();
    }

    private String generarNumero() {
        SecureRandom random = new SecureRandom();
        int numeroAleatorio = random.nextInt(1_000_000); // 0 a 999999
        return String.format("%06d", numeroAleatorio);
    }

    public Compra() {
        this.fechaCompra = LocalDateTime.now();
    }

    public Compra(Long id, String serie, String numero, String descripcion, Long proveedorId, Proveedor proveedor, List<CompraDetalle> detalle, LocalDateTime fechaCompra, Double baseImponible, Double igv, Double total, Long formapagoId, FormaPago formaPago) {
        this.id = id;
        this.serie = serie;
        this.numero = numero;
        this.descripcion = descripcion;
        this.proveedorId = proveedorId;
        this.proveedor = proveedor;
        this.detalle = detalle;
        this.fechaCompra = fechaCompra;
        this.baseImponible = baseImponible;
        this.igv = igv;
        this.total = total;
        this.formapagoId = formapagoId;
        this.formaPago = formaPago;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSerie() {
        return serie;
    }

    public void setSerie(String serie) {
        this.serie = serie;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<CompraDetalle> getDetalle() {
        return detalle;
    }

    public void setDetalle(List<CompraDetalle> detalle) {
        this.detalle = detalle;
    }

    public LocalDateTime getFechaCompra() {
        return fechaCompra;
    }

    public void setFechaCompra(LocalDateTime fechaCompra) {
        this.fechaCompra = fechaCompra;
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

    public Long getProveedorId() {
        return proveedorId;
    }

    public void setProveedorId(Long proveedorId) {
        this.proveedorId = proveedorId;
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }
}