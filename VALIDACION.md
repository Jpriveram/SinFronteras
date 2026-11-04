# Validación de la entrega

**Verificado en esta sesión:**
- Los 10 archivos TypeScript del frontend pasaron la transpilación sintáctica con TypeScript.
- Se comprobaron las rutas: `/`, `/servicios`, `/servicios/:id` y `/admin`.
- El menú y el inicio no incluyen módulos ajenos al documento de Metodología.
- El HTML del inicio se revisó con una vista previa estructural de Chromium (sin acceso a fotografías externas por restricciones de red del entorno).
- Las tres URL de fotografías corresponden a fichas de archivos CC BY-SA en Wikimedia Commons, citadas dentro del proyecto.

**No verificado aquí:**
- No fue posible ejecutar `npm install` o `ng build` con dependencias reales porque el entorno de trabajo no tiene acceso a npm.
- No se pudo confirmar desde este entorno la carga de los archivos de imagen remotos en el navegador de la persona usuaria. Se necesita conexión a Internet.
- Falta una auditoría de accesibilidad WCAG completa.

El frontend está preparado para ejecutar `npm install && npm start` en una computadora con Node.js y conexión a Internet, pero no se presenta como una compilación verificada ni como la plataforma completa con backend.
