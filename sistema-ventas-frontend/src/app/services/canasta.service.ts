import { Injectable } from '@angular/core';
import {ItemCanasta} from "../modelo/ItemCanasta";
import {BehaviorSubject, map ,Observable} from "rxjs";
import {Producto} from "../modelo/Producto";

@Injectable({
  providedIn: 'root'
})
export class CanastaService {
  private items: ItemCanasta[] = [];
  private itemsSubject = new BehaviorSubject<ItemCanasta[]>([]);

  items$ = this.itemsSubject.asObservable();

  agregar(producto: Producto) {
    const item = this.items.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad++;
    } else {
      this.items.push({ producto, cantidad: 1 });
    }
    this.itemsSubject.next(this.items);
  }

  quitar(producto: Producto) {
    const item = this.items.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad--;
      if (item.cantidad <= 0) {
        this.items = this.items.filter(i => i.producto.id !== producto.id);
      }
      this.itemsSubject.next(this.items);
    }
  }

  eliminar(producto: Producto) {
    this.items = this.items.filter(i => i.producto.id !== producto.id);
    this.itemsSubject.next(this.items);
  }

  getTotal(): Observable<number> {
    return this.items$.pipe(
      map((items) =>
        items.reduce((total, item) => total + item.producto.precioVenta * item.cantidad, 0)
      )
    );
  }

  vaciar() {
    this.items = []; // ← Limpia también el arreglo real
    this.itemsSubject.next([]);
  }

  agregarConCantidad(producto: Producto, cantidad: number): void {
    const item = this.items.find(i => i.producto.id === producto.id);
    if (item) {
      item.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    this.itemsSubject.next(this.items);
  }


  obtenerCantidadPorProducto(productoId: number): number {
    const item = this.items.find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

}
