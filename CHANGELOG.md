# Changelog

Registro de cambios relevantes del proyecto PRISMA Consul.

## [2026-04-27] — v3.2.41

### Documentación — CONTRATOS.md (cierre de C09)

Cuarto entregable canónico de Sprint A fase 1. Cierra C09 (gate funcional para pasar a Fase 2). No toca código del producto.

- **`CONTRATOS.md`** (NUEVO): inventario exhaustivo de contratos externos del sistema construido leyendo código real. Cubre 5 tipos de contrato con sus respectivos consumidores y reglas de evolución:
  - **URLs públicas** (sección 3): landing, legales, SPAs `/apex` y `/hub`, entregables ARMC actuales (con plan de redirect 301 a `/publicados/[cliente]/...` en fase 2), assets estáticos, fallback.
  - **Endpoints API** (sección 4): 17 endpoints reales documentados con auth, request/response shapes, side effects y consumers — `/api/portal-auth`, `/api/portal-apex-results`, `/api/portal-profile` (GET/PATCH), `/api/portal-upload`, `/api/portal-files` (GET/DELETE/PATCH), `/api/portal-users` (GET/POST), `/api/portal-users/:id` (PATCH), `/api/portal-activity`, `/api/research-company`, `/api/generate-questions`, `/api/submit-form`, `/api/groq-chat`, `/api/groq-whisper`. Marcados como CRÍTICOS los PATCH `portal-profile` y `portal-users/:id` (write path empresarial sin regresión).
  - **Esquema BD** (sección 5): 4 tablas legacy congeladas (`portal_users`, `portal_files`, `portal_activity_log`, `apex_submissions`); 5 tablas aditivas en fase 2 (`clientes`, `client_memberships`, `engagements`, `entrevistas`, `entregables`); columnas `cliente_id` y `active_engagement_id` en `portal_users` (transitorias, NULL para `prisma_admin`).
  - **Paths hardcodeados** (sección 6): 3 constantes en `portal/index.html` (`ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH`) que se reemplazan por la capa de registro de rutas.
  - **Documentación** (sección 7): `GUIA-NUEVAS-SECCIONES.md`, `README.md`, `CLAUDE.md` (sección "Directory Structure") a actualizar en fase 2 simultáneamente al movimiento físico.
  - **Redirects** (sección 8): redirect 301 desde `/portal/analisis/[cliente]/*` a `/publicados/[cliente]/*`.
  - **Validación de fase 2** (sección 12): tests manuales mínimos cubriendo URLs públicas, entregables ARMC, endpoints cliente y admin, schema BD y sincronización `domain-sync.js`.
  - 14 decisiones cerradas (CT-1..CT-14).
- **`index.html` / `portal/index.html` / `CLAUDE.md`**: bump de versión a `v3.2.41`.

## [2026-04-27] — v3.2.40

### Documentación — Consolidación del criterio del revisor

Actualización del review vivo para dejar explícito qué se considera discrepancia activa y qué se considera histórico de revisión tras el cierre de C04. No toca código del producto.

- **`REVIEW-PRISMA-APEX.md`**: consolidado el criterio del revisor sobre discrepancias. Se fija que no hay discrepancia activa sobre C04, que las referencias antiguas en bitácora son histórico y que C09 queda como único bloqueante de Fase 2, mientras C10 permanece como absorción documental obligatoria antes del cierre total de Fase 1.
- **`index.html` / `portal/index.html` / `CLAUDE.md`**: bump de versión a `v3.2.40`.

## [2026-04-27] — v3.2.39

### Documentación — Cierre de C04 (alineación de ECOSISTEMA.md)

Tres ajustes documentales mínimos solicitados por el revisor para dejar cerrado el bloque de canónicos antes de pasar a `CONTRATOS.md`. No tocan código del producto.

- **`REVIEW-PRISMA-APEX.md`**: C04 marcado como Cerrado. Gate de Fase 2 actualizado: ahora bloqueada únicamente por C09 (CONTRATOS.md). R06 marcado como Mitigado. Añadida entrada en bitácora documentando el cierre.
- **`MODELO-DOMINIO.md`** (sección 15): eliminada la deuda residual sobre actualización de `ECOSISTEMA.md` (ya cumplida en v3.2.37).
- **`ECOSISTEMA.md`**: flujo de publicación de entregables reformulado para apuntar exclusivamente al repo (`web-de-prisma/prisma-apex/clientes-publicados/[cliente]/` servido por Express bajo `/publicados/[cliente]/...`), no al "área en el servidor".

## [2026-04-27] — v3.2.38

### Análisis ARMC — Flujo Atención al Paciente (Carlos) post-entrevista CEO

Cierre del primer pase de revisión del flujo de Carlos a la luz de la entrevista CEO 2026-04-15. Cambios in-place dentro de secciones existentes — sin secciones nuevas ni cambios estructurales.

- **`portal/analisis/armc/diagramas/flujo-atención-paciente.html`**:
  - Slide "Equipo de la clínica": entrada "Hermana de Gabo" reidentificada como **Dra. Elián Cabrera** (hija de Marisela) con su rol clínico (tricología + obesidad). Añadida nota: hoy los leads de obesidad NO entran por Carlos — los gestiona Elián al 100% (pendiente C08 si esto cambia con APEX). Añadido sub-bloque con cirujanos externos Figueroa/Vargas/Ducón (resuelto por entrevista CEO).
  - Slide "Flujo paciente nuevo", paso 10: redactado con las 3 variantes A/B/C de la consulta de valoración. Variante A general gratuita (Marisela/Divani), Variante B pre-cirugía con especialista externo (2ª valoración con costo pendiente — C07), Variante C vía directa con Dr. Cabrera por demanda del paciente desde el inicio = $1,950 (Marisela/Divani no intervienen).
  - Sección "Vacíos resueltos por otras entrevistas": 10 → 12 entradas. Añadidas 2 nuevas resueltas por la CEO: las 3 variantes A/B/C y el catálogo definitivo (5 líneas, ~52 procedimientos, hallazgos nuevos: bruxismo, abdominoplastía, lifting facial láser).
- **`docs/VALIDACION-CATALOGO-ARMC.md`**: revertida limpieza errónea de la fila B del bloque 3.7 — la entrevista CEO no precisa si la 2ª valoración con especialista externo es gratuita o de pago. Reabierta como pendiente apuntando a REVIEW-PRISMA-APEX C07. Clarificada fila C: Gabush hace la única valoración cuando el paciente lo pide desde el inicio, Marisela/Divani no intervienen.
- **`REVIEW-PRISMA-APEX.md`** (Sección 7): 2 puntos abiertos nuevos — C07 (costo 2ª valoración pre-cirugía con especialista externo) y C08 (quién agenda variantes B y C de valoración + leads de obesidad — decisión de proceso/sistema APEX).

## [2026-04-27] — v3.2.37

### Documentación — Sprint A fase 1 (definición y compatibilidad)

Primeros entregables auditables de la reorganización de Prisma APEX (plan v4.1, Sprint A). Cierran el modelo de dominio canónico y el mapa del ecosistema. No tocan código del producto.

- **`MODELO-DOMINIO.md`** (NUEVO): documento canónico del modelo conceptual del sistema. Define entidades (Cliente, Usuario, ClientMembership, Engagement, Vertical, Fase, Submission, Entrevista, Archivo, Entregable, Plantilla), relaciones canónicas y separación explícita entre modelo canónico y compatibilidad transitoria. Cierra los tres puntos bloqueantes del revisor: (1) identidad canónica de Cliente con read+write path sin regresión funcional, (2) compatibilidad legacy de Engagement/Vertical con las 4 fases legacy verbatim (`Formulario APEX`, `Documentación`, `Entrevistas`, `Análisis de flujos y procesos`) y migración en dos pasos, (3) serving explícito de entregables publicados bajo `/publicados/[cliente]/...`. 21 decisiones cerradas (MD-1..MD-21) tras 4 rondas de revisión.
- **`ECOSISTEMA.md`** (NUEVO): documento canónico del mapa de repositorios PRISMA y sus relaciones (5 repos + servicios externos). Incluye flujos cruzados (cliente nuevo, procesar entrevista, generar entregable, evolucionar metodología, mantenimiento) y convenciones comunes. Alineado con `MODELO-DOMINIO.md`: clarificada la separación entre runtime IONOS y storage backend Drive durante Sprint A.
- **`CLAUDE.md`**: añadida sección "Ecosistema de repositorios" con resumen breve y enlace a `ECOSISTEMA.md`.
- **`REVIEW-PRISMA-APEX.md`**: actualizado tras la aprobación de `MODELO-DOMINIO.md` v4. Se cerraron C01, C02, C03 y C05; Fase 2 sigue bloqueada por C04 y el nuevo C09 (`CONTRATOS.md`); se añadieron impactos posteriores sobre `GLOSARIO.md` y `ECOSISTEMA.md`; siguiente entregable obligatorio: `CONTRATOS.md`.

## [2026-04-27] — v3.2.36

### Documentación — Revisión Prisma APEX
- **REVIEW-PRISMA-APEX.md:** Creado documento vivo de revisión para centralizar el estado de la reorganización de Prisma APEX, las decisiones cerradas, los puntos condicionales, los gates entre fases, los riesgos activos y la bitácora de revisiones. Se actualizará después de cada revisión importante y se eliminará cuando su contenido quede absorbido por la documentación permanente del proyecto.

## [2026-04-27] — v3.2.35

### Documentación — Validación catálogo ARMC
- **docs/VALIDACION-CATALOGO-ARMC.md:** Limpieza de marcas ⏳ huérfanas en el cuerpo del documento para hacerlo coherente con el resumen final ("Pendientes: 0"). 7 entradas actualizadas: 3.8 Obesidad ubicada definitivamente dentro de Medicina estética; Abdominoplastía confirmada para añadir al catálogo (Línea 1, Dr. Figueroa) en hallazgos y tabla maestra (1.16); Opción C de la Sección 2.1 (5 líneas) marcada como ✅ CONFIRMADO; 2.3 (líneas obsoletas) cerrada como N/A por implicación de 2.2; Valoración pre-cirugía (3.7 B) confirmada como gratuita en ambas citas. Leyenda actualizada (eliminado símbolo ⏳ que ya no aplica)

## [2026-04-26] — v3.2.34

### Infraestructura / DNS
- **Migración DNS a Cloudflare:** Los nameservers del dominio `prismaconsul.com` se movieron de IONOS a Cloudflare (`bruce.ns.cloudflare.com`, `cass.ns.cloudflare.com`) como requisito para configurar el subdominio custom `abbe.prismaconsul.com` (proyecto ABBE en HF Spaces)
- **Registros DNS en Cloudflare:** Recreados todos los registros necesarios — A (`prismaconsul.com`, `www`, `dev`) → `212.227.251.125`, CNAME `abbe` → `mandocc2-abbe.hf.space`, MX → Google Workspace, TXT (SPF + Google verification)
- **Fix redirect loop (301):** Cambiado modo SSL/TLS en Cloudflare de "Flexible" a "Full (Strict)" para evitar bucle infinito de redirección HTTP↔HTTPS con nginx
- **Subdominio `abbe.prismaconsul.com`:** CNAME apuntando a HF Spaces (`mandocc2-abbe.hf.space`) para el proyecto ABBE

## [2026-04-15] — v3.2.33

### Blueprint ARMC
- **modelo-datos.html:** Renombrar campo 1.28 "Oposición a uso no clínico" → "Solo comunicaciones clínicas" con descripción positiva del Derecho de Oposición ARCO (LFPDPPP). Sin cambio en conteos (260)

## [2026-04-15] — v3.2.32

### Blueprint ARMC
- **modelo-datos.html:** Cita.Canal agendamiento: texto → enum (auto) portal-paciente/equipo-interno/presencial. Auto-detectado por el sistema. Sin cambio en conteos (260/18)

## [2026-04-15] — v3.2.31

### Blueprint ARMC
- **modelo-datos.html:** Eliminar campo redundante "Confirmación: automática/manual" de Cita (cubierto por Confirmación respondida + Recordatorio enviado). Cita 19→18 campos, modelo 261→260
- **fases-implementacion.html:** Sync Cita 19→18 campos, total 261→260 (2 refs)

## [2026-04-15] — v3.2.30

### Blueprint ARMC
- **modelo-datos.html:** Cita: +2 campos (Hora inicio real, Hora fin real), +1 estado (en-consulta). Lifecycle: Confirmada → En consulta → Completada. Duración estimada auto-sugerida desde PR.10. Cita 17→19 campos
- **modelo-datos.html:** Protocolo de Revisión: +1 campo PR.10 (Duración estimada por procedimiento). PR 9→10 campos
- **fases-implementacion.html:** Sync total 258→261 campos (2 refs)
- Total modelo: 258→261 campos

## [2026-04-15] — v3.2.29

### Blueprint ARMC
- **modelo-datos.html:** Corregir total de campos 210→258. El 210 contaba secciones agrupadas como 1 campo; el 258 cuenta campos individuales reales (Paciente=164, resto=94). Referencia: historia-clinica-campos.md
- **fases-implementacion.html:** Sync total 210→258 (2 refs)

## [2026-04-14] — v3.2.28

### Blueprint ARMC
- **modelo-datos.html:** Procedimiento completado: lifecycle 5 estados, 13 campos (7 metadatos + 6 clínicos), 9 sub-campos consentimiento informado, 7 relaciones. Campos reestructurados: -7 absorbidos por Protocolo de Revisión FK, +3 nuevos (FK Protocolo, Fecha realización, Satisfacción). 214→210 campos
- **fases-implementacion.html:** Sync conteo 216→210 campos (2 refs)

## [2026-04-14] — v3.2.27

### Blueprint ARMC
- **modelo-datos.html:** Eliminar firmas testigo 1/2 de evaluación HC (solo aplican en consentimiento informado NOM-004 10.1.1). Testigos no bloqueantes con alerta en Procedimiento. 216→214 campos

## [2026-04-14] — v3.2.26

### Blueprint ARMC
- **modelo-datos.html:** Cita expandida a 17 campos (ciclo de vida, tipos, 6 campos nuevos). 216 campos totales
- **automatizaciones.html:** +3 automatizaciones D1 (reagendamientos, post-cita, no-show/cancelaciones). 25 total
- **fases-implementacion.html:** +4 ítems F1 (Cita ampliada + 3 auto). 25 automatizaciones

## [2026-04-14] — v3.2.25

### Blueprint ARMC
- **fases-implementacion.html / automatizaciones.html:** Invitación automática a crear cuenta cuando lead agenda evaluación (D1+D3). Automatizaciones 21→22, D1 7→8. Sync conteos con modelo-datos v3.2.24: 210 campos, 10 entidades, PR 9 campos
- **modelo-datos.html:** Nota informativa en sección Evaluación agendada sobre invitación automática a crear cuenta

## [2026-04-14] — v3.2.24

### Blueprint ARMC
- **modelo-datos.html:** Nueva entidad Evaluación Clínica (9 campos, 17 escalas estandarizadas en 7 categorías). Campo PR.9 (escalas clínicas aplicables) en Protocolo de Revisión (8→9 campos). Relación Paciente +1 (6→7). Stats: 10 entidades, 210 campos. D2 actualizado con Evaluación Clínica

## [2026-04-14] — v3.2.23

### Blueprint ARMC
- **modelo-datos.html:** Diferenciados 3 niveles de firma en APEX. Campo 1.27 (Aviso de privacidad) cambiado de "firma" a "aceptación digital con auditoría" (2 checkboxes separados no pre-marcados + log: timestamp, IP/dispositivo, versión del aviso). Sección Firmas digitales reemplazada: tabla de 4 firmas HC → tabla de 3 niveles (aceptación digital, autógrafa digitalizada, FEA). Tabla "3 documentos del paciente" renombrada a "3 consentimientos" con nueva columna Mecanismo que diferencia aceptación digital vs firma autógrafa. Sin cambios en firmas HC (9.7-9.10) ni consentimiento informado (10.1)

## [2026-04-14] — v3.2.22

### Blueprint ARMC
- **modelo-datos.html:** Añadido campo 1.14 Tipo de interrogatorio (auto: Directo/Indirecto) en evaluación médica. Default "Directo", el médico cambia a "Indirecto" solo si tercero proporcionó info. Buena práctica clínica, no exigido NOM-004

## [2026-04-14] — v3.2.21

### Blueprint ARMC
- **modelo-datos.html:** Corrección Continuo 21→20 campos (conteo verificado: 4 clasificación + 7 fechas + 3 contadores + 4 proceso graduado + 1 historial + 1 notas)
- **fases-implementacion.html:** F1: +3 ítems (cifrado TLS/AES-256, autenticación/MFA, backups/DRP), modelo de datos con 9 nombres de entidades, Log Auditoría NOM-004/NOM-024, retención con 5 años general, prereq protocolos con umbrales/Protocolo de Revisión. F3: confirmación respondida movida de F1 a F3. Purga con detalle leads + usuarios

## [2026-04-14] — v3.2.20

### Frontend — PRISMA Hub (Blueprint)
- **Sincronización fases-implementacion.html con modelo de datos actualizado** — F1: +5 ítems (Log de Auditoría, inmutabilidad COFEPRIS, retención diferenciada, campo Cita confirmación respondida S2, catálogos CIE-10/CBCM) + prereq Matriz Cumplimiento NOM024, 168→200 campos en 9 entidades. F2: +3 ítems (entidad Señal de Inacción 8 campos, entidad Protocolo de Revisión 8 campos, campos Paciente proceso graduado). F3: +1 ítem (campos Comunicación newsletter + secuencia sin abrir S6). Total: 50→59 ítems

## [2026-04-13] — v3.2.19

### Frontend — PRISMA Hub (Blueprint)
- **Sincronización modelo-datos.html — 6 gaps resueltos** — 3 entidades nuevas: Señal de Inacción (8 campos, D2+D3, registro individual por señal S1-S8), Protocolo de Revisión (8 campos, D2, umbrales por procedimiento para proceso graduado), Log de Auditoría (9 campos, D1, append-only NOM-024). Paciente: 4 campos nuevos en Continuo (fase proceso graduado, fecha inicio fase, señales activas count, último tipo procedimiento) + 6ª relación (Señales de Inacción). Cita: +1 campo (confirmación respondida → S2). Comunicación: +2 campos (es newsletter, secuencia sin abrir → S6). Procedimiento: +relación Protocolo de Revisión. Stats: 6→9 entidades, 168→200 campos. Cobertura D1-D4 actualizada. NOM-024 referencia Log de Auditoría. Nota final con ecosistema §5B + §5B-2

## [2026-04-13] — v3.2.18

### Frontend — PRISMA Hub (Blueprint)
- **Actualización fases-implementacion.html** — Stats: automatizaciones 12→21. F1 expandida 8→19 ítems (lifecycle, 168 campos, IDs HC, firma digital, RBAC, NOM-004/024, LFPDPPP, 7 automáticos). F2 expandida 7→13 ítems (clasificación conductual A/B/C, 8 señales inacción, niveles riesgo, proceso graduado, 5 automáticos). F3 actualizada 6→8 ítems (canal switching, aviso privacidad LFPDPPP, 4 automáticos). F4 actualizada 6→10 ítems (13 fuentes, señales S1/S5/S6, 5 automáticos). Nota final con decisiones pendientes ARMC

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
