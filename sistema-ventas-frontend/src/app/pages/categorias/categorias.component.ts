import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Design Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Categoria } from '../../modelo/Categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Propiedades para la tabla
  dataSource = new MatTableDataSource<Categoria>();
  displayedColumns: string[] = ['id', 'nombre', 'estado', 'fechaCreacion', 'acciones'];
  filtroTexto = '';

  // Propiedades para el modal/diálogo
  showDialog = false;
  categoriaEditando: Categoria | null = null;
  categoriaForm: FormGroup;
  isLoading = false;

  // Estadísticas
  totalCategorias = 0;
  categoriasActivas = 0;
  categoriasInactivas = 0;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.dataSource.data = categorias;
        this.calcularEstadisticas();
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  calcularEstadisticas(): void {
    this.totalCategorias = this.dataSource.data.length;
    this.categoriasActivas = this.dataSource.data.filter(cat => cat.estado !== false).length;
    this.categoriasInactivas = this.totalCategorias - this.categoriasActivas;
  }

  aplicarFiltro(): void {
    const filtro = this.filtroTexto.toLowerCase();
    this.dataSource.filter = filtro;

    this.dataSource.filterPredicate = (categoria: Categoria, filter: string) => {
      const searchText = (
        categoria.id?.toString() + ' ' +
        categoria.nombre?.toLowerCase()
      ).trim();

      return searchText.includes(filter);
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(categoria?: Categoria): void {
    this.categoriaEditando = categoria || null;
    this.resetForm();

    if (categoria) {
      this.cargarDatosCategoria(categoria);
    }

    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.categoriaForm.reset({
      nombre: ''
    });
    this.isLoading = false;
  }

  cargarDatosCategoria(categoria: Categoria): void {
    this.categoriaForm.patchValue({
      nombre: categoria.nombre
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      this.isLoading = true;
      const formValue = this.categoriaForm.value;

      const categoria: Categoria = {
        nombre: formValue.nombre.trim(),
        estado: true
      };

      if (this.categoriaEditando) {
        // Actualizar categoría existente
        this.categoriaService.actualizar(this.categoriaEditando.id!, categoria)
          .subscribe({
            next: () => {
              this.snackBar.open('Categoría actualizada exitosamente', 'Cerrar', { duration: 3000 });
              this.closeDialog();
              this.cargarCategorias();
            },
            error: (error) => {
              console.error('Error al actualizar categoría:', error);
              this.snackBar.open('Error al actualizar la categoría', 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          });
      } else {
        // Crear nueva categoría
        this.categoriaService.crear(categoria)
          .subscribe({
            next: () => {
              this.snackBar.open('Categoría creada exitosamente', 'Cerrar', { duration: 3000 });
              this.closeDialog();
              this.cargarCategorias();
            },
            error: (error) => {
              console.error('Error al crear categoría:', error);
              this.snackBar.open('Error al crear la categoría', 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          });
      }
    }
  }

  toggleEstado(categoria: Categoria): void {
    if (categoria.estado) {
      // Desactivar categoría
      this.categoriaService.desactivar(categoria.id!).subscribe({
        next: () => {
          this.snackBar.open('Categoría desactivada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al desactivar categoría:', error);
          this.snackBar.open('Error al desactivar categoría', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      // Reactivar categoría
      const categoriaActualizada = { ...categoria, estado: true };
      this.categoriaService.actualizar(categoria.id!, categoriaActualizada).subscribe({
        next: () => {
          this.snackBar.open('Categoría activada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al activar categoría:', error);
          this.snackBar.open('Error al activar categoría', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  eliminarCategoria(categoria: Categoria): void {
    if (confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      this.categoriaService.eliminar(categoria.id!).subscribe({
        next: () => {
          this.snackBar.open('Categoría eliminada', 'Cerrar', { duration: 3000 });
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.snackBar.open('Error al eliminar categoría', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  getEstadoClase(estado?: boolean): string {
    return estado !== false ? 'estado-activo' : 'estado-inactivo';
  }

  getEstadoTexto(estado?: boolean): string {
    return estado !== false ? 'Activo' : 'Inactivo';
  }

  getEstadoIcono(estado?: boolean): string {
    return estado !== false ? 'check_circle' : 'cancel';
  }
}
