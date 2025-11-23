package com.example.jeaventa.entity;

import com.example.jeaventa.dto.Cliente;
import com.example.jeaventa.dto.FormaPago;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String serie;

    @Column(nullable = false, unique = true)
    private String numero;

    private String descripcion;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Transient
    private Cliente cliente;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "venta_id")
    private List<VentaDetalle> detalle;

    private LocalDateTime fechaVenta;

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
            for (VentaDetalle d : detalle) {
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

    public Venta() {
        this.fechaVenta = LocalDateTime.now();
    }

    public Venta(Integer id, String serie, String numero, String descripcion, Long clienteId, Cliente cliente, List<VentaDetalle> detalle, LocalDateTime fechaVenta, Double baseImponible, Double igv, Double total, FormaPago formaPago, Long formapagoId) {
        this.id = id;
        this.serie = serie;
        this.numero = numero;
        this.descripcion = descripcion;
        this.clienteId = clienteId;
        this.cliente = cliente;
        this.detalle = detalle;
        this.fechaVenta = fechaVenta;
        this.baseImponible = baseImponible;
        this.igv = igv;
        this.total = total;
        this.formaPago = formaPago;
        this.formapagoId = formapagoId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public List<VentaDetalle> getDetalle() {
        return detalle;
    }

    public void setDetalle(List<VentaDetalle> detalle) {
        this.detalle = detalle;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
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

    public FormaPago getFormaPago() {
        return formaPago;
    }

    public void setFormaPago(FormaPago formaPago) {
        this.formaPago = formaPago;
    }

    public Long getFormapagoId() {
        return formapagoId;
    }

    public void setFormapagoId(Long formapagoId) {
        this.formapagoId = formapagoId;
    }
}