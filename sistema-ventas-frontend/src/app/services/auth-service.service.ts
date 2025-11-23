import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginRequest} from "../modelo/LoginRequest";
import {Observable} from "rxjs";
import {LoginResponse} from "../modelo/LoginResponse";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.HOST}/auth/login`;

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.authUrl, loginData);
  }
}
