import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsuarioListado} from "../modelo/UsuarioListado";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.HOST}/usuario`;

  constructor(private http: HttpClient) {}

  listarPorEstado(estado: boolean): Observable<UsuarioListado[]> {
    return this.http.get<UsuarioListado[]>(`${this.apiUrl}/estado?estado=${estado}`);
  }

  cambiarEstado(id: number, estado: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, data);
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

}
