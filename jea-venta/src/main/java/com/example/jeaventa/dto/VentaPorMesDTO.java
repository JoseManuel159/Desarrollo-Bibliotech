package com.example.jeaventa.dto;

public class VentaPorMesDTO {
    private String mes;
    private Double total;

    public VentaPorMesDTO(String mes, Double total) {
        this.mes = mes;
        this.total = total;
    }

    public String getMes() {
        return mes;
    }

    public void setMes(String mes) {
        this.mes = mes;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}