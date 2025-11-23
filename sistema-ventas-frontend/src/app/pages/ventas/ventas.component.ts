import {Component, NgIterable, OnInit} from '@angular/core';
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {Cliente} from "../../modelo/Cliente";
import {ClienteService} from "../../services/cliente.service";
import {MatDialog} from "@angular/material/dialog";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {Categoria} from "../../modelo/Categoria";
import {Producto} from "../../modelo/Producto";
import {ProductoService} from "../../services/producto.service";
import {CategoriaService} from "../../services/categoria.service";
import {DetalleVenta} from "../../modelo/DetalleVenta";
import {VentaService} from "../../services/venta.service";
import {CanastaService} from "../../services/canasta.service";
import {ItemCanasta} from "../../modelo/ItemCanasta";
import {Venta} from "../../modelo/Venta";

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    MatIconModule,

    FormsModule,

    NgIf,

    NgForOf,

    DecimalPipe,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
// reemplaza tu VentasComponent por este
export class VentasComponent implements OnInit {
  dniCliente: string = '';
  clienteEncontrado: Cliente | null = null;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: Categoria | null = null;
  items: ItemCanasta[] = [];
  total: number = 0;
  metodoPago: number = 0;
  menuCategoriasAbierto = false;



  constructor(private clienteService: ClienteService,
              private productoService: ProductoService,
              private categoriaService: CategoriaService,
              private canastaService: CanastaService,
              private ventaService: VentaService) {}

  ngOnInit(): void {
    this.listarCategorias();
    this.listarProductos();
    this.canastaService.items$.subscribe((data) => {
      this.items = data;
    });

    this.canastaService.getTotal().subscribe((total) => {
      this.total = total;
    });
  }
  buscarCliente(): void {
    if (!this.dniCliente.trim()) {
      alert('Ingrese un DNI válido.');
      return;
    }

    this.clienteService.obtenerPorDni(this.dniCliente).subscribe({
      next: (cliente) => {
        this.clienteEncontrado = cliente;
      },
      error: () => {
        alert('Cliente no encontrado.');
        this.clienteEncontrado = null;
      }
    });
  }

  listarProductos(): void {
    this.productoService.listar().subscribe((data) => {
      this.productos = data;
      this.filtrarProductos(); // mostrar todos al inicio
    });
  }

  listarCategorias(): void {
    this.categoriaService.listar().subscribe((data) => {
      this.categorias = data;
    });
  }

  filtrarProductos(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(termino) || p.codigo.toLowerCase().includes(termino);
      const coincideCategoria = !this.categoriaSeleccionada || p.categoria.id === this.categoriaSeleccionada.id;
      return coincideTexto && coincideCategoria;
    });
  }

  filtrarPorCategoria(categoria: Categoria | null): void {
    this.categoriaSeleccionada = categoria;
    this.filtrarProductos();
    this.menuCategoriasAbierto = false; // 👈 cerrar menú
  }


  agregarACanasta(producto: Producto): void {
    if (producto.cantidad <= 0) {
      alert('Este producto no tiene stock disponible.');
      return;
    }
    this.canastaService.agregar(producto);
    producto.cantidad--;
  }



  seleccionarMetodoPago(id: number) {
    this.metodoPago = id;
  }

  aumentarCantidad(producto: Producto) {
    const itemEnCanasta = this.items.find(i => i.producto.id === producto.id);
    const cantidadActual = itemEnCanasta?.cantidad || 0;

    if (cantidadActual >= producto.cantidad) {
      alert('No puedes agregar más de la cantidad disponible en stock');
      return;
    }

    this.canastaService.agregar(producto);

    // 🔻 Disminuye visualmente el stock
    const prodVisual = this.productosFiltrados.find(p => p.id === producto.id);
    if (prodVisual) prodVisual.cantidad--;
  }



  disminuirCantidad(producto: Producto) {
    this.canastaService.quitar(producto);
    // 🔺 Aumenta visualmente el stock
    const prodVisual = this.productosFiltrados.find(p => p.id === producto.id);
    if (prodVisual) prodVisual.cantidad++;
  }

  eliminarItem(producto: Producto) {
    const item = this.items.find(i => i.producto.id === producto.id);
    const cantidadEnCanasta = item?.cantidad || 0;
    this.canastaService.eliminar(producto);
    // 🔺 Aumenta stock visual según lo que había en la canasta
    const prodVisual = this.productosFiltrados.find(p => p.id === producto.id);
    if (prodVisual) prodVisual.cantidad += cantidadEnCanasta;
  }

  registrarVenta() {
    if (!this.clienteEncontrado) {
      alert('Debe seleccionar un cliente');
      return;
    }

    if (this.metodoPago === 0) {
      alert('Debe seleccionar un método de pago');
      return;
    }

    if (this.items.length === 0) {
      alert('Debe agregar al menos un producto a la canasta');
      return;
    }

    const detalle: DetalleVenta[] = this.items.map((item) => ({
      productoId: item.producto.id!, // ¡Aquí el cambio!
      cantidad: item.cantidad,
      nombreProducto: item.producto.nombre,
      precioUnitario: item.producto.precioVenta
    }));


    const venta: Venta = {
      clienteId: this.clienteEncontrado.id,
      formapagoId: this.metodoPago,
      detalle
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next: () => {
        alert('Venta registrada con éxito');
        this.canastaService.vaciar();
        this.metodoPago = 0;
        this.listarProductos();
        this.clienteEncontrado = null;
        this.dniCliente= '';

      },
      error: () => alert('Error al registrar la venta')
    });
  }

  imagenError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    // Usar imagen placeholder desde public
    const placeholderImage = '/no-image.svg';
    if (!imgElement.src.includes('no-image.svg')) {
      imgElement.src = placeholderImage;
    }
  }

  /**
   * Obtiene la URL completa de una imagen usando el servicio
   */
  getImagenUrl(nombreImagen?: string): string {
    return this.productoService.getImagenUrl(nombreImagen);
  }

  /**
   * Obtiene la URL de una imagen o una imagen por defecto
   */
  getImagenUrlOrDefault(nombreImagen?: string): string {
    return this.productoService.getImagenUrlOrDefault(nombreImagen);
  }


}
