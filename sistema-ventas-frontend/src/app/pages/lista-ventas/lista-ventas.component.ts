import {Component, OnInit, ViewChild} from '@angular/core';
import {VentaService} from "../../services/venta.service";
import {DatePipe, DecimalPipe, NgForOf} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatPaginator} from "@angular/material/paginator";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule, MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-lista-ventas',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    DecimalPipe,
    MatCard,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatIconButton,
    MatIcon,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTooltip,
    MatPaginator,
    MatFormField,
    FormsModule,
    MatInput,

    MatButton,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelect,
    MatOption,
    // Este incluye el adaptador

  ],
  templateUrl: './lista-ventas.component.html',
  styleUrl: './lista-ventas.component.css'
})
export class ListaVentasComponent implements OnInit {
  ventas: any[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['fecha', 'codigo', 'total', 'pdf'];
  filtroCodigo: string = '';

  // ListaVentasComponent.ts
  meses = [
    { nombre: 'Enero', valor: 0 },
    { nombre: 'Febrero', valor: 1 },
    { nombre: 'Marzo', valor: 2 },
    { nombre: 'Abril', valor: 3 },
    { nombre: 'Mayo', valor: 4 },
    { nombre: 'Junio', valor: 5 },
    { nombre: 'Julio', valor: 6 },
    { nombre: 'Agosto', valor: 7 },
    { nombre: 'Septiembre', valor: 8 },
    { nombre: 'Octubre', valor: 9 },
    { nombre: 'Noviembre', valor: 10 },
    { nombre: 'Diciembre', valor: 11 }
  ];

  anioActual = new Date().getFullYear(); // puedes permitir cambiarlo también si deseas
  mesSeleccionado: number | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.ventaService.listarVentas().subscribe({
      next: (data) => {
        const ordenadas = data.sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime());
        this.dataSource.data = ordenadas;
        this.dataSource.paginator = this.paginator;
      },
      error: () => alert('Error al cargar las ventas')
    });
  }

  cargarVentas(): void {
    this.ventaService.listarVentas().subscribe({
      next: (data) => {
        const ordenadas = data.sort((a, b) => new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime());
        this.dataSource.data = ordenadas;
        this.dataSource.paginator = this.paginator;
      },
      error: () => alert('Error al cargar las ventas')
    });
  }

  buscarPorMes(): void {
    if (this.mesSeleccionado === null) return;

    const inicio = new Date(this.anioActual, this.mesSeleccionado, 1, 0, 0, 0);
    const fin = new Date(this.anioActual, this.mesSeleccionado + 1, 0, 23, 59, 59); // día 0 del mes siguiente = último del actual

    const inicioISO = inicio.toISOString();
    const finISO = fin.toISOString();

    this.ventaService.buscarPorFechas(inicioISO, finISO).subscribe({
      next: (data) => this.dataSource.data = data,
      error: () => alert('No se encontraron ventas en ese mes')
    });
  }


  buscarCodigo(): void {
    const codigo = this.filtroCodigo.trim();

    if (!codigo) return;

    // Si es puramente numérico, buscar por número
    if (/^\d+$/.test(codigo)) {
      this.ventaService.buscarPorNumero(codigo).subscribe({
        next: (data) => this.dataSource.data = data,
        error: () => alert('No se encontraron ventas con ese número')
      });
    }
    // Si contiene letras (como "B001"), buscar por serie
    else {
      this.ventaService.buscarPorSerie(codigo).subscribe({
        next: (data) => this.dataSource.data = data,
        error: () => alert('No se encontraron ventas con esa serie')
      });
    }
  }




  async verPdf(ventaParcial: any): Promise<void> {
    const venta = await this.ventaService.obtenerVenta(ventaParcial.id).toPromise();

    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    pdfMakeModule.default.vfs = (pdfFontsModule as any).default;

    const fecha = new Date(venta.fechaVenta).toLocaleString();

    const detalleTabla = [
      [
        { text: 'Producto', bold: true, fillColor: '#eeeeee' },
        { text: 'Cantidad', bold: true, fillColor: '#eeeeee' },
        { text: 'Precio Unitario', bold: true, fillColor: '#eeeeee' },
        { text: 'Subtotal', bold: true, fillColor: '#eeeeee' }
      ],
      ...venta.detalle.map((d: any) => [
        d.producto?.nombre?.trim() || 'Producto desconocido',
        d.cantidad,
        `S/ ${d.precio.toFixed(2)}`,
        `S/ ${d.total.toFixed(2)}`
      ])
    ];

    const docDefinition = {

      content: [
        { text: 'BOLETA DE VENTA', style: 'header', alignment: 'center' },

        {
          columns: [
            {
              width: '*',
              stack: [
                { text: `Cliente: ${venta.cliente?.nombre || ''} ${venta.cliente?.apellido || ''}` },
                { text: `DNI: ${venta.cliente?.dni || ''}` },
                { text: `Fecha: ${fecha}` }
              ]
            },
            {
              width: 'auto',
              stack: [
                { text: `N° ${venta.serie}-${venta.numero}`, bold: true, fontSize: 14, alignment: 'right' },
                { text: `Método de Pago: ${venta.formaPago?.nombre || ''}`, alignment: 'right' }
              ]
            }
          ],
          margin: [0, 10, 0, 10]
        },

        { text: 'Detalle de Productos', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: detalleTabla
          }
        },

        { text: 'Resumen de Pago', style: 'subheader', margin: [0, 15, 0, 5] },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 'auto',
              table: {
                body: [
                  ['Base Imponible:', `S/ ${venta.baseImponible.toFixed(2)}`],
                  ['IGV (18%):', `S/ ${venta.igv.toFixed(2)}`],
                  [{ text: 'TOTAL:', bold: true }, { text: `S/ ${venta.total.toFixed(2)}`, bold: true }]
                ]
              },
              layout: 'lightHorizontalLines'
            }
          ]
        },

        { text: venta.descripcion || 'Gracias por su compra.', alignment: 'center', margin: [0, 30, 0, 0], italics: true }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          color: '#333'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#333'
        }
      }
    };

    pdfMakeModule.default.createPdf(docDefinition).open();
  }


}
