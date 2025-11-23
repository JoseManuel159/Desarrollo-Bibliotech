import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Proveedor} from "../../modelo/Proveedor";
import {ProveedorService} from "../../services/proveedor.service";
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
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.css'
})
export class ProveedoresComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Datos
  dataSource = new MatTableDataSource<Proveedor>([]);
  displayedColumns: string[] = ['id', 'ruc', 'nombre', 'contacto', 'estado', 'acciones'];
  
  // Estados
  showDialog = false;
  isLoading = false;
  filtroTexto = '';
  
  // Formulario
  proveedorForm: FormGroup;
  proveedorEditando: Proveedor | null = null;

  // Estadísticas
  get totalProveedores(): number {
    return this.dataSource.data.length;
  }

  get proveedoresActivos(): number {
    return this.dataSource.data.filter(p => p.estado === true).length;
  }

  get proveedoresInactivos(): number {
    return this.dataSource.data.filter(p => p.estado !== true).length;
  }

  constructor(
    private proveedorService: ProveedorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.proveedorForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]],
      direccion: [''],
      correo: ['', [Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Proveedor, filter: string) => {
      const searchText = filter.toLowerCase();
      return data.ruc.toLowerCase().includes(searchText) ||
             data.nombre.toLowerCase().includes(searchText) ||
             (data.correo?.toLowerCase().includes(searchText) || false) ||
             (data.telefono?.toLowerCase().includes(searchText) || false);
    };
  }

  cargarProveedores(): void {
    this.isLoading = true;
    this.proveedorService.listar().subscribe({
      next: data => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al obtener proveedores', err);
        this.snackBar.open('Error al cargar proveedores', 'Cerrar', { duration: 3000 });
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
  openDialog(proveedor?: Proveedor): void {
    this.proveedorEditando = proveedor || null;
    this.showDialog = true;
    
    if (proveedor) {
      this.proveedorForm.patchValue(proveedor);
    } else {
      this.proveedorForm.reset();
    }
  }

  closeDialog(): void {
    this.showDialog = false;
    this.proveedorEditando = null;
    this.proveedorForm.reset();
  }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      this.isLoading = true;
      const proveedorData = this.proveedorForm.value;

      const operacion = this.proveedorEditando
        ? this.proveedorService.actualizar(this.proveedorEditando.id!, proveedorData)
        : this.proveedorService.crear(proveedorData);

      operacion.subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open(
            `Proveedor ${this.proveedorEditando ? 'actualizado' : 'creado'} exitosamente`, 
            'Cerrar', 
            { duration: 3000 }
          );
          this.closeDialog();
          this.cargarProveedores();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al guardar proveedor:', error);
          this.snackBar.open(
            `Error al ${this.proveedorEditando ? 'actualizar' : 'crear'} proveedor`, 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      });
    }
  }

  // Acciones
  eliminarProveedor(proveedor: Proveedor): void {
    if (confirm(`¿Está seguro de eliminar al proveedor ${proveedor.nombre}?`)) {
      this.proveedorService.eliminar(proveedor.id!).subscribe({
        next: () => {
          this.snackBar.open('Proveedor eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarProveedores();
        },
        error: (error) => {
          console.error('Error al eliminar proveedor:', error);
          this.snackBar.open('Error al eliminar proveedor', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleEstado(proveedor: Proveedor): void {
    if (proveedor.estado === true) {
      // Desactivar proveedor
      this.proveedorService.desactivar(proveedor.id!).subscribe({
        next: () => {
          this.snackBar.open('Proveedor desactivado exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarProveedores();
        },
        error: (error) => {
          console.error('Error al desactivar proveedor:', error);
          this.snackBar.open('Error al desactivar proveedor', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      // Activar proveedor usando el nuevo endpoint
      this.proveedorService.activar(proveedor.id!).subscribe({
        next: () => {
          this.snackBar.open('Proveedor activado exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarProveedores();
        },
        error: (error) => {
          console.error('Error al activar proveedor:', error);
          this.snackBar.open('Error al activar proveedor', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // Utilidades para estados
  getEstadoClase(estado: boolean | undefined): string {
    return (estado === true) ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoIcono(estado: boolean | undefined): string {
    return (estado === true) ? 'check_circle' : 'cancel';
  }

  getEstadoTexto(estado: boolean | undefined): string {
    return (estado === true) ? 'Activo' : 'Inactivo';
  }

  // Buscar por RUC
  buscarPorRuc(): void {
    const ruc = this.proveedorForm.get('ruc')?.value;
    if (ruc && ruc.length === 11) {
      this.proveedorService.buscarPorRuc(ruc).subscribe({
        next: (proveedor) => {
          if (proveedor) {
            this.snackBar.open('Proveedor encontrado - datos autocompletos', 'Cerrar', { duration: 2000 });
            this.proveedorForm.patchValue(proveedor);
          }
        },
        error: (error) => {
          // No mostrar error si es 404 (no encontrado), es normal
          if (error.status !== 404) {
            console.error('Error al buscar proveedor por RUC:', error);
            this.snackBar.open('Error al buscar proveedor', 'Cerrar', { duration: 3000 });
          }
          // Si es 404, simplemente no hacemos nada - el usuario puede crear un nuevo proveedor
        }
      });
    }
  }
}
