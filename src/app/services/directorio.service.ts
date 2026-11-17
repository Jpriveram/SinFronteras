import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Categoria =
  | 'Salud y rehabilitación'
  | 'Orientación y derechos'
  | 'Educación y comunicación'
  | 'Apoyo e inclusión'
  | 'Educación especial y rehabilitación'
  | 'Rehabilitación y habilitación para personas con discapacidad visual'
  | 'Educación especial';

export interface FuenteServicio {
  nombre: string;
  url: string;
}

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
  poblacion?: string;
  servicios?: string;
  direccion?: string;
  municipio?: string;
  telefono?: string;
  correo?: string;
  fuente?: FuenteServicio;
  fechaVerificacion?: string;
  fechaRevisionFuente?: string;
}

const INSTITUCIONES_REALES: Servicio[] = [
  {
    id: 'cereco-centro-rehabilitacion-educacion',
    nombre: 'CERECO',
    institucion: 'Centro de Rehabilitación y Educación Cochabamba',
    categoria: 'Educación especial y rehabilitación',
    descripcion: 'Centro de educación especial y rehabilitación. La dirección y el teléfono incluidos son referencias de la Guía de Centros de Educación Especial 2025 y requieren confirmación vigente.',
    requisitos: 'Pendiente de confirmación.',
    horarios: 'Información no disponible.',
    contacto: 'Información no disponible.',
    ubicacion: 'Cochabamba, Bolivia.',
    sitioWeb: '',
    recursoLSB: '',
    verificado: false,
    poblacion: 'Información no disponible.',
    servicios: 'Educación especial y rehabilitación. Los servicios específicos requieren confirmación.',
    direccion: 'Av. 9 de Abril N.º 1506 (referencia de la guía 2025; pendiente de confirmar vigencia).',
    municipio: 'Pendiente de confirmar si la dirección corresponde al municipio de Cercado.',
    telefono: '76948827 (referencia de la guía 2025; pendiente de confirmar vigencia).',
    correo: 'Información no disponible.',
    fuente: {
      nombre: 'Guía de Centros de Educación Especial 2025 — Ministerio de Educación',
      url: 'https://www.minedu.gob.bo/files/TEMPORAL/Gua_final_CEE_2025__compressed.pdf'
    },
    fechaRevisionFuente: '17/11/2026'
  },
  {
    id: 'manuela-gandarillas',
    nombre: 'Centro de Rehabilitación Manuela Gandarillas',
    institucion: 'Instituto Boliviano de la Ceguera',
    categoria: 'Rehabilitación y habilitación para personas con discapacidad visual',
    descripcion: 'El Instituto Boliviano de la Ceguera identifica al Centro Manuela Gandarillas entre sus centros de rehabilitación en Cochabamba. El IBC describe sus centros como espacios que apoyan la autonomía e independencia de personas ciegas y con baja visión.',
    requisitos: 'Pendiente de confirmación.',
    horarios: 'Información no disponible.',
    contacto: 'Información no disponible.',
    ubicacion: 'Cochabamba, Bolivia.',
    sitioWeb: '',
    recursoLSB: '',
    verificado: false,
    poblacion: 'Personas ciegas y con baja visión (alcance descrito por el IBC para sus centros de rehabilitación).',
    servicios: 'El IBC describe para sus centros habilitación básica funcional, rehabilitación básica funcional, estimulación visual y rehabilitación visual. La oferta vigente del centro requiere confirmación.',
    direccion: 'Información no disponible.',
    municipio: 'Pendiente de confirmar si el centro se encuentra en el municipio de Cercado.',
    telefono: 'Información no disponible.',
    correo: 'Información no disponible.',
    fuente: {
      nombre: 'Estructura institucional — Instituto Boliviano de la Ceguera',
      url: 'https://ibc.gob.bo/estructura.php'
    },
    fechaRevisionFuente: '17/11/2026'
  },
  {
    id: 'preefa-fe-y-alegria',
    nombre: 'PREEFA',
    institucion: 'Programa de Educación Especial Fe y Alegría',
    categoria: 'Educación especial y rehabilitación',
    descripcion: 'La Cámara de Diputados informa que PREEFA brinda servicios de rehabilitación y busca promover la inclusión educativa y laboral de sus estudiantes, de acuerdo con sus necesidades individuales.',
    requisitos: 'Pendiente de confirmación.',
    horarios: 'Información no disponible.',
    contacto: 'Información no disponible.',
    ubicacion: 'Cochabamba, Bolivia (referencia de la fuente; municipio pendiente de confirmar).',
    sitioWeb: '',
    recursoLSB: '',
    verificado: false,
    poblacion: 'Niños, niñas y adolescentes con discapacidad intelectual, múltiple, autismo y discapacidad auditiva.',
    servicios: 'Rehabilitación; inclusión educativa y laboral (según la nota de la Cámara de Diputados).',
    direccion: 'Información no disponible.',
    municipio: 'Pendiente de confirmar si se encuentra en el municipio de Cercado.',
    telefono: 'Información no disponible.',
    correo: 'Información no disponible.',
    fuente: {
      nombre: 'Comité de Diputados verifica la atención que se brinda a niñas y niños que reciben educación especial — Cámara de Diputados, 24/07/2025',
      url: 'https://diputados.gob.bo/noticias/comite-de-diputados-verifica-la-atencion-que-se-brinda-a-ninas-y-ninos-que-reciben-educacion-especial/'
    },
    fechaRevisionFuente: '17/11/2026'
  },
  {
    id: 'ceem-heroinas-coronilla',
    nombre: 'CEEM Heroínas de la Coronilla',
    institucion: 'Centro de Educación Especial CEEM – Heroínas de la Coronilla',
    categoria: 'Educación especial',
    descripcion: 'La Cámara de Diputados informa que el CEEM atiende a estudiantes con necesidades educativas especiales y brinda servicios de rehabilitación y habilitación básica funcional.',
    requisitos: 'Pendiente de confirmación.',
    horarios: 'Información no disponible.',
    contacto: 'Información no disponible.',
    ubicacion: 'Cochabamba, Bolivia (referencia de la fuente; municipio pendiente de confirmar).',
    sitioWeb: '',
    recursoLSB: '',
    verificado: false,
    poblacion: 'Niños, niñas y jóvenes con necesidades educativas especiales (descripción de la Cámara de Diputados).',
    servicios: 'Rehabilitación básica funcional y habilitación básica funcional.',
    direccion: 'Información no disponible.',
    municipio: 'Pendiente de confirmar si se encuentra en el municipio de Cercado.',
    telefono: 'Información no disponible.',
    correo: 'Información no disponible.',
    fuente: {
      nombre: 'Legislativo visita el Centro de Educación Especial “Heroínas de la Coronilla” — Cámara de Diputados, 24/07/2025',
      url: 'https://diputados.gob.bo/noticias/legislativo-visita-el-centro-de-educacion-especial-heroinas-de-la-coronilla-y-evalua-las-condiciones-de-la-institucion/'
    },
    fechaRevisionFuente: '17/11/2026'
  }
];

const REMOVED_DEMO_IDS = new Set([
  'orientacion-carnet',
  'terapias-rehabilitacion',
  'accesibilidad-educativa',
  'apoyos-comunitarios'
]);
const INITIAL_RECORDS = [...INSTITUCIONES_REALES];

@Injectable({ providedIn: 'root' })
export class DirectorioService {
  private readonly key = 'sinfronteras-directorio-demo-v1';
  private readonly institutionsMigrationKey = 'sinfronteras-catalogo-instituciones-v2';
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
  resetDemo(): void { this.save(INITIAL_RECORDS.map(item => ({ ...item }))); }

  private read(): Servicio[] {
    let stored: string | null;
    try {
      stored = localStorage.getItem(this.key);
    } catch {
      return INITIAL_RECORDS.map(item => ({ ...item }));
    }

    if (!stored) return INITIAL_RECORDS.map(item => ({ ...item }));

    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch {
      return INITIAL_RECORDS.map(item => ({ ...item }));
    }

    if (!Array.isArray(parsed)) return INITIAL_RECORDS.map(item => ({ ...item }));
    const existing = parsed as Servicio[];

    try {
      if (localStorage.getItem(this.institutionsMigrationKey) === 'done') return existing;
    } catch {
      // Continue with the idempotent merge when migration state cannot be read.
    }

    const retained = existing.filter(record => !REMOVED_DEMO_IDS.has(record.id));
    const additions = INSTITUCIONES_REALES.filter(
      institution => !retained.some(record => record.id === institution.id)
    );
    const migrated = [...retained, ...additions.map(item => ({ ...item }))];
    try {
      localStorage.setItem(this.key, JSON.stringify(migrated));
      localStorage.setItem(this.institutionsMigrationKey, 'done');
    } catch {
      // Keep the merged catalog in memory and retry the idempotent migration later.
    }
    return migrated;
  }

  private save(records: Servicio[]): void {
    this.records.next(records);
    try { localStorage.setItem(this.key, JSON.stringify(records)); } catch { /* Uso en memoria. */ }
  }
}
