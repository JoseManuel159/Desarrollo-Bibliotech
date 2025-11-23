import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Producto} from "../../modelo/Producto";
import {Categoria} from "../../modelo/Categoria";
import {ProductoService} from "../../services/producto.service";
import {CategoriaService} from "../../services/categoria.service";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {CommonModule, CurrencyPipe, DatePipe, NgClass, NgIf, SlicePipe} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {MatChip} from "@angular/material/chips";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatTable,
    NgIf,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    CurrencyPipe,
    DatePipe,
    NgClass,
    MatButton,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    MatTooltip,
    MatChip,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatSelectModule,
    MatCheckboxModule,
    SlicePipe
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Propiedades para la tabla
  dataSource = new MatTableDataSource<Producto>();
  columnas: string[] = ['imagen', 'codigo', 'nombre', 'cantidad', 'precioVenta', 'categoria', 'estado', 'fechaCreacion', 'acciones'];
  filtroTexto = '';
  failedImages = new Set<string>(); // Track de imágenes que fallaron

  // Propiedades para el diálogo
  showDialog = false;
  productoEditando: Producto | null = null;
  productoForm: FormGroup;
  categorias: Categoria[] = [];
  selectedFile: File | null = null;
  imagenPreview: string | null = null;
  isDragOver = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      descripcion: [''],
      categoriaId: ['', [Validators.required]],
      cantidad: [0, [Validators.min(0)]],
      precioVenta: [0, [Validators.min(0.01)]],
      costoCompra: [0, [Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  cargarProductos(): void {
    // Limpiar el estado de imágenes fallidas
    this.failedImages.clear();

    this.productoService.listar().subscribe({
      next: (productos) => {
        this.dataSource.data = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias.filter(cat => cat.estado !== false);
        console.log('Categorías cargadas en productos:', this.categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.snackBar.open('Error al cargar categorías', 'Cerrar', { duration: 3000 });
      }
    });
  }

  aplicarFiltro(): void {
    const filtro = this.filtroTexto.toLowerCase();
    this.dataSource.filter = filtro;

    this.dataSource.filterPredicate = (producto: Producto, filter: string) => {
      const searchText = (
        producto.codigo?.toLowerCase() + ' ' +
        producto.nombre?.toLowerCase() + ' ' +
        producto.descripcion?.toLowerCase() + ' ' +
        producto.categoria?.nombre?.toLowerCase()
      ).trim();

      return searchText.includes(filter);
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(producto?: Producto): void {
    this.productoEditando = producto || null;
    this.resetForm();

    if (producto) {
      this.cargarDatosProducto(producto);
    }

    this.showDialog = true;
  }

  closeDialog(): void {
    this.showDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.productoForm.reset({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoriaId: '',
      cantidad: 0,
      precioVenta: 0,
      costoCompra: 0
    });
    this.selectedFile = null;
    this.imagenPreview = null;
    this.isDragOver = false;
    this.isLoading = false;
  }

  cargarDatosProducto(producto: Producto): void {
    this.productoForm.patchValue({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoriaId: producto.categoria?.id || '',
      cantidad: producto.cantidad || 0,
      precioVenta: producto.precioVenta || 0,
      costoCompra: producto.costoCompra || 0
    });

    // Cargar imagen si existe
    if (producto.imagen) {
      this.imagenPreview = this.productoService.getImagenUrl(producto.imagen);
    } else {
      this.imagenPreview = null; // No mostrar preview si no hay imagen
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  processFile(file: File): void {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Solo se permiten archivos de imagen', 'Cerrar', { duration: 3000 });
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.snackBar.open('La imagen no debe superar los 5MB', 'Cerrar', { duration: 3000 });
      return;
    }

    this.selectedFile = file;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagenPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagenPreview = null;
  }

  onImagePreviewError(event: any): void {
    console.log('Error cargando preview de imagen');
    // Si falla el preview, usar placeholder desde public
    const placeholderImage = '/no-image.svg';
    
    if (!event.target.src.includes('no-image.svg')) {
      event.target.src = placeholderImage;
    } else {
      // Si también falla el placeholder, remover el preview
      this.imagenPreview = null;
      this.snackBar.open('Error al cargar la imagen', 'Cerrar', { duration: 3000 });
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      this.isLoading = true;
      const formValue = this.productoForm.value;

      // Encontrar la categoría seleccionada
      const categoriaSeleccionada = this.categorias.find(cat => cat.id === Number(formValue.categoriaId));
      
      const producto: Producto = {
        codigo: formValue.codigo,
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        cantidad: formValue.cantidad,
        precioVenta: formValue.precioVenta,
        costoCompra: formValue.costoCompra,
        categoria: categoriaSeleccionada!,
        estado: true
      };

      if (this.productoEditando) {
        // Actualizar producto existente
        this.productoService.actualizarConImagen(this.productoEditando.id!, producto, this.selectedFile || undefined)
          .subscribe({
            next: (result) => {
              this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 3000 });
              this.closeDialog();
              this.cargarProductos();
            },
            error: (error) => {
              console.error('Error al actualizar producto:', error);
              this.snackBar.open('Error al actualizar el producto', 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          });
      } else {
        // Crear nuevo producto
        this.productoService.crearConImagen(producto, this.selectedFile || undefined)
          .subscribe({
            next: (result) => {
              this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
              this.closeDialog();
              this.cargarProductos();
            },
            error: (error) => {
              console.error('Error al crear producto:', error);
              this.snackBar.open('Error al crear el producto', 'Cerrar', { duration: 3000 });
              this.isLoading = false;
            }
          });
      }
    }
  }

  toggleEstado(producto: Producto): void {
    if (producto.estado) {
      this.productoService.desactivar(producto.id!).subscribe({
        next: () => {
          this.snackBar.open('Producto desactivado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al desactivar producto:', error);
          this.snackBar.open('Error al desactivar producto', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      // Reactivar producto
      const productoActualizado = { ...producto, estado: true };
      this.productoService.actualizar(producto.id!, productoActualizado).subscribe({
        next: () => {
          this.snackBar.open('Producto activado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al activar producto:', error);
          this.snackBar.open('Error al activar producto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  eliminarProducto(producto: Producto): void {
    if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?`)) {
      this.productoService.eliminar(producto.id!).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
          this.cargarProductos();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.snackBar.open('Error al eliminar producto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  getImagenUrl(nombreImagen?: string): string {
    return this.productoService.getImagenUrl(nombreImagen);
  }

  getImagenUrlOrDefault(nombreImagen?: string): string {
    return this.productoService.getImagenUrlOrDefault(nombreImagen);
  }

  onImageError(event: any, producto?: Producto): void {
    const imageUrl = event.target.src;
    console.log(`Error cargando imagen: ${imageUrl}`);

    // Marcar esta imagen como fallida
    if (producto?.id) {
      this.failedImages.add(producto.id.toString());
    }

    // Usar una imagen placeholder en base64 o SVG de public
    const placeholderImage = '/no-image.svg';
    
    // Si no ha fallado antes, usar el placeholder
    if (!imageUrl.includes('no-image.svg') && !imageUrl.includes('data:image/svg+xml')) {
      event.target.src = placeholderImage;
    } else {
      // Si también falla el placeholder, usar base64
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwTTEwMCA4MEgxMjBWMTIwSDgwVjEwMEgxMDBaTTEwMCAxMDBMMTIwIDEyMEw4MCA4MEwxMDAgMTAwWiIgZmlsbD0iIzk5OTk5OSIvPgo8dGV4dCB4PSIxMDAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
    }
  }

  shouldShowPlaceholder(producto: Producto): boolean {
    return producto.id ? this.failedImages.has(producto.id.toString()) : false;
  }

  getStockClass(cantidad: number): string {
    if (cantidad <= 5) return 'stock-critico';
    if (cantidad <= 15) return 'stock-bajo';
    if (cantidad <= 50) return 'stock-medio';
    return 'stock-alto';
  }

  getStockIcon(cantidad: number): string {
    if (cantidad <= 5) return 'error';
    if (cantidad <= 15) return 'warning';
    return 'check_circle';
  }

  getProductosActivos(): number {
    return this.dataSource.data.filter(p => p.estado).length;
  }

  getStockBajo(): number {
    return this.dataSource.data.filter(p => (p.cantidad || 0) <= 10).length;
  }
}
