import { Producto } from './Producto';

export interface CompraDetalle {
  id?: number;
  cantidad: number;
  precio: number;
  baseImponible?: number;
  igv?: number;
  total?: number;
  productoId: number;
  producto?: Producto;
}
