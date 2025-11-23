import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgClass, NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NgClass,
    NgForOf,
    TitleCasePipe
  ],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.css'
})
export class HomeLayoutComponent {
  showSidebar = true;
  accesos: any[] = [];

  constructor(private router: Router) {
    const accesosData = localStorage.getItem('accesos');
    this.accesos = accesosData ? JSON.parse(accesosData) : [];

    // 🟡 Ordenar por el campo 'orden' si existe
    this.accesos.sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }


}
