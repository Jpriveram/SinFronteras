import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { DirectorioService, Categoria, Servicio } from '../../../services/directorio.service';

@Component({
  standalone: true,
  selector: 'app-catalogo',
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss']
})
export class CatalogoComponent {
  private readonly directory = inject(DirectorioService);
  query = '';
  selectedCategory = 'Todas';
  readonly categories: Categoria[] = ['Salud y rehabilitación', 'Orientación y derechos', 'Educación y comunicación', 'Apoyo e inclusión'];
  get filtered(): Servicio[] {
    const search = this.query.trim().toLocaleLowerCase('es-BO');
    return this.directory.getAll().filter(item => {
      const matchCategory = this.selectedCategory === 'Todas' || item.categoria === this.selectedCategory;
      const text = `${item.nombre} ${item.institucion} ${item.categoria} ${item.descripcion}`.toLocaleLowerCase('es-BO');
      return matchCategory && (!search || text.includes(search));
    });
  }
  clear(): void { this.query = ''; this.selectedCategory = 'Todas'; }
}
