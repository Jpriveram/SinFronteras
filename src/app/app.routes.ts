import { Routes } from '@angular/router';
import { HomeComponent } from './components/VistaUsuario/home/home.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Sin Fronteras Cochabamba' },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/VistaAdmin/login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Acceso administrativo | Sin Fronteras'
  },
  {
    path: 'servicios',
    loadComponent: () => import('./components/VistaUsuario/catalogo/catalogo.component').then(m => m.CatalogoComponent),
    title: 'Directorio de servicios | Sin Fronteras'
  },
  {
    path: 'servicios/:id',
    loadComponent: () => import('./components/VistaUsuario/detalle-servicio/detalle-servicio.component').then(m => m.DetalleServicioComponent),
    title: 'Ficha de servicio | Sin Fronteras'
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./components/VistaAdmin/servicios/admin-servicios.component').then(m => m.AdminServiciosComponent),
    title: 'Administración | Sin Fronteras'
  },
  { path: '**', redirectTo: '' }
];
