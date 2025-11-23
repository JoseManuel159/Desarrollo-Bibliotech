import { Injectable } from '@angular/core';
import { CompraDetalle } from '../modelo/CompraDetalle';

@Injectable({
  providedIn: 'root'
})
export class CanastaComprasService {
  private canasta: CompraDetalle[] = [];

  constructor() { }

  agregarProducto(detalle: CompraDetalle): void {
    const existente = this.canasta.find(item => item.productoId === detalle.productoId);
    
    if (existente) {
      existente.cantidad += detalle.cantidad;
      existente.precio = detalle.precio; // Actualizar precio si es diferente
      this.calcularMontos(existente);
    } else {
      this.calcularMontos(detalle);
      this.canasta.push({ ...detalle });
    }
  }

  private calcularMontos(detalle: CompraDetalle): void {
    if (detalle.precio && detalle.cantidad) {
      const baseUnitario = detalle.precio / 1.18;
      const igvUnitario = detalle.precio - baseUnitario;

      detalle.baseImponible = baseUnitario * detalle.cantidad;
      detalle.igv = igvUnitario * detalle.cantidad;
      detalle.total = detalle.precio * detalle.cantidad;
    }
  }

  eliminarProducto(productoId: number): void {
    this.canasta = this.canasta.filter(item => item.productoId !== productoId);
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    const item = this.canasta.find(i => i.productoId === productoId);
    if (item) {
      item.cantidad = cantidad;
      this.calcularMontos(item);
    }
  }

  actualizarPrecio(productoId: number, precio: number): void {
    const item = this.canasta.find(i => i.productoId === productoId);
    if (item) {
      item.precio = precio;
      this.calcularMontos(item);
    }
  }

  getCanasta(): CompraDetalle[] {
    return [...this.canasta];
  }

  vaciarCanasta(): void {
    this.canasta = [];
  }

  getTotal(): number {
    return this.canasta.reduce((total, item) => total + (item.total || 0), 0);
  }

  getBaseImponible(): number {
    return this.canasta.reduce((total, item) => total + (item.baseImponible || 0), 0);
  }

  getIgv(): number {
    return this.canasta.reduce((total, item) => total + (item.igv || 0), 0);
  }
}
