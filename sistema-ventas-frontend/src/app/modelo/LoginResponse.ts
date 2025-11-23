export interface LoginResponse {
  token: string;
  userName: string;
  accesos: {
    nombre: string;
    url: string;
    icono: string;
  }[];
}
