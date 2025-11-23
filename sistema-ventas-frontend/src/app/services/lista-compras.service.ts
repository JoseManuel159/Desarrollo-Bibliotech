import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../modelo/Compra';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ListaComprasService {
  private readonly apiUrl = `${environment.HOST}/compra`;

  constructor(private http: HttpClient) { }

  listarCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}`);
  }

  obtenerCompraPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  buscarPorFechas(fechaInicio: string, fechaFin: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar-por-fechas?inicio=${fechaInicio}&fin=${fechaFin}`);
  }

  buscarPorSerie(serie: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar/serie?serie=${serie}`);
  }

  buscarPorNumero(numero: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar/numero?numero=${numero}`);
  }

  eliminarCompra(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
