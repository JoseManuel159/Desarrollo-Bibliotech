import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  ventasLabels: string[] = [];
  ventasData: number[] = [];

  totalVentas: number = 0;


  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.ventasLabels,
    datasets: [
      { data: this.ventasData, label: 'Ventas por mes', backgroundColor: '#3f51b5' }
    ]
  };

  barChartType: ChartType = 'bar';


  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '📊 Productos Más Vendidos'
      }
    }
  };

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    this.ventaService.obtenerTop10ProductosVendidos().subscribe({
      next: (data) => {
        this.pieChartLabels = data.map(item => item.nombreProducto);
        this.pieChartData = data.map(item => item.cantidadVendida);
      },
      error: () => {
        console.error('Error al obtener los productos más vendidos');
      }
    });

    this.ventaService.obtenerVentasPorMes().subscribe(data => {
      this.ventasLabels = data.map(d => d.mes);
      this.ventasData = data.map(d => d.total);

      // Actualiza el gráfico
      this.barChartData = {
        labels: this.ventasLabels,
        datasets: [
          {
            data: this.ventasData,
            label: 'Ventas por mes',
            backgroundColor: '#3f51b5'
          }
        ]
      };
    });

    this.ventaService.obtenerTotalVentas().subscribe({
      next: (total) => {
        this.totalVentas = total;
      },
      error: () => {
        console.error("Error al obtener el total de ventas");
      }
    });

  }

}
