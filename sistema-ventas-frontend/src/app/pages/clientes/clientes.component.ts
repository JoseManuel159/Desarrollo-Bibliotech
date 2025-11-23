import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Cliente} from "../../modelo/Cliente";
import {ClienteService} from "../../services/cliente.service";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Datos
  dataSource = new MatTableDataSource<Cliente>([]);
  displayedColumns: string[] = ['id', 'dni', 'nombreCompleto', 'contacto', 'estado', 'fechaRegistro', 'acciones'];
  
  // Estados
  showDialog = false;
  isLoading = false;
  filtroTexto = '';
  
  // Formulario
  clienteForm: FormGroup;
  clienteEditando: Cliente | null = null;

  // Estadísticas
  get totalClientes(): number {
    return this.dataSource.data.length;
  }

  get clientesActivos(): number {
    return this.dataSource.data.filter(c => c.activo).length;
  }

  get clientesInactivos(): number {
    return this.dataSource.data.filter(c => !c.activo).length;
  }

  constructor(
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      const searchText = filter.toLowerCase();
      return data.dni.toLowerCase().includes(searchText) ||
             data.nombre.toLowerCase().includes(searchText) ||
             (data.apellido?.toLowerCase().includes(searchText) || false) ||
             data.email.toLowerCase().includes(searchText) ||
             (data.telefono?.toLowerCase().includes(searchText) || false);
    };
  }

  cargarClientes(): void {
    this.isLoading = true;
    this.clienteService.listar().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al obtener clientes', err);
        this.snackBar.open('Error al cargar clientes', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  // Filtros
  aplicarFiltro(): void {
    const filtro = this.filtroTexto.trim().toLowerCase();
    this.dataSource.filter = filtro;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Modal
  openDialog(cliente?: Cliente): void {
    this.clienteEditando = cliente || null;
    this.showDialog = true;
    
    if (cliente) {
      this.clienteForm.patchValue(cliente);
    } else {
      this.clienteForm.reset();
    }
  }

  closeDialog(): void {
    this.showDialog = false;
    this.clienteEditando = null;
    this.clienteForm.reset();
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      this.isLoading = true;
      const clienteData = this.clienteForm.value;

      const operacion = this.clienteEditando
        ? this.clienteService.actualizar(this.clienteEditando.id, clienteData)
        : this.clienteService.crear(clienteData);

      operacion.subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(
            `Cliente ${this.clienteEditando ? 'actualizado' : 'creado'} exitosamente`, 
            'Cerrar', 
            { duration: 3000 }
          );
          this.closeDialog();
          this.cargarClientes();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al guardar cliente:', error);
          this.snackBar.open(
            `Error al ${this.clienteEditando ? 'actualizar' : 'crear'} cliente`, 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      });
    }
  }

  // Acciones
  eliminarCliente(cliente: Cliente): void {
    if (confirm(`¿Está seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`)) {
      this.clienteService.eliminar(cliente.id).subscribe({
        next: () => {
          this.snackBar.open('Cliente eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarClientes();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);
          this.snackBar.open('Error al eliminar cliente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleEstado(cliente: Cliente): void {
    const clienteActualizado = { ...cliente, activo: !cliente.activo };
    
    this.clienteService.actualizar(cliente.id, clienteActualizado).subscribe({
      next: () => {
        this.snackBar.open(
          `Cliente ${clienteActualizado.activo ? 'activado' : 'desactivado'} exitosamente`, 
          'Cerrar', 
          { duration: 3000 }
        );
        this.cargarClientes();
      },
      error: (error) => {
        console.error('Error al cambiar estado del cliente:', error);
        this.snackBar.open('Error al cambiar estado del cliente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // Utilidades para estados
  getEstadoClase(activo: boolean): string {
    return activo ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoIcono(activo: boolean): string {
    return activo ? 'check_circle' : 'cancel';
  }

  getEstadoTexto(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }
}
