import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { DirectorioService, Servicio } from '../../../services/directorio.service';

@Component({
  standalone: true,
  selector: 'app-detalle-servicio',
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.scss']
})
export class DetalleServicioComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly directorio = inject(DirectorioService);
  readonly item: Servicio | undefined = this.directorio.byId(this.route.snapshot.paramMap.get('id') ?? '');
  get externalWeb(): string | null {
    const url = this.item?.sitioWeb?.trim() ?? '';
    return /^https?:\/\//i.test(url) ? url : null;
  }
  get externalLsb(): string | null {
    const url = this.item?.recursoLSB?.trim() ?? '';
    return /^https?:\/\//i.test(url) ? url : null;
  }
}
