import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CurrencyPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { Compra } from '../../modelo/Compra';
import { ListaComprasService } from '../../services/lista-compras.service';

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    jsPDF: any;
    jspdf: any;
  }
}

// Declarar jsPDF para uso directo
declare const jsPDF: any;

@Component({
  selector: 'app-lista-compras',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatPaginatorModule,
    CurrencyPipe,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './lista-compras.component.html',
  styleUrl: './lista-compras.component.css'
})
export class ListaComprasComponent implements OnInit {
  compras: Compra[] = [];
  comprasFiltradas: Compra[] = [];
  
  // Filtros
  busquedaSerie: string = '';
  busquedaNumero: string = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  // Configuración de la tabla
  displayedColumns: string[] = ['serie', 'numero', 'fechaCompra', 'proveedor', 'productos', 'total', 'acciones'];

  constructor(
    private listaComprasService: ListaComprasService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.verificarjsPDF();
    this.cargarCompras();
  }

  /**
   * Verifica que jsPDF esté disponible al cargar el componente
   */
  private verificarjsPDF(): void {
    setTimeout(() => {
      // Intentar acceder a jsPDF de diferentes formas
      const jsPDFClass = window.jsPDF || 
                        (window as any).jspdf?.jsPDF || 
                        (window as any).jsPDF ||
                        (globalThis as any).jsPDF;
      
      if (jsPDFClass && typeof jsPDFClass === 'function') {
        console.log('✅ jsPDF disponible para generar PDFs');
      } else {
        console.warn('⚠️ jsPDF no detectado. Funciones PDF pueden fallar.');
        console.log('Estado de jsPDF:', {
          windowjsPDF: typeof window.jsPDF,
          jspdfProperty: typeof (window as any).jspdf,
          globalThis: typeof (globalThis as any).jsPDF,
          documentScripts: document.querySelectorAll('script[src*="jspdf"]').length
        });
      }
    }, 1500); // Esperar 1.5 segundos para que se carguen los scripts
  }

  cargarCompras(): void {
    this.listaComprasService.listarCompras().subscribe({
      next: (compras) => {
        this.compras = compras;
        this.comprasFiltradas = [...compras];
      },
      error: (error) => {
        console.error('Error al cargar compras:', error);
      }
    });
  }

  buscarPorSerie(): void {
    if (!this.busquedaSerie.trim()) {
      this.comprasFiltradas = [...this.compras];
      return;
    }

    this.listaComprasService.buscarPorSerie(this.busquedaSerie).subscribe({
      next: (compras) => {
        this.comprasFiltradas = compras;
      },
      error: (error) => {
        console.error('Error al buscar por serie:', error);
        this.comprasFiltradas = [];
      }
    });
  }

  buscarPorNumero(): void {
    if (!this.busquedaNumero.trim()) {
      this.comprasFiltradas = [...this.compras];
      return;
    }

    this.listaComprasService.buscarPorNumero(this.busquedaNumero).subscribe({
      next: (compras) => {
        this.comprasFiltradas = compras;
      },
      error: (error) => {
        console.error('Error al buscar por número:', error);
        this.comprasFiltradas = [];
      }
    });
  }

  buscarPorFechas(): void {
    if (!this.fechaInicio || !this.fechaFin) {
      alert('Debe seleccionar ambas fechas para buscar.');
      return;
    }

    const fechaInicioStr = this.fechaInicio.toISOString();
    const fechaFinStr = this.fechaFin.toISOString();

    this.listaComprasService.buscarPorFechas(fechaInicioStr, fechaFinStr).subscribe({
      next: (compras) => {
        this.comprasFiltradas = compras;
      },
      error: (error) => {
        console.error('Error al buscar por fechas:', error);
        this.comprasFiltradas = [];
      }
    });
  }

  limpiarFiltros(): void {
    this.busquedaSerie = '';
    this.busquedaNumero = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.comprasFiltradas = [...this.compras];
  }

  verDetalle(compra: Compra): void {
    // Crear un resumen detallado de la compra
    const productosDetalle = compra.detalle?.map((item, index) => 
      `${index + 1}. ${item.producto?.nombre || 'Producto'} \n   ➢ Cantidad: ${item.cantidad} unidades \n   ➢ Precio: S/ ${(item.precio || 0).toFixed(2)} c/u \n   ➢ Subtotal: S/ ${((item.precio || 0) * (item.cantidad || 0)).toFixed(2)}`
    ).join('\n\n') || 'No hay productos';
    
    const totalUnidades = this.getTotalProductos(compra);
    const totalProductosUnicos = compra.detalle?.length || 0;
    
    const detalleCompleto = `
📋 DETALLE COMPLETO DE COMPRA
🏷️ ${compra.serie}-${compra.numero}

` +
      `🏢 PROVEEDOR: ${compra.proveedor?.nombre || 'N/A'}\n` +
      `📅 FECHA: ${new Date(compra.fechaCompra || '').toLocaleDateString()} a las ${new Date(compra.fechaCompra || '').toLocaleTimeString()}\n` +
      `📋 DESCRIPCIÓN: ${compra.descripcion || 'Sin descripción'}\n\n` +
      `📦 RESUMEN DE PRODUCTOS:\n` +
      `   • ${totalProductosUnicos} producto(s) diferente(s)\n` +
      `   • ${totalUnidades} unidad(es) en total\n\n` +
      `📋 DETALLE POR PRODUCTO:\n${productosDetalle}\n\n` +
      `💰 RESUMEN FINANCIERO:\n` +
      `   • Base Imponible: S/ ${(compra.baseImponible || 0).toFixed(2)}\n` +
      `   • IGV (18%): S/ ${(compra.igv || 0).toFixed(2)}\n` +
      `   • TOTAL: S/ ${(compra.total || 0).toFixed(2)}`;
    
    alert(detalleCompleto);
  }

  eliminarCompra(compra: Compra): void {
    if (confirm(`¿Está seguro de eliminar la compra ${compra.serie}-${compra.numero}?`)) {
      this.listaComprasService.eliminarCompra(compra.id!).subscribe({
        next: () => {
          alert('Compra eliminada exitosamente');
          this.cargarCompras();
        },
        error: (error) => {
          console.error('Error al eliminar compra:', error);
          alert('Error al eliminar la compra');
        }
      });
    }
  }

  /**
   * Genera una factura en PDF con diseño profesional
   */
  generarFacturaPDF(compra: Compra): void {
    // Verificar múltiples formas de acceso a jsPDF
    const jsPDFClass = window.jsPDF || 
                      (window as any).jspdf?.jsPDF || 
                      (globalThis as any).jsPDF ||
                      jsPDF;
    
    if (!jsPDFClass || typeof jsPDFClass === 'undefined') {
      console.error('jsPDF no está disponible. Estado:', {
        windowjsPDF: typeof window.jsPDF,
        globaljsPDF: typeof jsPDF,
        jsPDFAvailable: (window as any).jsPDFAvailable
      });
      
      alert('Error: No se pudo cargar la librería PDF.\n\n' +
            'Soluciones:\n' +
            '1. Recargue la página (F5)\n' +
            '2. Verifique su conexión a internet\n' +
            '3. Desactive bloqueadores de contenido');
      return;
    }
    
    console.log('✅ jsPDF detectado correctamente');

    try {
      const doc = new jsPDFClass();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 25;

      // === COLORES CORPORATIVOS ===
      const azulPrimario = [33, 150, 243];
      const azulSecundario = [21, 101, 192];
      const grisTexto = [97, 97, 97];
      const verdeTotal = [76, 175, 80];
      const rojoAlerta = [244, 67, 54];

      // === HEADER CORPORATIVO ===
      doc.setFillColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Logo área (simulado)
      doc.setFillColor(255, 255, 255);
      doc.rect(15, 8, 30, 30, 'F');
      doc.setTextColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('JEA', 30, 28);
      
      // Información de la empresa
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.setFont('helvetica', 'bold');
      doc.text('SISTEMA DE COMPRAS JEA', 55, 25);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('RUC: 20123456789 | Tel: (01) 123-4567 | Email: ventas@jea.com', 55, 33);
      doc.text('Av. Tecnológica 123, Lima - Perú | www.jea.com', 55, 39);
      
      yPosition = 60;

      // === INFORMACIÓN DE LA FACTURA ===
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPosition, pageWidth - 30, 25, 'F');
      
      doc.setTextColor(azulSecundario[0], azulSecundario[1], azulSecundario[2]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('ORDEN DE COMPRA', 20, yPosition + 8);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${compra.serie}-${compra.numero}`, 20, yPosition + 18);
      
      // Fecha y hora en el lado derecho
      const fechaFormateada = new Date(compra.fechaCompra || '').toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
      const horaFormateada = new Date(compra.fechaCompra || '').toLocaleTimeString('es-PE');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${fechaFormateada}`, pageWidth - 80, yPosition + 8);
      doc.text(`Hora: ${horaFormateada}`, pageWidth - 80, yPosition + 15);
      
      yPosition += 35;

      // === INFORMACIÓN DEL PROVEEDOR ===
      doc.setFillColor(250, 250, 250);
      doc.rect(15, yPosition, pageWidth - 30, 35, 'F');
      
      doc.setTextColor(azulSecundario[0], azulSecundario[1], azulSecundario[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL PROVEEDOR', 20, yPosition + 10);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${compra.proveedor?.nombre || 'PROVEEDOR NO ESPECIFICADO'}`, 20, yPosition + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`RUC: ${compra.proveedor?.ruc || 'No disponible'}`, 20, yPosition + 27);
      
      if (compra.proveedor?.telefono) {
        doc.text(`Teléfono: ${compra.proveedor.telefono}`, pageWidth/2, yPosition + 20);
      }
      if (compra.proveedor?.direccion) {
        doc.text(`Dirección: ${compra.proveedor.direccion}`, pageWidth/2, yPosition + 27);
      }
      if (compra.proveedor?.correo) {
        doc.text(`Email: ${compra.proveedor.correo}`, pageWidth/2 + 60, yPosition + 20);
      }
      
      yPosition += 45;

      // === DESCRIPCIÓN DE LA COMPRA ===
      if (compra.descripcion) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        doc.text(`Observaciones: ${compra.descripcion}`, 20, yPosition);
        yPosition += 15;
      }

      // === TABLA DE PRODUCTOS ===
      yPosition += 5;
      
      // Header de la tabla
      doc.setFillColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.rect(15, yPosition, pageWidth - 30, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      
      const colPositions = [20, 35, 110, 135, 155, 175];
      const headers = ['#', 'PRODUCTO', 'CANT.', 'P.UNIT.', 'TOTAL'];
      
      headers.forEach((header, index) => {
        doc.text(header, colPositions[index], yPosition + 8);
      });
      
      yPosition += 15;

      // === CONTENIDO DE LA TABLA ===
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      let totalGeneral = 0;
      let contadorProductos = 0;
      
      compra.detalle?.forEach((item, index) => {
        // Control de página
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 30;
          
          // Repetir header en nueva página
          doc.setFillColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
          doc.rect(15, yPosition, pageWidth - 30, 12, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          
          headers.forEach((header, idx) => {
            doc.text(header, colPositions[idx], yPosition + 8);
          });
          
          yPosition += 15;
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }
        
        const producto = item.producto?.nombre || 'Producto sin nombre';
        const codigo = item.producto?.codigo ? ` (${item.producto.codigo})` : '';
        const cantidad = item.cantidad || 0;
        const precio = item.precio || 0;
        const subtotal = cantidad * precio;
        
        totalGeneral += subtotal;
        contadorProductos += cantidad;
        
        // Fila alternada
        if (index % 2 === 0) {
          doc.setFillColor(252, 252, 252);
          doc.rect(15, yPosition - 3, pageWidth - 30, 10, 'F');
        }
        
        // Contenido de la fila
        doc.text((index + 1).toString(), colPositions[0], yPosition + 3);
        
        // Producto con truncado inteligente
        let nombreCompleto = producto + codigo;
        if (nombreCompleto.length > 32) {
          nombreCompleto = nombreCompleto.substring(0, 29) + '...';
        }
        doc.text(nombreCompleto, colPositions[1], yPosition + 3);
        
        doc.text(cantidad.toString(), colPositions[2], yPosition + 3);
        doc.text(`S/ ${precio.toFixed(2)}`, colPositions[3], yPosition + 3);
        doc.text(`S/ ${subtotal.toFixed(2)}`, colPositions[4], yPosition + 3);
        
        yPosition += 10;
      });
      
      // === RESUMEN DE TOTALES ===
      yPosition += 10;
      
      // Línea separadora
      doc.setDrawColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.setLineWidth(1);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      
      yPosition += 15;
      
      // Caja de totales
      const totalBoxWidth = 85;
      const totalBoxX = pageWidth - totalBoxWidth - 15;
      
      doc.setFillColor(248, 249, 250);
      doc.rect(totalBoxX, yPosition, totalBoxWidth, 35, 'F');
      
      doc.setDrawColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.setLineWidth(0.5);
      doc.rect(totalBoxX, yPosition, totalBoxWidth, 35, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      doc.text('Base Imponible:', totalBoxX + 5, yPosition + 8);
      doc.text(`S/ ${(compra.baseImponible || 0).toFixed(2)}`, totalBoxX + 55, yPosition + 8);
      
      doc.text('IGV (18%):', totalBoxX + 5, yPosition + 16);
      doc.text(`S/ ${(compra.igv || 0).toFixed(2)}`, totalBoxX + 55, yPosition + 16);
      
      // Total destacado
      doc.setFillColor(verdeTotal[0], verdeTotal[1], verdeTotal[2]);
      doc.rect(totalBoxX, yPosition + 20, totalBoxWidth, 12, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', totalBoxX + 5, yPosition + 28);
      doc.text(`S/ ${(compra.total || 0).toFixed(2)}`, totalBoxX + 45, yPosition + 28);
      
      // === RESUMEN ESTADÍSTICO ===
      yPosition += 45;
      
      doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const estadisticas = [
        `Productos diferentes: ${compra.detalle?.length || 0}`,
        `Total de unidades: ${contadorProductos}`,
        `Promedio por producto: S/ ${compra.detalle?.length ? (totalGeneral / compra.detalle.length).toFixed(2) : '0.00'}`
      ];
      
      estadisticas.forEach((stat, index) => {
        doc.text(stat, 20 + (index * 60), yPosition);
      });
      
      // === FOOTER PROFESIONAL ===
      yPosition = pageHeight - 25;
      
      doc.setFillColor(245, 245, 245);
      doc.rect(0, yPosition - 5, pageWidth, 25, 'F');
      
      doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Este documento fue generado automáticamente por el Sistema JEA', pageWidth / 2, yPosition + 5, { align: 'center' });
      doc.text(`Generado el: ${new Date().toLocaleString('es-PE')} | Página 1 de 1`, pageWidth / 2, yPosition + 12, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(azulPrimario[0], azulPrimario[1], azulPrimario[2]);
      doc.setLineWidth(2);
      doc.line(20, yPosition - 2, pageWidth - 20, yPosition - 2);

      // === GUARDAR PDF ===
      const fileName = `Factura_Compra_${compra.serie}_${compra.numero}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      // Mostrar mensaje de éxito
      this.mostrarMensajeExito('PDF generado exitosamente');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Verifique los datos e intente nuevamente.');
    }
  }

  /**
   * Genera un reporte consolidado de múltiples compras
   */
  generarReporteConsolidado(): void {
    if (this.comprasFiltradas.length === 0) {
      alert('No hay compras para generar el reporte.');
      return;
    }

    // Verificar disponibilidad de jsPDF
    const jsPDFClass = window.jsPDF || 
                      (window as any).jspdf?.jsPDF || 
                      (globalThis as any).jsPDF ||
                      jsPDF;
    
    if (!jsPDFClass || typeof jsPDFClass === 'undefined') {
      alert('Error: No se pudo cargar la librería PDF.');
      return;
    }

    try {
      const doc = new jsPDFClass();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header del reporte
      doc.setFillColor(33, 150, 243);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE CONSOLIDADO DE COMPRAS', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Período consultado: ${this.obtenerPeriodoFiltrado()}`, pageWidth / 2, 28, { align: 'center' });
      
      yPosition = 50;

      // Estadísticas generales
      const totalCompras = this.comprasFiltradas.length;
      const montoTotal = this.totalCompras;
      const promedioCompra = totalCompras > 0 ? montoTotal / totalCompras : 0;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMEN EJECUTIVO', 20, yPosition);
      
      yPosition += 15;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de compras: ${totalCompras}`, 20, yPosition);
      doc.text(`Monto total: S/ ${montoTotal.toFixed(2)}`, 20, yPosition + 7);
      doc.text(`Promedio por compra: S/ ${promedioCompra.toFixed(2)}`, 20, yPosition + 14);
      
      yPosition += 30;

      // Lista de compras
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('DETALLE DE COMPRAS', 20, yPosition);
      
      yPosition += 10;

      this.comprasFiltradas.forEach((compra, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${compra.serie}-${compra.numero}`, 20, yPosition);
        
        doc.setFont('helvetica', 'normal');
        doc.text(`Proveedor: ${compra.proveedor?.nombre || 'N/A'}`, 30, yPosition + 7);
        doc.text(`Fecha: ${new Date(compra.fechaCompra || '').toLocaleDateString()}`, 30, yPosition + 14);
        doc.text(`Total: S/ ${(compra.total || 0).toFixed(2)}`, 30, yPosition + 21);
        
        yPosition += 30;
      });

      // Guardar
      const fileName = `Reporte_Compras_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      this.mostrarMensajeExito('Reporte consolidado generado exitosamente');
      
    } catch (error) {
      console.error('Error generando reporte:', error);
      alert('Error al generar el reporte.');
    }
  }

  exportarCompras(): void {
    this.generarReporteConsolidado();
  }

  private obtenerPeriodoFiltrado(): string {
    if (this.fechaInicio && this.fechaFin) {
      return `${this.fechaInicio.toLocaleDateString()} - ${this.fechaFin.toLocaleDateString()}`;
    }
    return 'Todas las fechas';
  }

  private mostrarMensajeExito(mensaje: string): void {
    // Puedes reemplazar esto con un toast o snackbar más elegante
    alert(mensaje);
  }

  get totalCompras(): number {
    return this.comprasFiltradas.reduce((total, compra) => total + (compra.total || 0), 0);
  }

  // Métodos para mostrar productos
  getProductosResumen(compra: Compra): string {
    if (!compra.detalle || compra.detalle.length === 0) {
      return 'Sin productos';
    }
    
    const totalProductos = compra.detalle.length;
    const primerProducto = compra.detalle[0].producto?.nombre || 'Producto';
    
    if (totalProductos === 1) {
      return primerProducto;
    } else {
      return `${primerProducto} y ${totalProductos - 1} más`;
    }
  }

  getTotalProductos(compra: Compra): number {
    return compra.detalle?.reduce((total, item) => total + (item.cantidad || 0), 0) || 0;
  }

  getTotalProductosGeneral(): number {
    const productosUnicos = new Set<number>();
    this.comprasFiltradas.forEach(compra => {
      compra.detalle?.forEach(detalle => {
        if (detalle.productoId) {
          productosUnicos.add(detalle.productoId);
        }
      });
    });
    return productosUnicos.size;
  }
}
