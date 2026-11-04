import { Routes } from '@angular/router';
import { HomeComponent } from './components/VistaUsuario/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Sin Fronteras Cochabamba' },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
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
    loadComponent: () => import('./components/VistaAdmin/servicios/admin-servicios.component').then(m => m.AdminServiciosComponent),
    title: 'Administración (demo) | Sin Fronteras'
  },
  { path: '**', redirectTo: '' }
];
