import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Los registros iniciales son EXCLUSIVAMENTE demostrativos. No atribuyen
// horarios, contactos ni requisitos oficiales a instituciones existentes.
export type Categoria = 'Salud y rehabilitación' | 'Orientación y derechos' | 'Educación y comunicación' | 'Apoyo e inclusión';

export interface Servicio {
  id: string;
  nombre: string;
  institucion: string;
  categoria: Categoria;
  descripcion: string;
  requisitos: string;
  horarios: string;
  contacto: string;
  ubicacion: string;
  sitioWeb: string;
  recursoLSB: string;
  verificado: boolean;
}

const DEMO: Servicio[] = [
  {
    id: 'orientacion-carnet',
    nombre: 'Orientación sobre documentación de discapacidad',
    institucion: 'Institución por confirmar',
    categoria: 'Orientación y derechos',
    descripcion: 'Ejemplo de ficha para centralizar información sobre orientación y documentación. No representa una convocatoria ni una prestación confirmada.',
    requisitos: 'Pendiente de validación con la institución responsable.',
    horarios: 'Pendiente de validación.', contacto: 'Pendiente de validación.',
    ubicacion: 'Cercado, Cochabamba · dirección por confirmar', sitioWeb: '', recursoLSB: '', verificado: false
  },
  {
    id: 'terapias-rehabilitacion',
    nombre: 'Información sobre rehabilitación y terapias',
    institucion: 'Centro por confirmar', categoria: 'Salud y rehabilitación',
    descripcion: 'Ficha ilustrativa para presentar centros, modalidades de atención y canales de consulta sobre rehabilitación.',
    requisitos: 'Pendiente de validación con el centro.', horarios: 'Pendiente de validación.',
    contacto: 'Pendiente de validación.', ubicacion: 'Cercado, Cochabamba · dirección por confirmar',
    sitioWeb: '', recursoLSB: '', verificado: false
  },
  {
    id: 'accesibilidad-educativa',
    nombre: 'Recursos de apoyo educativo accesible',
    institucion: 'Institución por confirmar', categoria: 'Educación y comunicación',
    descripcion: 'Ejemplo del tipo de recurso informativo sobre materiales accesibles, asesoría educativa y comunicación inclusiva.',
    requisitos: 'Pendiente de validación.', horarios: 'Pendiente de validación.',
    contacto: 'Pendiente de validación.', ubicacion: 'Cercado, Cochabamba · dirección por confirmar',
    sitioWeb: '', recursoLSB: '', verificado: false
  },
  {
    id: 'apoyos-comunitarios',
    nombre: 'Orientación sobre servicios de apoyo comunitario',
    institucion: 'Organización por confirmar', categoria: 'Apoyo e inclusión',
    descripcion: 'Ficha de demostración de información institucional para personas con discapacidad y sus familias.',
    requisitos: 'Pendiente de validación.', horarios: 'Pendiente de validación.',
    contacto: 'Pendiente de validación.', ubicacion: 'Cercado, Cochabamba · dirección por confirmar',
    sitioWeb: '', recursoLSB: '', verificado: false
  }
];

@Injectable({ providedIn: 'root' })
export class DirectorioService {
  private readonly key = 'sinfronteras-directorio-demo-v1';
  private readonly records = new BehaviorSubject<Servicio[]>(this.read());
  readonly servicios$ = this.records.asObservable();

  getAll(): Servicio[] { return this.records.value; }
  byId(id: string): Servicio | undefined { return this.getAll().find(x => x.id === id); }

  upsert(servicio: Servicio): void {
    const next = [...this.getAll()];
    const index = next.findIndex(item => item.id === servicio.id);
    if (index < 0) next.push(servicio); else next[index] = servicio;
    this.save(next);
  }

  delete(id: string): void { this.save(this.getAll().filter(item => item.id !== id)); }
  resetDemo(): void { this.save(DEMO.map(item => ({ ...item }))); }

  private read(): Servicio[] {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed as Servicio[];
      }
    } catch { /* Fallback para navegadores con almacenamiento restringido. */ }
    return DEMO.map(item => ({ ...item }));
  }

  private save(records: Servicio[]): void {
    this.records.next(records);
    try { localStorage.setItem(this.key, JSON.stringify(records)); } catch { /* Uso en memoria. */ }
  }
}
