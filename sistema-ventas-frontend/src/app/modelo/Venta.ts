import {DetalleVenta} from "./DetalleVenta";

export interface Venta {
  clienteId: number;
  detalle: DetalleVenta[];
  formapagoId: number;
}
