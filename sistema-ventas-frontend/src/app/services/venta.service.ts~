import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Venta} from "../modelo/Venta";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private readonly apiUrl = `${environment.HOST}/venta`;

  constructor(private http: HttpClient) {}

  registrarVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }

  listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  buscarPorSerie(serie: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar/serie?serie=${serie}`);
  }

  buscarPorNumero(numero: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar/numero?numero=${numero}`);
  }

  buscarPorFechas(inicio: string, fin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar-por-fechas?inicio=${inicio}&fin=${fin}`);
  }


}
