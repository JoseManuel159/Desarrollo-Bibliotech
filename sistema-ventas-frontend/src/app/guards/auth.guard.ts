import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      return true; // Token presente: permite entrar
    } else {
      this.router.navigate(['/login']); // Redirige a login si no hay token
      return false;
    }
  }
}
