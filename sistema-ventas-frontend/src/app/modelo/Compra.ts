import { Proveedor } from './Proveedor';
import { CompraDetalle } from './CompraDetalle';

export interface Compra {
  id?: number;
  serie?: string;
  numero?: string;
  descripcion?: string;
  proveedorId: number;
  proveedor?: Proveedor;
  detalle: CompraDetalle[];
  fechaCompra?: Date;
  baseImponible?: number;
  igv?: number;
  total?: number;
  formapagoId: number;
}
