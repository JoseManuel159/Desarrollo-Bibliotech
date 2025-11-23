import {Producto} from "./Producto";

export interface DetalleVenta {
  productoId: number;
  cantidad: number;
  nombreProducto: string; // Opcional para mostrar en pantalla
  precioUnitario: number; // Para calcular el total\
  producto?: Producto; // Para mostrar nombre, precio, etc.

}
