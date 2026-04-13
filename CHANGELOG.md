# Changelog

Registro de cambios relevantes del proyecto PRISMA Consul.

## [2026-04-13] — v3.2.17

### Frontend — PRISMA Hub (Blueprint)
- **Actualización flujos-to-be.html** — Atención al Paciente: flujo lifecycle completo (Lead→Usuario→Evaluación→Paciente) con señales S2/S3 y aviso LFPDPPP. Cirujano: firma digital, HC inmutable NOM-004, addendum COFEPRIS, RBAC. Community Manager: aviso privacidad, canal switching S5, ajuste segmentación S6. Director: 25 KPIs, embudo completo, señales N1/N2, proceso graduado. Primer Ayudante/Cosmiatra/Tricóloga: notas RBAC. Stats: automatizaciones 12→21. Nota final añadida

## [2026-04-13] — v3.2.16

### Frontend — PRISMA Hub (Blueprint)
- **Actualización automatizaciones.html de 12 a 21** — 7 sin cambios, 4 modificadas (Confirmación citas +S2+Director, Clasificación pacientes nuevo trigger/acción conductual, Alerta inactivo → Proceso graduado 4 fases, Campaña reactivación nuevo trigger/acción), 1 con nota menor (Captura leads +nota API WhatsApp), 9 nuevas (D1: transición ciclo vida + verificación pre-consulta + purga LFPDPPP; D2: motor señales inacción + alertas nivel riesgo; D3: aviso privacidad; D4: seguimiento post-evaluación S1 + canal switching S5 + ajuste segmentación S6). Nueva sección "Sistema de Señales de Inacción" con tabla de 8 señales y diagrama de niveles de riesgo

## [2026-04-13] — v3.2.15

### Frontend — PRISMA Hub (Blueprint)
- **Actualización kpis-objetivo.html de 13 a 25 KPIs** — 9 sin cambios, 4 modificados (Pacientes clasificados nueva desc, Tasa de retención → Tasa de recurrencia, Pacientes reactivados → Efectividad de reactivación, Tasa de conversión nueva desc), 12 nuevos distribuidos en D1-D4. Nueva sección "Relación entre KPIs" con tabla de enriquecimiento. Nota final actualizada

### Infraestructura — SSL Dev
- **Configurado SSL para dev.prismaconsul.com** — Certificado Let's Encrypt con certbot. Antes, HTTPS caía en producción. Renovación automática vía certbot.timer. Caduca 12 julio 2026

## [2026-04-13] — v3.2.14

### Frontend — PRISMA Hub (Blueprint)
- **Reescritura completa modelo-datos.html** — Entidad Paciente con ciclo de vida de 4 etapas (Lead → Usuario → Evaluación agendada → Paciente), 168 campos organizados por 6 fases, 8 nuevas secciones regulatorias/técnicas (RBAC, firmas digitales, inmutabilidad, COFEPRIS, NOM-024, retención de datos), eliminación de entidad Lead (integrada en Paciente)

### Infraestructura — SSL Dev
- **Configurado SSL para dev.prismaconsul.com** — Certificado Let's Encrypt instalado con certbot. Antes, `https://dev.prismaconsul.com` caía en el bloque SSL de producción y servía archivos de main. Ahora sirve correctamente los archivos de dev. Renovación automática vía `certbot.timer` (2 ejecuciones/día). Caduca 12 julio 2026 (se renueva solo ~30 días antes)

## [2026-04-10] — v3.2.13

### Frontend — PRISMA Hub
- **Fix padding lateral en contenedores** — restaurado padding 1rem con width:100% y box-sizing:border-box. Los tabs de usuario no tienen panel-main, así que los contenedores necesitan su propio padding. Inputs ahora llenan todo el ancho con margen lateral correcto

## [2026-04-10] — v3.2.12

### Frontend — PRISMA Hub
- **Fix containers width** — todos los contenedores internos (profile, apex, entrevistas, análisis) ahora tienen `width: 100%` explícito para que se expandan correctamente dentro de los flex tabs. Corrige los inputs de Datos personales que no ocupaban el ancho completo

## [2026-04-10] — v3.2.11

### Frontend — PRISMA Hub
- **Perfil usuario responsive** — inputs de datos personales ahora ocupan 100% del ancho en móvil, contenido visible sin truncar (empresa, email, dirección, etc.)

## [2026-04-10] — v3.2.10

### Frontend — PRISMA Hub
- **Tabs como cajas en móvil** — las pestañas ahora se muestran como botones/cajas con fondo, borde y fondo cyan semitransparente en la activa, dentro de un contenedor con fondo oscuro y bordes redondeados. Mucho más claro visualmente que las tabs planas anteriores

## [2026-04-10] — v3.2.9

### Frontend — PRISMA Hub
- **Tabs responsive grid 2x2** — en móvil las pestañas (Dashboard/Usuarios y Perfil y proceso/Documentos/Formulario APEX/Análisis) pasan de scroll horizontal a cuadrícula 2x2 para que todas sean visibles sin deslizar. Nombres de archivo ahora hacen word-break en lugar de truncarse

## [2026-04-10] — v3.2.8

### Frontend — PRISMA Hub
- **Responsive completo** — corregido detalle de usuario para móviles: header con "Ver como cliente" a ancho completo, campos de perfil apilados verticalmente (label arriba, valor abajo), inputs al 100%, avatar reducido. También: staging items adaptables, dropzone compacta, users grid 1 columna, viewer de análisis compacto, botones wrap en 480px

## [2026-04-10] — v3.2.7

### Frontend — PRISMA Hub
- **Dashboard responsive** — corregido el dashboard admin para móviles: pipeline de clientes apila avatar+nombre arriba y dots de fases abajo, filas de actividad reciente se ajustan sin desbordamiento, stats y user cards admin compactos en pantallas pequeñas

## [2026-04-10] — v3.2.6

### Frontend — PRISMA Hub
- **Responsive/móvil** — reescritura completa de media queries para que PRISMA Hub sea usable en móviles: header reducido (60px→50px), logo escalado, botón logout más compacto, paddings reducidos, grid de análisis adaptativo (4→2→1 columna), tabs con scroll horizontal, tarjetas de usuario y archivos compactas, modales a pantalla completa en 480px, inputs al 100% de ancho

## [2026-04-10] — v3.2.5

### Frontend — Análisis de flujos (ARMC)
- **CEO/Dirección** — eliminado vacío pendiente "Volumen real de ventas y métricas de productos"

## [2026-04-10] — v3.2.4

### Frontend — Análisis de flujos (ARMC)
- **Tricología** — eliminados 10 vacíos pendientes (herramienta de agendamiento, pacientes no-show, coordinación con Gabriel, autonomía en precios, almacenamiento de contactos, herramienta PDFs, control de inventario, respaldo de fotos, propiedad del iPad, volumen control de peso)

## [2026-04-10] — v3.2.3

### Frontend — Análisis de flujos (ARMC)
- **Primer Ayudante** — eliminados 3 vacíos pendientes: proporción valoraciones Divani vs Maricela, proporción procedimientos Divani vs Gabriel, aceptación del paciente

## [2026-04-10] — v3.2.2

### Frontend — Análisis de flujos (ARMC)
- **Cosmiatra** — eliminado vacío pendiente "Historia estética separada" (confirmado: HC única para todos, no existe historia estética separada)

## [2026-04-10] — v3.2.1

### Frontend — Landing page
- **Fix sección contacto en pantallas altas** — la sección de contacto no se mostraba en monitores grandes porque la sección Nosotros (450vh) nunca salía completamente del viewport, dejando activos los elementos fijos (tarjeta de equipo, overlay de cierre) que tapaban el formulario. Ajustado el umbral de `sectionInViewport` y el trigger de reveal del contacto.
- **Cache bust main.js** — actualizado query string a v130 para forzar recarga del JS

### Frontend — Análisis de flujos (ARMC)
- **Cirujano** — eliminado vacío pendiente "Volumen exacto de procedimientos por semana" (no relevante)
- **Enfermero** — movido vacío "Las tres agendas — formato y gestión" de pendiente a resuelto (formato es físico)
- **Scrollbar unificado** — aplicado scrollbar PRISMA (cyan, 6px) en todas las páginas de análisis (diagnóstico y blueprint)

## [2026-04-04] — v3.2.0

### Frontend — PRISMA Hub (portal completo)
- **5 pestañas de cliente** — Formulario APEX, Datos personales, Documentos, Entrevistas, Análisis de flujos y procesos
- **Formulario APEX** — visualización de resultados vinculados al usuario (empresa, dolores aceptados/rechazados, plan)
- **Datos personales** — edición de perfil por el propio usuario, vista de solo lectura para admin
- **Documentos** — subida con título descriptivo obligatorio, nomenclatura sistemática automática (`prefijo_001.pdf`)
- **Entrevistas** — pestaña dedicada que filtra archivos con `doc_type = 'entrevista'`
- **Análisis** — placeholder para web en construcción
- **Código y nombre separados** — el código de archivo (ej. `armc_001.pdf`) se muestra como etiqueta cyan no editable, el nombre descriptivo es editable
- **Admin: detalle de usuario con 4 sub-pestañas** — Perfil y proceso, Documentos (con subida), Formulario APEX, Análisis
- **Admin: "Ver como cliente"** — vista de solo lectura del portal desde la perspectiva del cliente
- **Enlace PRISMA Hub en navegación** — acceso directo desde el menú principal de la web

### Backend
- **GET /api/portal-apex-results** — devuelve resultados APEX vinculados al usuario (soporta `?userId=X` para admin)
- **GET /api/portal-profile** — datos de perfil del usuario (soporta `?userId=X` para admin)
- **PATCH /api/portal-profile** — edición de perfil por el propio usuario (campos limitados, sin role/phase)
- **Upload mejorado** — `display_name` almacena título descriptivo, `file_name` almacena nombre sistemático, `drive_file_id` almacena ID real de Google Drive
- **Rename** — solo actualiza `display_name` en BD, no modifica el nombre en Drive

### Base de datos
- Columna `display_name` en `portal_files` para nombre descriptivo
- Columna `apex_submission_id` en `portal_users` para vincular resultados APEX
- 46 archivos migrados a nomenclatura sistemática (`prefijo_secuencia.ext`)
- Nombres descriptivos recuperados desde `originalFilename` de Google Drive

---

## [2026-04-02] — v3.1.0

### Backend
- **Sistema de roles** — campo `role` en `portal_users` (admin/user), middleware `requireAdmin`
- **Propiedad de archivos** — cada usuario tiene su subcarpeta en Google Drive (`user_{id}/`), tabla `portal_files` para rastreo
- **Log de actividad** — tabla `portal_activity_log` registra login, upload, delete, rename, user_created
- **Rutas admin** — `GET /api/portal-users`, `POST /api/portal-users`, `GET /api/portal-activity` (protegidas con requireAdmin)
- **Scoping de archivos** — usuarios solo ven/modifican sus propios archivos, admin puede ver todos

### Frontend
- **PRISMA Hub** — renombrado de "Portal de Documentos", ruta `/hub` en vez de `/documentacion`
- **Pestañas** — Documentos (todos), Usuarios (admin), Actividad (admin)
- **Vista "como usuario"** — admin puede seleccionar un cliente y ver su espacio de documentos
- **Crear usuarios** — modal para que admin cree nuevos perfiles de clientes
- **Log de actividad** — tabla cronológica con badges de color por tipo de acción

### Base de datos
- Migración: columnas `role` y `drive_folder_id` en `portal_users`
- Nuevas tablas: `portal_files`, `portal_activity_log`
- 46 archivos existentes migrados a subcarpeta del admin

### Infraestructura
- nginx actualizado: `/documentacion` → `/hub`

---

## [2026-03-28] — v3.0.1

### Seguridad
- **nodemailer** 6.10.1 → 8.0.4 — Corrige inyección de comandos SMTP, envío a dominios no intencionados, y DoS por parser de direcciones
- **path-to-regexp** 0.1.12 → 0.1.13 — Corrige denegación de servicio (ReDoS) por parámetros de ruta malformados

### Infraestructura
- Configurado **Dependabot** (`.github/dependabot.yml`) — monitoreo automático semanal de dependencias con notificaciones vía GitHub PR

### Frontend
- Añadido número de versión (`v3.0.1`) en el footer de la landing page

### Repositorio
- Implementado versionado semántico (SemVer) con instrucciones en CLAUDE.md
- Creado CHANGELOG.md para registro obligatorio de cambios
- Verificado y validado como repositorio independiente funcional (servidor arranca, rutas API responden, archivos estáticos se sirven, todas las variables de entorno presentes)
