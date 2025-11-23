import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../modelo/Compra';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private readonly apiUrl = `${environment.HOST}/compra`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}`);
  }

  obtenerPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  crear(compra: Compra): Observable<Compra> {
    return this.http.post<Compra>(`${this.apiUrl}`, compra);
  }

  actualizar(id: number, compra: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/${id}`, compra);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorFechas(inicio: string, fin: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar-por-fechas?inicio=${inicio}&fin=${fin}`);
  }

  buscarPorSerie(serie: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar/serie?serie=${serie}`);
  }

  buscarPorNumero(numero: string): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.apiUrl}/buscar/numero?numero=${numero}`);
  }

  buscarPorSerieYNumero(serie: string, numero: string): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/buscar/serie-numero?serie=${serie}&numero=${numero}`);
  }
}
