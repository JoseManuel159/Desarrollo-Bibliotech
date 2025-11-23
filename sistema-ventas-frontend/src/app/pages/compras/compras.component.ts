import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { DecimalPipe, NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDialog } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { CurrencyPipe } from "@angular/common";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDividerModule } from "@angular/material/divider";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";

import { Proveedor } from "../../modelo/Proveedor";
import { Producto } from "../../modelo/Producto";
import { Categoria } from "../../modelo/Categoria";
import { CompraDetalle } from "../../modelo/CompraDetalle";

import { ProveedorService } from "../../services/proveedor.service";
import { ProductoService } from "../../services/producto.service";
import { CategoriaService } from "../../services/categoria.service";
import { CanastaComprasService } from "../../services/canasta-compras.service";
import { ComprasService } from "../../services/compras.service";

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    NgIf,
    NgForOf,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    CurrencyPipe,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {
  // Proveedor
  tipoBusquedaProveedor: string = 'ruc';
  rucProveedor: string = '';
  proveedorSeleccionado: Proveedor | null = null;
  proveedoresLista: Proveedor[] = [];
  mostrarListaProveedores: boolean = false;

  // Productos
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  terminoBusquedaProducto: string = '';
  categoriaSeleccionada: number | null = null;

  // Canasta
  canasta: CompraDetalle[] = [];
  metodoPago: string = 'efectivo';
  descripcion: string = '';

  // Para seleccionar producto actual
  productoSeleccionado: Producto | null = null;
  cantidadCompra: number = 1;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private canastaComprasService: CanastaComprasService,
    private comprasService: ComprasService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.actualizarCanasta();
  }

  // === MÉTODOS DE PROVEEDOR ===
  buscarProveedorPorRuc(): void {
    if (!this.rucProveedor.trim()) {
      alert('Ingrese un RUC válido');
      return;
    }

    this.proveedorService.buscarPorRuc(this.rucProveedor).subscribe({
      next: (proveedor) => {
        this.proveedorSeleccionado = proveedor;
        this.mostrarListaProveedores = false;
      },
      error: () => {
        alert('Proveedor no encontrado con ese RUC');
        this.proveedorSeleccionado = null;
      }
    });
  }

  mostrarTodosLosProveedores(): void {
    this.proveedorService.listar().subscribe({
      next: (proveedores) => {
        this.proveedoresLista = proveedores.filter(p => p.estado !== false);
        this.mostrarListaProveedores = true;
      },
      error: () => {
        alert('Error al cargar la lista de proveedores');
      }
    });
  }

  seleccionarProveedor(proveedor: Proveedor): void {
    this.proveedorSeleccionado = proveedor;
    this.mostrarListaProveedores = false;
    this.rucProveedor = proveedor.ruc;
  }

  limpiarProveedorSeleccionado(): void {
    this.proveedorSeleccionado = null;
    this.rucProveedor = '';
    this.mostrarListaProveedores = false;
  }

  // === MÉTODOS DE PRODUCTOS ===
  cargarProductos(): void {
    this.productoService.listar().subscribe(productos => {
      this.productos = productos.filter(p => p.estado !== false);
      this.aplicarFiltros();
    });
  }

  cargarCategorias(): void {
    console.log('Cargando categorías...');
    this.categoriaService.listar().subscribe({
      next: (categorias) => {
        console.log('Categorías recibidas:', categorias);
        // Filtrar solo categorías activas
        this.categorias = categorias.filter(cat => cat.estado !== false);
        console.log('Categorías filtradas (activas):', this.categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        alert('Error al cargar categorías. Verifique su conexión.');
      }
    });
  }

  aplicarFiltros(): void {
    let productosFiltrados = [...this.productos];

    // Filtro por término de búsqueda
    if (this.terminoBusquedaProducto.trim()) {
      const termino = this.terminoBusquedaProducto.toLowerCase();
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.codigo.toLowerCase().includes(termino) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(termino))
      );
    }

    // Filtro por categoría
    if (this.categoriaSeleccionada) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.categoria && p.categoria.id === this.categoriaSeleccionada
      );
    }

    this.productosFiltrados = productosFiltrados;
  }

  limpiarFiltrosProductos(): void {
    this.terminoBusquedaProducto = '';
    this.categoriaSeleccionada = null;
    this.aplicarFiltros();
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.cantidadCompra = 1;
  }

  // === MÉTODOS DE CANASTA ===
  actualizarCanasta(): void {
    this.canasta = this.canastaComprasService.getCanasta();
  }

  agregarACanasta(): void {
    if (!this.productoSeleccionado || this.productoSeleccionado.id == null) {
      alert('Debe seleccionar un producto');
      return;
    }

    if (this.cantidadCompra <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    // Usar el costoCompra del producto como precio, o un valor por defecto
    const precioCompra = this.productoSeleccionado.costoCompra || this.productoSeleccionado.precioVenta || 0;

    if (precioCompra <= 0) {
      alert('El producto no tiene un precio de compra válido. Contacte al administrador.');
      return;
    }

    this.canastaComprasService.agregarProducto({
      productoId: this.productoSeleccionado.id,
      cantidad: this.cantidadCompra,
      precio: precioCompra,
      producto: this.productoSeleccionado
    });

    this.actualizarCanasta();

    // Resetear selección
    this.productoSeleccionado = null;
    this.cantidadCompra = 1;

    alert('Producto agregado al carrito');
  }

  eliminarItem(item: CompraDetalle): void {
    this.canastaComprasService.eliminarProducto(item.productoId);
    this.actualizarCanasta();
  }

  actualizarCantidad(item: CompraDetalle, event: Event): void {
    const target = event.target as HTMLInputElement;
    const cantidad = parseFloat(target.value);
    if (cantidad > 0) {
      this.canastaComprasService.actualizarCantidad(item.productoId, cantidad);
      this.actualizarCanasta();
    }
  }

  actualizarPrecio(item: CompraDetalle, event: Event): void {
    const target = event.target as HTMLInputElement;
    const precio = parseFloat(target.value);
    if (precio > 0) {
      this.canastaComprasService.actualizarPrecio(item.productoId, precio);
      this.actualizarCanasta();
    }
  }

  // === GETTERS ===
  get totalPagar(): number {
    return this.canastaComprasService.getTotal();
  }

  get baseImponible(): number {
    return this.canastaComprasService.getBaseImponible();
  }

  get igv(): number {
    return this.canastaComprasService.getIgv();
  }

  get totalItems(): number {
    return this.canasta.reduce((total, item) => total + item.cantidad, 0);
  }

  // === GENERAR COMPRA ===
  generarCompra(): void {
    if (!this.proveedorSeleccionado) {
      alert("Debe seleccionar un proveedor para continuar.");
      return;
    }

    if (this.canasta.length === 0) {
      alert("No hay productos en la canasta.");
      return;
    }

    const detalle = this.canasta.map(item => ({
      productoId: item.productoId,
      cantidad: item.cantidad,
      precio: item.precio
    }));

    const formapagoId = this.metodoPago === 'yape' ? 2 : 1;

    const compra = {
      proveedorId: this.proveedorSeleccionado.id!,
      detalle: detalle,
      formapagoId: formapagoId,
      descripcion: this.descripcion
    };

    this.comprasService.crear(compra).subscribe({
      next: () => {
        alert('¡Compra registrada exitosamente!');
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar la compra. Intente nuevamente.');
      }
    });
  }

  limpiarFormulario(): void {
    this.canastaComprasService.vaciarCanasta();
    this.actualizarCanasta();
    this.limpiarProveedorSeleccionado();
    this.descripcion = '';
    this.metodoPago = 'efectivo';
    this.limpiarFiltrosProductos();
    this.productoSeleccionado = null;
    this.cantidadCompra = 1;
  }

  // === MÉTODOS PARA IMÁGENES ===
  getImagenUrl(nombreImagen?: string): string {
    return this.productoService.getImagenUrl(nombreImagen);
  }

  getImagenUrlOrDefault(nombreImagen?: string): string {
    return this.productoService.getImagenUrlOrDefault(nombreImagen);
  }

  onImageError(event: any): void {
    // Si falla la imagen del servidor, usar imagen placeholder desde public
    const placeholderImage = '/no-image.svg';
    if (!event.target.src.includes('no-image.svg')) {
      event.target.src = placeholderImage;
    }
  }
}
