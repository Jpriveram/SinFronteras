import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { DirectorioService, Categoria, Servicio } from '../../../services/directorio.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-admin-servicios',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './admin-servicios.component.html',
  styleUrls: ['./admin-servicios.component.scss']
})
export class AdminServiciosComponent {
  private readonly directorio = inject(DirectorioService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly categories: Categoria[] = ['Salud y rehabilitación', 'Orientación y derechos', 'Educación y comunicación', 'Apoyo e inclusión'];
  editing: Servicio = this.blank();
  editingExisting = false;
  status = '';
  get items(): Servicio[] { return this.directorio.getAll(); }
  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
  private blank(): Servicio { return { id: '', nombre: '', institucion: '', categoria: 'Salud y rehabilitación', descripcion: '', requisitos: '', horarios: '', contacto: '', ubicacion: 'Cercado, Cochabamba', sitioWeb: '', recursoLSB: '', verificado: false }; }
  newRecord(): void { this.editing = this.blank(); this.editingExisting = false; this.status = ''; }
  edit(item: Servicio): void { this.editing = { ...item }; this.editingExisting = true; this.status = ''; }
  save(): void {
    if (!this.editing.nombre.trim() || !this.editing.institucion.trim() || !this.editing.descripcion.trim()) {
      this.status = 'Completa nombre, institución y descripción.'; return;
    }
    const item: Servicio = { ...this.editing, id: this.editingExisting ? this.editing.id : 'demo-' + Date.now().toString(36), nombre: this.editing.nombre.trim(), institucion: this.editing.institucion.trim(), descripcion: this.editing.descripcion.trim() };
    this.directorio.upsert(item);
    this.newRecord();
    this.status = 'Ficha guardada en este navegador (demostración).';
  }
  remove(item: Servicio): void {
    if (!window.confirm(`¿Eliminar la ficha "${item.nombre}" de este navegador?`)) return;
    this.directorio.delete(item.id);
    if (this.editing.id === item.id) this.newRecord();
    this.status = 'Ficha eliminada de este navegador.';
  }
  reset(): void {
    if (!window.confirm('¿Restablecer los ejemplos y descartar los cambios locales?')) return;
    this.directorio.resetDemo();
    this.newRecord();
    this.status = 'Datos de demostración restaurados.';
  }
}
