# Sin Fronteras — Cercado, Cochabamba

**Prototipo académico en Angular 19**, basado en la estructura de carpetas del repositorio público `feliLuis/SinFronterasMetodologia` y en el homepage del Figma exportado. Actualizado con los **alcances y límites del documento «Desarrollo de un portal web para el fortalecimiento del conocimiento y acceso a servicios destinados a personas con discapacidad en Cercado, Cochabamba, 2026».**

## Ejecución

Requisito: **Node.js 20 LTS o 22 LTS** y npm.

```bash
npm install
npm start
```

Abrir **http://localhost:4200/**. No es necesario instalar Angular CLI de forma global; `npm start` usa la versión instalada localmente.

Secciones disponibles:

- `/` — Página de inicio, basada en la composición Figma; se reemplazaron las fotografías por referencias reales de Bolivia disponibles en la web.
- `/servicios` — Directorio de ejemplo con búsqueda textual y filtrado por categoría.
- `/servicios/:id` — Ficha de servicio con descripción, requisitos, horarios, contacto, ubicación e indicador del estado de verificación.
- `/admin` — Panel de prueba para **agregar, editar, eliminar y restablecer** fichas, guardadas solo en `localStorage` del navegador.

## Muy importante: qué SÍ y qué NO incluye

Esta entrega permite evaluar el **diseño y la interacción del frontend**, pero **no es un sistema productivo**:

- Los cuatro registros iniciales son **ficticios y están marcados como demostración**. No se presentan como instituciones, horarios ni requisitos oficiales. Una persona responsable debe verificar los datos antes de publicar el portal.
- La administración es una maqueta **sin autenticación ni permisos**; NO se debe desplegar en producción. Guarda solo cambios locales del navegador.
- **No incluye el backend Spring Boot ni la base MySQL.** Se ha mantenido el enfoque Angular para poder iniciar la demo con `npm install && npm start`. La arquitectura backend mencionada en el documento corresponde a una etapa posterior.
- No incluye comercio, foro, trabajo, transporte, eventos, perfiles, pagos, reservas, gestión de trámites, seguimiento en tiempo real, IA ni geolocalización; esas funciones no pertenecen al alcance del documento.
- Contiene un espacio y campo para vincular recursos en **Lengua de Señas Boliviana (LSB)**, pero no se dispone de videos verificados en esta versión. No hay traducción ni reconocimiento automático de señas.
- Se implementaron medidas seleccionadas de accesibilidad: enlaces de salto, roles y etiquetas semánticas, controles con teclado, ajuste de texto, alto contraste y texto alternativo. **Esto no sustituye una auditoría WCAG ni pruebas con personas usuarias.**

## Fotografías

Son **fotografías reales**, no imágenes generadas con IA. Se muestran desde Wikimedia Commons mediante URL externas y por eso **requieren conexión a Internet** mientras se visualiza la página. Se seleccionaron archivos con licencias Creative Commons. Ver [FOTOGRAFIAS_Y_LICENCIAS.md](FOTOGRAFIAS_Y_LICENCIAS.md) para créditos y licencias. El logo procede del material original facilitado por el usuario. No se redistribuyen archivos fotográficos dentro del ZIP.

## Organización

```text
src/app/
  app.routes.ts
  services/directorio.service.ts
  components/
    VistaUsuario/
      home/                 <- homepage inspirado en Figma
      catalogo/             <- búsqueda y filtros
      detalle-servicio/     <- ficha del servicio
    VistaAdmin/
      servicios/            <- edición en localStorage (demo)
  shared/
    navbar/                 <- navegación y accesibilidad
    footer/
```

## Notas de integración futura

Para integrar al proyecto original, conectar `DirectorioService` a una API Spring Boot con persistencia MySQL (endpoints para listado, filtros, detalle y administración); aplicar autenticación y autorización al módulo `/admin`; sustituir los datos de demostración por registros reales y revisados; verificar información institucional y añadir recursos LSB autorizados; ejecutar pruebas WCAG con lectores de pantalla y navegación de teclado.

Fuente del diseño: Figma exportado a PDF por el usuario. Fuente de los requisitos: documento de Metodología entregado por el usuario.
