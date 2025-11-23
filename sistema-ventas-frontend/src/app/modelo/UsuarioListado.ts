export interface UsuarioListado {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  direccion: string;
  telefono: string;
  estado: boolean;
  userName: string;
  rol: string;
  rolId: number;    // id del rol (ej. 1, 2, 3)
}
