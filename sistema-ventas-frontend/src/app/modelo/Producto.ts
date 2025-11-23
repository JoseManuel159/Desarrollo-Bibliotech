import {Categoria} from "./Categoria";

export interface Producto {
  id?: number;// Opcional para nuevos productos
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precioVenta: number;
  costoCompra: number;
  categoria: Categoria;
  imagen?: string;                // Opcional
  estado?: boolean;               // Opcional
  fechaCreacion?: Date;           // Opcional - se asigna en backend
  fechaActualizacion?: Date;      // Opcional - se asigna en backend
}
