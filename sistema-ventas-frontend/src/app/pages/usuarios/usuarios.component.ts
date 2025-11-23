import {Component, OnInit} from '@angular/core';
import {UsuarioListado} from "../../modelo/UsuarioListado";
import {UsuarioService} from "../../services/usuario.service";
import {NgForOf} from "@angular/common";
import {FormUsuarioComponent} from "./form-usuario/form-usuario.component";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    NgForOf,

  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuariosActivos: UsuarioListado[] = [];
  usuariosInactivos: UsuarioListado[] = [];
  mostrarActivos: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listarPorEstado(true).subscribe(data => {
      this.usuariosActivos = data;
    });

    this.usuarioService.listarPorEstado(false).subscribe(data => {
      this.usuariosInactivos = data;
    });
  }

  cambiarEstado(usuario: UsuarioListado) {
    const nuevoEstado = !usuario.estado;
    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado).subscribe(() => {
      this.cargarUsuarios();
    });
  }

  abrirDialogoUsuario(usuario?: UsuarioListado): void {
    const dialogRef = this.dialog.open(FormUsuarioComponent, {
      width: '500px',
      data: usuario || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'creado' || result === 'actualizado') {
        this.cargarUsuarios(); // refresca
      }
    });
  }


}
