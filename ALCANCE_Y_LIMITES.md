# Alcance y límites aplicados al prototipo

Documento académico base: «Desarrollo de un portal web para el fortalecimiento del conocimiento y acceso a servicios destinados a personas con discapacidad en Cercado, Cochabamba, 2026».

## En el documento

- Portal web **informativo**, de consulta pública, sin registro ni inicio de sesión.
- Información de instituciones y servicios para personas con discapacidad **exclusivamente en Cercado, Cochabamba**.
- Búsqueda y filtrado.
- Fichas con descripción, requisitos, horarios, contacto y ubicación.
- Accesibilidad web según criterios seleccionados de WCAG.
- Recursos multimedia y adaptaciones en Lengua de Señas Boliviana (LSB) para información del portal.
- Administración para registrar, editar y actualizar información de servicios e instituciones.
- Arquitectura propuesta: Angular + Spring Boot + MySQL.

## Fuera del alcance según el documento

- Trámites, solicitudes, pagos, reservas o gestión de beneficios externos.
- Geolocalización en tiempo real o planificación de rutas.
- Traducción automática a LSB, reconocimiento de señas o funciones de IA.
- Garantía de que los servicios publicados serán proporcionados por las instituciones.
- Adaptación integral a todos los tipos y grados de discapacidad (solo criterios definidos en el alcance).

Por eso se **retiraron del menú** Marketplace, Bolsa de empleo, Transporte, Foro, Eventos, Reportes, Perfil y Registro del Figma original.

## Estado real de esta entrega

La maqueta de frontend funciona de forma autónoma con datos de ejemplo y persistencia local de demostración. La integración con Spring Boot/MySQL, control de acceso del módulo administrativo, consulta de datos reales y multimedia LSB **no están implementados todavía**. No confundir esta maqueta con el portal completo propuesto en la investigación.
