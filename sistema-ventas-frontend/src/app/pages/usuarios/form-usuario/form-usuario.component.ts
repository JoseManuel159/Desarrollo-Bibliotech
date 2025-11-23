import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsuarioService} from "../../../services/usuario.service";
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {RolService} from "../../../services/rol.service";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {UsuarioListado} from "../../../modelo/UsuarioListado";

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatDialogContent,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<FormUsuarioComponent>,
    private rolService: RolService,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioListado | null // 👈 entrada
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      direccion: [''],
      telefono: [''],
      userName: ['', Validators.required],
      password: [''],
      rolId: [null, Validators.required],
    });

    this.rolService.getRoles().subscribe(data => {
      this.roles = data;
    });

    // Si es edición, precargar datos
    if (this.data) {
      this.usuarioForm.patchValue({
        ...this.data,
        userName: this.data.userName,
        rolId: this.data.rolId // 👈 si lo tienes en el objeto, si no lo agregamos después
      });

      // Deshabilitar campos que no deben editarse
      this.usuarioForm.get('userName')?.disable();
      this.usuarioForm.get('password')?.disable();
    }
  }


  guardar() {
    if (this.usuarioForm.invalid) return;

    let formData = this.usuarioForm.getRawValue(); // incluye campos deshabilitados

    if (this.data) {
      // Si es edición, conservar el estado original
      formData.estado = this.data.estado;

      this.usuarioService.actualizarUsuario(this.data.id, formData).subscribe(() => {
        this.dialogRef.close('actualizado');
      });
    } else {
      // Creación: por defecto estado true
      formData.estado = true;
      this.usuarioService.crearUsuario(formData).subscribe(() => {
        this.dialogRef.close('creado');
      });
    }
  }



  cancelar() {
    this.dialogRef.close();
  }
}
