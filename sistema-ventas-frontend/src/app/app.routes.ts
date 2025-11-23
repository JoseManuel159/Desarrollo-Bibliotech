import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login-component/login-component.component";
import {CategoriasComponent} from "./pages/categorias/categorias.component";
import {HomeLayoutComponent} from "./pages/home/home-layout.component";
import {AuthGuard} from "./guards/auth.guard";
import {ClientesComponent} from "./pages/clientes/clientes.component";
import {VentasComponent} from "./pages/ventas/ventas.component";
import {ComprasComponent} from "./pages/compras/compras.component";
import {PedidosComponent} from "./pages/pedidos/pedidos.component";
import {UsuariosComponent} from "./pages/usuarios/usuarios.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {ListaVentasComponent} from "./pages/lista-ventas/lista-ventas.component";
import {ListaComprasComponent} from "./pages/lista-compras/lista-compras.component";
import {ProveedoresComponent} from "./pages/proveedores/proveedores.component";
import {ProductosComponent} from "./pages/productos/productos.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard], // 🔒 Protege el layout principal
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categoria', component: CategoriasComponent },
      { path: 'cliente', component: ClientesComponent },
      { path: 'producto', component: ProductosComponent },
      { path: 'venta', component: VentasComponent },
      { path: 'listaventa', component: ListaVentasComponent },
      { path: 'compra', component: ComprasComponent },
      { path: 'lista-compras', component: ListaComprasComponent },
      { path: 'usuario', component: UsuariosComponent },
      { path: 'proveedor', component: ProveedoresComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
