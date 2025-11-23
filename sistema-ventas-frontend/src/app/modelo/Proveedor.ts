export interface Proveedor {
  id?: number;
  ruc: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  correo?: string;
  estado?: boolean;
}
