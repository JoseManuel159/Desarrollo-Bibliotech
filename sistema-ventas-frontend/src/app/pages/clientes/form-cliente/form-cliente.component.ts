import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../modelo/Cliente';
import { ClienteService } from '../../../services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>{{ esEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
    
    <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="space-y-4">
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>DNI</mat-label>
          <input matInput formControlName="dni" placeholder="Ingrese DNI">
          <mat-error *ngIf="clienteForm.get('dni')?.hasError('required')">
            El DNI es requerido
          </mat-error>
          <mat-error *ngIf="clienteForm.get('dni')?.hasError('pattern')">
            El DNI debe tener 8 dígitos
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" placeholder="Ingrese nombre">
          <mat-error *ngIf="clienteForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="apellido" placeholder="Ingrese apellido">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="direccion" placeholder="Ingrese dirección">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" placeholder="Ingrese teléfono">
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" placeholder="Ingrese email">
          <mat-error *ngIf="clienteForm.get('email')?.hasError('required')">
            El email es requerido
          </mat-error>
          <mat-error *ngIf="clienteForm.get('email')?.hasError('email')">
            Ingrese un email válido
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="activo">Cliente Activo</mat-checkbox>

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="clienteForm.invalid || cargando">
          {{ cargando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 400px;
      max-height: 500px;
      overflow-y: auto;
    }
  `]
})
export class FormClienteComponent implements OnInit {
  clienteForm: FormGroup;
  esEdicion = false;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FormClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cliente?: Cliente }
  ) {
    this.clienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: [''],
      direccion: [''],
      telefono: [''],
      email: ['', [Validators.required, Validators.email]],
      activo: [true]
    });
  }

  ngOnInit(): void {
    if (this.data?.cliente) {
      this.esEdicion = true;
      this.clienteForm.patchValue(this.data.cliente);
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.cargando = true;
      const clienteData = this.clienteForm.value;

      const operacion = this.esEdicion
        ? this.clienteService.actualizar(this.data.cliente!.id, clienteData)
        : this.clienteService.crear(clienteData);

      operacion.subscribe({
        next: (cliente) => {
          this.cargando = false;
          this.snackBar.open(
            `Cliente ${this.esEdicion ? 'actualizado' : 'creado'} exitosamente`, 
            'Cerrar', 
            { duration: 3000 }
          );
          this.dialogRef.close(cliente);
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al guardar cliente:', error);
          this.snackBar.open(
            `Error al ${this.esEdicion ? 'actualizar' : 'crear'} cliente`, 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
