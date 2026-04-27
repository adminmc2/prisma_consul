# Glosario — Prisma APEX

Vocabulario canónico del proyecto. Fuente única para evitar deriva terminológica entre documentos, código y conversación.

> **Cómo se usa.** Cada término tiene definición concisa + referencia al documento canónico donde se desarrolla en detalle. El glosario **no inventa términos**: absorbe los ya aprobados en `MODELO-DOMINIO.md`, `CONTRATOS.md`, `ECOSISTEMA.md` y `REVIEW-PRISMA-APEX.md`.
>
> **Regla de mantenimiento.** Cuando un documento canónico introduce un término nuevo o cambia uno existente, el cambio se refleja aquí. Cuando el documento canónico contradice este glosario, manda el canónico — pero hay que actualizar el glosario inmediatamente.
>
> **Cierre.** Este documento cierra **C10** del review.
>
> Auditable como unidad independiente.

---

## 1. Producto y sistema

### APEX
Producto que PRISMA vende a clientes. Acrónimo de **Automatización de Procesos y Experiencias**. Conceptualmente equivalente a un CRM, pero rebautizado para marcar el paradigma con IA. PRISMA construye varios productos; APEX es uno de ellos.
*Canónico:* `MODELO-DOMINIO.md` §1.1.

### Prisma APEX
Sistema interno de PRISMA donde PRISMA opera con sus clientes. Es la instancia que PRISMA usa para sí misma. Análogo a Salesforce-empresa usando Salesforce-producto. Reemplaza el nombre legacy "Hub".
*Canónico:* `MODELO-DOMINIO.md` §1.1. *Estado:* `Hub` se mantiene como URL pública (`/hub`) durante Sprint A.

### Producto
Categoría de oferta de PRISMA. Hoy en `web-de-prisma` solo se modela **APEX**. Otros productos PRISMA (NOVIA, ABBE, Omia) viven en sus propios repos.
*Canónico:* `MODELO-DOMINIO.md` §3.5.

### Vertical
Variante de un producto adaptada a un universo de cliente. Las verticales activas para APEX son tres:
- `clinica-multi` — clínicas con varios médicos.
- `clinica-personal` — clínicas de un solo médico.
- `distribuidor` — distribuidores de pharma, cosmética, dermatología (con submódulos por subtipo).

*Canónico:* `MODELO-DOMINIO.md` §1.2 y §3.6.

### Engagement
Instancia comercial-operativa de un cliente en una vertical concreta. Un Cliente puede tener varios Engagements consecutivos o paralelos. Cada Engagement pertenece a un Producto, una Vertical, y tiene una Fase actual.
*Canónico:* `MODELO-DOMINIO.md` §3.4.

### Fase (de un engagement)
Etapa actual del engagement. Enum dentro de Engagement, no entidad propia. Las **fases legacy reales** del sistema hoy son cuatro, con nombre verbatim — sección "Fases legacy" abajo. **Modelo objetivo de fases queda pendiente** y se cerrará cuando los procesos correspondientes maduren.
*Canónico:* `MODELO-DOMINIO.md` §3.7.

---

## 2. Modelo de datos

### Cliente
Empresa con la que PRISMA mantiene o ha mantenido relación comercial. Entidad organizativa, no persona. Atributos canónicos: `id`, `nombre`, `nombre_corto` (slug), `tipo_negocio`, `created_at`, datos empresariales (`rfc`, `direccion`, `ciudad`, `cp`, `telefono`, `sector`).
*Canónico:* `MODELO-DOMINIO.md` §3.1 y §5.

### Usuario
Persona que accede al sistema con credenciales propias. Atributos canónicos: `id`, `email`, `password_hash`, `nombre`, `cargo`, `contacto_principal`. **No tiene** `cliente_id`, `active_engagement_id`, `role` global ni atributos empresariales como atributos canónicos (pueden existir como columnas transitorias durante Sprint A).
*Canónico:* `MODELO-DOMINIO.md` §3.2.

### ClientMembership
Relación N-N entre Usuario y Cliente, con un rol específico para ese contexto. **Es la única verdad canónica de pertenencia usuario↔cliente.** Granularidad por cliente (no por engagement).
*Canónico:* `MODELO-DOMINIO.md` §3.3 y §7.

### Submission
Respuestas concretas del cliente al formulario de discovery, junto con datos de empresa y resultados de investigación. Tabla legacy `apex_submissions`.
*Canónico:* `MODELO-DOMINIO.md` §3.8 y `CONTRATOS.md` §5.4.

### Entrevista
Sesión grabada con personal del cliente durante la fase de consultoría. Audio en Drive (Workspace nativo desde Meet); transcripción en `prisma-trabajo-clientes` como markdown.
*Canónico:* `MODELO-DOMINIO.md` §3.9.

### Archivo
Documento subido al sistema (por cliente o por PRISMA en nombre del cliente). Backend de almacenamiento durante Sprint A: Google Drive. Sprint B: filesystem IONOS con espejo a Drive.
*Canónico:* `MODELO-DOMINIO.md` §3.10 y `CONTRATOS.md` §4.4.

### Entregable
HTML renderizado a partir de una plantilla y datos del cliente, servido al cliente como producto del engagement. Vive en el repo bajo `prisma-apex/clientes-publicados/[cliente]/`. Servido bajo URL canónica `/publicados/[cliente]/...`.
*Canónico:* `MODELO-DOMINIO.md` §3.11 y §9, `CONTRATOS.md` §3.3.

### Plantilla
Estructura genérica de un tipo de entregable, asociada a una vertical y opcionalmente a un módulo. **No existe todavía**; se introduce en fase 3 de Sprint A.
*Canónico:* `MODELO-DOMINIO.md` §3.12.

---

## 3. Roles de usuario

### prisma_admin
Administrador PRISMA. Acceso operativo a todos los clientes (vía `ClientMembership` con `role='prisma_admin'` por cada cliente activo). En `portal_users` durante Sprint A: `role='admin'`.
*Canónico:* `MODELO-DOMINIO.md` §3.3 y §7.

### cliente_admin
Administrador en el lado del cliente. Puede editar datos de su Cliente y gestionar usuarios de su empresa. **No se asigna automáticamente** durante migración; se asigna manualmente cuando aplique.
*Canónico:* `MODELO-DOMINIO.md` §3.3 y §7.

### cliente_user
Usuario regular del cliente. Acceso de lectura/escritura a sus propios datos y archivos.
*Canónico:* `MODELO-DOMINIO.md` §3.3 y §7.

---

## 4. Términos arquitectónicos

### Atributo canónico
Atributo propio del modelo conceptual de una entidad. Forma parte de la definición canónica.
*Canónico:* `MODELO-DOMINIO.md` §3.2.

### Conveniencia transitoria
Columna o puntero que existe solo durante la transición. **No** parte del modelo canónico. Ejemplo: `portal_users.cliente_id` y `portal_users.active_engagement_id` son conveniencias transitorias durante Sprint A; se eliminan cuando todos los consumidores leen del modelo canónico.
*Canónico:* `MODELO-DOMINIO.md` §3.2 y §11.1.

### Migración aditiva
Migración de BD que **solo añade** tablas o columnas; nunca borra ni renombra. Estrategia obligatoria durante Sprint A.
*Canónico:* `MODELO-DOMINIO.md` §11 y MD-14.

### domain-sync (`server/lib/domain-sync.js`)
Capa única de aplicación que mantiene la sincronización entre estado legacy (`portal_users.empresa`, `current_phase`, etc.) y modelo nuevo (`clientes`, `engagements`, etc.). **No triggers de BD; no sincronización dispersa por endpoint.**
*Canónico:* `MODELO-DOMINIO.md` §6.6 y MD-6.

### Capa de registro de rutas (route registry)
Capa del frontend que centraliza el mapeo `cliente → paths` en un registro consultable, en lugar de constantes hardcodeadas en el JS. Reemplaza las 3 constantes `ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH` en `portal/index.html`. Pre-requisito técnico de mover físicamente `portal/analisis/armc/` en Fase 2.
*Canónico:* `MODELO-DOMINIO.md` §9.5, `CONTRATOS.md` §6.1.

### Núcleo común APEX (core)
Parte del sistema Prisma APEX que se comparte entre verticales: motor de discovery, modelo de fases, motor de entregables, gestión de archivos, gestión de clientes, capa de registro de rutas. Vive en `prisma-apex/core/`.
*Canónico:* `MODELO-DOMINIO.md` §5.

### discovery-engine
Motor genérico del flujo discovery (formulario inicial). **Hoy ya es mixto clínica-distribuidor**, no específico de una vertical. Vive en el núcleo común.
*Canónico:* `MODELO-DOMINIO.md` §3.7 y §5.

### discovery-pack
Configuración específica de discovery para una vertical concreta (preguntas, situaciones, lógica de tipo). Vive bajo `prisma-apex/verticales/[vertical]/discovery-pack/`.
*Canónico:* `MODELO-DOMINIO.md` §5 (estructura propuesta del repo).

### Modelo objetivo de fases — pendiente
Decisión abierta: las fases definitivas que tendrá el sistema cuando los procesos completos estén desarrollados. Algunas fases legacy se conservarán; otras se renombrarán; algunas (captación, operación) son procesos no implementados todavía. Durante Sprint A se mantienen las **4 fases legacy verbatim**.
*Canónico:* `MODELO-DOMINIO.md` §3.7.2 y §6.3.

---

## 5. Términos legacy (frozen Sprint A)

### `current_phase`
Columna `INTEGER` en `portal_users`. Fase legacy del proceso APEX en curso. Valores 1-4 mapean a las 4 fases legacy verbatim.
*Canónico:* `MODELO-DOMINIO.md` §6.2 y `CONTRATOS.md` §5.1.

### `profile_type`
Columna `TEXT` en `portal_users`. Tipo de cliente legacy: `'clinica'` o `'distribuidor'`. Default `'clinica'`. Mapping a `engagements.vertical` durante transición:
- `'clinica'` → `'clinica-multi'` (asignación inicial para clientes existentes; **no default permanente**).
- `'distribuidor'` → `'distribuidor'`.

*Canónico:* `MODELO-DOMINIO.md` §6.4 y MD-4.

### `apex_submission_id`
Columna `TEXT` en `portal_users`. Enlace al `id` de una fila en `apex_submissions`. Pasa a `engagements.submission_id` post-transición; se conserva legacy durante Sprint A.
*Canónico:* `MODELO-DOMINIO.md` §6 y `CONTRATOS.md` §5.1.

### `role` (global, en JWT y `portal_users`)
Columna `TEXT` en `portal_users`. Rol global del usuario: `'admin'` o `'user'`. Es la **fuente de verdad efectiva de autorización durante Sprint A**. Se sincroniza a `client_memberships` como tabla derivada; centralización en una capa de autorización queda fuera de Sprint A.
*Canónico:* `MODELO-DOMINIO.md` §8 y MD-8.

### `empresa` (texto suelto en `portal_users`)
Columna `TEXT` en `portal_users` con el nombre de la empresa del usuario. Pasa a `clientes.nombre` post-transición. **Una vez exista `cliente_id`**: pasa a campo legacy NO editable directamente; las ediciones se redirigen transparentemente a la entidad Cliente vía `domain-sync.js`. Cero regresión visible para el usuario.
*Canónico:* `MODELO-DOMINIO.md` §5.4 y MD-2.

### Fases legacy (4)
Las cuatro fases reales del sistema hoy, con nombre verbatim:
1. **Formulario APEX**
2. **Documentación**
3. **Entrevistas**
4. **Análisis de flujos y procesos**

El admin puede saltar libremente entre ellas (no hay regla de monotonía). Modelo objetivo de fases queda pendiente.
*Canónico:* `MODELO-DOMINIO.md` §3.7.1 y §6.2, MD-5, MD-19.

---

## 6. Ecosistema de repositorios

### `web-de-prisma`
Repo principal. Contiene la web pública + Prisma APEX (sistema interno) + entregables publicados versionados.
*Canónico:* `ECOSISTEMA.md` §1.

### `prisma-trabajo-clientes`
Repo privado **nuevo** (a crear en Fase 1). Texto colaborativo de PRISMA por cliente: contratos, notas, transcripciones, drafts. **Solo texto en git; binarios pesados (audios, vídeos) viven en Drive**.
*Canónico:* `ECOSISTEMA.md` §2.

### `prisma-consulting`
Repo de metodología APEX: frameworks, plantillas abstractas, dolores tipificados, guías de entrevista, specs de productos en exploración (NOVIA, Omia).
*Canónico:* `ECOSISTEMA.md` §3.

### `apex-agents`
Repo de la plataforma de agentes IA basada en CrewAI con dashboards y evaluación.
*Canónico:* `ECOSISTEMA.md` §4.

### `above-pharma` (ABBE)
Repo del asistente de ventas para Above Pharma. Chatbot desplegado en HF Spaces. Servido vía CNAME `abbe.prismaconsul.com`.
*Canónico:* `ECOSISTEMA.md` §5.

### `prisma-server-ops`
Repo de operación del VPS IONOS: seguridad, mantenimiento, runbooks. **No** contiene código de producto.
*Canónico:* `ECOSISTEMA.md` §6.

---

## 7. Servicios externos al ecosistema git

### Google Workspace Drive
Backend de almacenamiento de uploads del cliente durante Sprint A (vía service account con domain-wide delegation). Audios y vídeos de entrevistas (Meet recordings nativos). Claude Code lee vía MCP. **No** se duplica en git. Sprint B: uploads migran a IONOS con espejo en Drive.
*Canónico:* `ECOSISTEMA.md` §"Servicios externos".

### Servidor IONOS de backup
Backup periódico del VPS de producción. Configurado y mantenido aparte. **Fuera del alcance** de la reorganización Sprint A.
*Canónico:* `ECOSISTEMA.md` §"Servicios externos".

### Cloudflare
DNS y proxy del dominio `prismaconsul.com`. Subdominios `dev.prismaconsul.com` y `abbe.prismaconsul.com`.
*Canónico:* `CLAUDE.md` §"DNS y Cloudflare".

### Neon PostgreSQL
Base de datos serverless usada por `web-de-prisma`. Tablas legacy: `apex_submissions`, `portal_users`, `portal_files`, `portal_activity_log`. Tablas nuevas en fase 2: `clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`.
*Canónico:* `CONTRATOS.md` §5.

### IONOS VPS
Servidor Linux Ubuntu 24.04, IP `212.227.251.125`. **Runtime** de Prisma APEX (nginx + Express + PM2). Sirve la web y la API. Storage de uploads del cliente: NO durante Sprint A (eso vive en Drive); SÍ durante Sprint B y posteriores.
*Canónico:* `ECOSISTEMA.md` §"Servicios externos" y `CLAUDE.md` §"IONOS VPS".

---

## 8. Términos de proceso y revisión

### Sprint A
Bloque de 4 semanas de reorganización estructural: definición + compatibilidad + reorganización física + verticales y plantillas + Claude Code. **Mantiene Drive como almacén** durante toda su duración.
*Canónico:* `REVIEW-PRISMA-APEX.md` §8.

### Sprint B
Bloque de 1-1.5 semanas posterior a Sprint A. Migración del almacén de uploads desde Drive a servidor IONOS, con espejo a Drive para acceso del cliente. Diseño detallado **diferido** (C06 abierto en review).
*Canónico:* `REVIEW-PRISMA-APEX.md` §7 (C06).

### Fase (de Sprint A)
Subdivisión de Sprint A. Las 4 fases:
1. **Definición y compatibilidad** — modelo de dominio, contratos, glosario, capa de registro, clasificación, plan archivo a archivo.
2. **Reorganización física** — movimientos de carpetas, ajustes de servidor, migración aditiva BD.
3. **Verticales y plantillas** — plantillas por tipo de empresa, ARMC migrado a sistema de plantillas.
4. **Claude Code** — agentes, skills, hooks, modo revisor permanente.

*Canónico:* `REVIEW-PRISMA-APEX.md` §8.

### Gate (de fase)
Conjunto explícito de condiciones que deben cumplirse antes de pasar a la siguiente fase. **No se pasa de fase solo porque el trabajo técnico parezca listo**: se pasa cuando el gate está marcado como aprobado en el review.
*Canónico:* `REVIEW-PRISMA-APEX.md` §2 y §7.

### Decisión cerrada (D-XX, MD-XX, CT-XX)
Decisión aprobada y registrada con identificador. Tres familias:
- `D-XX` — decisiones globales del review (`REVIEW-PRISMA-APEX.md` §6).
- `MD-XX` — decisiones del modelo de dominio (`MODELO-DOMINIO.md` §14).
- `CT-XX` — decisiones de contratos (`CONTRATOS.md` §11).

### Decisión condicional (C-XX)
Decisión abierta o pendiente de cierre, registrada con identificador en `REVIEW-PRISMA-APEX.md` §7. Estados: `Abierto`, `Cerrado`, `Diferido`.

### Bitácora de revisión
Sección 11 de `REVIEW-PRISMA-APEX.md`. Registro cronológico de cada revisión importante con formato fijo (qué se revisó, hallazgos, decisiones afectadas, documentos a actualizar, impacto en gates, próximo paso).

---

## 9. Términos de contratos

### Contrato congelado
Promesa técnica del sistema a sus consumidores que **no se rompe** durante un periodo definido (típicamente Sprint A completo). Cinco tipos: URLs públicas, endpoints API, esquema BD, paths hardcodeados, documentación que asume estructura.
*Canónico:* `CONTRATOS.md` §1, §2, §11.

### URL pública
Dirección web a la que se accede desde el navegador. Ejemplos frozen Sprint A: `/`, `/apex`, `/hub`, `/api/*`, `/aviso-legal*`, `/cookies*`, `/privacidad*`, assets estáticos.
*Canónico:* `CONTRATOS.md` §3.

### Endpoint API
Dirección interna que las SPAs usan para hablar con el servidor. **17 endpoints reales** identificados, frozen Sprint A.
*Canónico:* `CONTRATOS.md` §4.

### Path hardcodeado
Ruta a un archivo físico que el JavaScript del frontend construye literalmente en su código. Detectados: 3 constantes en `portal/index.html` (líneas 2423, 2432, 2441). **Pre-requisito técnico:** abstraer vía capa de registro de rutas antes de mover físicamente los archivos.
*Canónico:* `CONTRATOS.md` §6.

### CONTRATO CRÍTICO
Marca aplicada a contratos cuyo cambio afecta el comportamiento visible al usuario. Hoy: PATCH `/api/portal-profile` y PATCH `/api/portal-users/:id` (write path empresarial sin regresión).
*Canónico:* `CONTRATOS.md` §4.3, §4.5, CT-4.

### Modificar vs romper un contrato
- **Modificar** = cambio planificado, con anuncio + convivencia temporal viejo/nuevo + retirada gradual. **Permitido.**
- **Romper** = cambio sin compatibilidad, consumidores se rompen sin aviso. **No permitido.**

*Canónico:* `CONTRATOS.md` §9, CT-10.

---

## 10. Términos de URL específicas

### `/hub`
URL pública del sistema interno Prisma APEX (URL externa congelada durante Sprint A). El nombre interno del directorio cambia a `prisma-apex/`, pero la URL pública NO se renombra.
*Canónico:* `CONTRATOS.md` §3.2, §11 (CT-1).

### `/apex`
URL pública del formulario de discovery (frozen Sprint A).
*Canónico:* `CONTRATOS.md` §3.2, §11 (CT-1).

### `/publicados/[cliente]/...`
**Contrato canónico** para los entregables publicados al cliente. Sustituye a `/portal/analisis/[cliente]/...` (URL legacy con redirect 301 indefinido).
*Canónico:* `MODELO-DOMINIO.md` §9.2, `CONTRATOS.md` §3.3 y CT-2.

### `/portal/analisis/[cliente]/...` (URL legacy)
URL antigua de los entregables publicados. Tras Fase 2 redirige 301 a `/publicados/[cliente]/...`. Periodo de transición indefinido.
*Canónico:* `CONTRATOS.md` §8.1.

### `/web/`
**Carpeta interna nueva** (NO URL pública) introducida en Fase 2 para alojar la web pública. El servidor reapunta `express.static` a esta carpeta. Las URLs públicas (`/`, `/aviso-legal`, etc.) **no cambian**.
*Canónico:* `MODELO-DOMINIO.md` §9.3, `CONTRATOS.md` §11 (CT-1).

---

## 11. Términos de Claude Code

### CLAUDE.md
Archivo de instrucciones globales del proyecto. Cargado automáticamente por Claude Code en cada conversación. Vive en raíz del repo + carpetas clave.
*Canónico:* `MODELO-DOMINIO.md` §6.

### Modo revisor permanente
Comportamiento base del workspace, configurado en `CLAUDE.md` global. **No es un skill.** Antes de aprobar cualquier cambio importante, contrastar contra: `CONTRATOS.md`, `MODELO-DOMINIO.md`, buenas prácticas, e impacto en verticales activas.
*Canónico:* `MODELO-DOMINIO.md` §6.1.

### Subagente (`.claude/agents/*.md`)
Tarea especializada con su propio contexto y herramientas. Subagentes previstos: `revisor`, `entrevistador`, `plantillador`.
*Canónico:* `MODELO-DOMINIO.md` §6 (tipología Claude Code).

### Skill (`.claude/skills/*.md`)
Workflow concreto invocable con `/comando`. Skills previstos: `/nuevo-cliente`, `/procesar-entrevista`, `/generar-entregable`, `/cierre-fase`.
*Canónico:* `MODELO-DOMINIO.md` §6 (tipología Claude Code).

### Hook (`.claude/settings.json`)
Automatización disparada por evento (al guardar archivo, al ejecutar comando). Hooks previstos: validación de nomenclatura, frontera entre carpetas.
*Canónico:* `MODELO-DOMINIO.md` §6 (tipología Claude Code).

### MCP (Model Context Protocol)
Integración externa que da a Claude Code acceso a sistemas externos. Activos: Google Drive, Gmail, Calendar.
*Canónico:* `MODELO-DOMINIO.md` §6 (tipología Claude Code).

---

## 12. Convenciones

### Versionado semántico
- **MAJOR** — rediseño, nueva arquitectura.
- **MINOR** — nueva funcionalidad.
- **PATCH** — correcciones, bugs, cambios documentales.

Versión actual: ver `CLAUDE.md` §"Versionado". Cierre completo de la reorganización Sprint A + Sprint B → bump a `v4.0.0`.
*Canónico:* `CLAUDE.md` §"Versionado".

### Naming de directorios y archivos
- **kebab-case** para directorios y archivos: `clinica-multi`, `discovery-pack`, `domain-sync.js`.
- **UPPERCASE** para documentos canónicos en raíz: `CLAUDE.md`, `CHANGELOG.md`, `MODELO-DOMINIO.md`, `CONTRATOS.md`, `GLOSARIO.md`, `ECOSISTEMA.md`, `REVIEW-PRISMA-APEX.md`, `README.md`.

### Naming de URLs
- **kebab-case** en paths: `/aviso-legal`, `/publicados/clinica-multi/...`.
- URLs públicas son contrato congelado (sección 9).

### Naming de tablas y columnas BD
- **snake_case**: `portal_users`, `current_phase`, `apex_submissions`, `client_memberships`.

---

## 13. Términos sobre los que decir lo que NO son

Aclaraciones para evitar confusión recurrente:

- **APEX ≠ formulario de discovery.** APEX es el producto completo. El formulario es solo una pieza del engagement APEX (fase 1 legacy "Formulario APEX").
- **Hub ≠ Prisma APEX.** "Hub" es nombre legacy + URL pública (`/hub`). "Prisma APEX" es el nombre canónico actual del sistema interno.
- **Cliente ≠ Usuario.** Cliente es la empresa; Usuario es la persona. Un cliente puede tener varios usuarios.
- **Engagement ≠ Cliente.** Un Cliente puede tener múltiples Engagements.
- **`active_engagement_id` ≠ relación canónica.** Es puntero transitorio de UI, solo aplica a `cliente_user`. `prisma_admin` siempre lo tiene NULL.
- **`cliente_id` en `portal_users` ≠ pertenencia canónica.** Es conveniencia transitoria. La pertenencia canónica vive en `ClientMembership`.
- **Atributo canónico ≠ columna en BD hoy.** Algunos atributos canónicos (ej. los empresariales que viven en Cliente) se persisten transitoriamente en `portal_users` durante Sprint A.
- **Drive ≠ interfaz primaria.** Drive es backend de almacenamiento de uploads (Sprint A) y de audios/vídeos. La interfaz primaria es siempre el Hub.
- **Servidor IONOS ≠ backup.** IONOS es runtime primario. El backup es otro servidor IONOS dedicado, fuera del alcance.

---

## 14. Términos pendientes de definir

Términos que aparecerán cuando los procesos correspondientes maduren. **No se nombran preventivamente** durante Sprint A:

- Nombres de fases del **modelo objetivo**.
- Concepto de **operación continua** (fase 5 APEX, en desarrollo).
- Concepto de **captación** (fase 0 APEX, no implementada).
- Subtipos de **distribuidor** dentro de las verticales (cuando el primer cliente distribuidor entre).
- Capa **centralizada de autorización** (sprint posterior).
- **EngagementAccess** (granularidad de auth por engagement, sprint posterior).

---

## 15. Cuándo el glosario contradice un documento canónico

**El documento canónico manda.** El glosario es una vista consolidada y puede quedar desfasada brevemente.

Reglas operativas:
1. Si encuentras una contradicción entre este glosario y un documento canónico, **trabaja con la versión del canónico**.
2. Reporta la contradicción para que se corrija el glosario.
3. No modifiques el canónico para que coincida con el glosario sin pasar por el proceso de revisión correspondiente.

---

**Fin de GLOSARIO.md.**

Cierra C10. Auditable como unidad. Tras revisión, se procede al siguiente entregable (especificación de la capa de registro de rutas).
