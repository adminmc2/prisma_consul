# Changelog

Registro de cambios relevantes del proyecto PRISMA Consul.

## [2026-05-01] — v3.2.54

### Análisis ARMC — Catch-up del Diagnóstico Integrado a producción (Resumen Ejecutivo profundo + correcciones del dictamen)

Publicación a producción de las actualizaciones acumuladas en `dev` desde v3.2.53: revisión profunda del Resumen Ejecutivo (v3.3.15 + v3.3.16) + correcciones del dictamen de revisor (v3.3.18). 5 archivos consolidados. Cambios in-place, sin secciones nuevas (salvo el Hallazgo 06 dentro del Resumen Ejecutivo). No incluye trabajo de blueprint ni Sprint A — siguen solo en `dev`.

#### `portal/analisis/armc/diagnostico/resumen-ejecutivo.html` (catch-up de v3.3.15 + v3.3.16)

- **KPI "Fricciones documentadas"**: 42+ → **52+**.
- **Subtítulo**: precisado — "8 entrevistas en total" (1 por rol + 2ª entrevista CEO de validación del catálogo del 2026-04-15) + 3 cirujanos externos identificados sin entrevista directa.
- **Atribución cita central**: "7 entrevistas" → "8 entrevistas a 7 roles" (fix de coherencia v3.3.16).
- **Hallazgo 02 "Historia clínica es un registro muerto"**: evidencia ampliada con gaps documentales confirmados por la 2ª entrevista CEO — lipoenzimas sin CI específico, PNO de obesidad pendiente.
- **Hallazgo 03**: título reescrito a "Retención del 10% — catálogo amplio infrautilizado". Cuerpo ampliado con catálogo confirmado (5 líneas, ~52 procedimientos, 16 servicios oficiales infrautilizados).
- **Hallazgo 05 "Fotos clínicas dispersas"**: 4+ → **5+ dispositivos** (incluida Elián con celular + iPad + cámara especializada).
- **Hallazgo 06 NUEVO**: "Catálogo oficial confirmado pero invisible al mercado" (5 → 6 hallazgos principales).
- **Voces del equipo**: añadida cita de Marisela de la 2ª entrevista CEO.
- **Conclusión**: ampliada con catálogo definitivo + visibilizar catálogo + bloque amarillo destacado con C07/C08 pendientes.

#### `portal/analisis/armc/diagnostico/mapa-fricciones.html` (correcciones del dictamen v3.3.18)

- **KPI fricciones transversales**: 42+ → **52+** (sincronización con Resumen Ejecutivo).
- **Fricción "Fotos clínicas dispersas"**: "4+ teléfonos personales" → "5+ dispositivos personales" con desglose explícito (Gabriel, Divani, Óscar, Brisa y Elián + iPad + cámara especializada).

#### `portal/analisis/armc/diagnostico/cadena-causal.html` (corrección del dictamen v3.3.18)

- **Nodo D1 "Fotos en X dispositivos"**: 4+ → **5+** (sincronización).

#### `portal/analisis/armc/diagramas/flujo-atención-paciente.html` (correcciones del dictamen v3.3.18)

- **Handoff Carlos → Cirujano externo**: reformulado para que el as-is no afirme ownership. Antes decía "Carlos coordinaría la 2ª valoración"; ahora dice "Cirujano externo (...) — handoff hipotético, no validado: alguien debe coordinar... la hipótesis de trabajo es que recae en Carlos pero NO consta como ownership confirmado". C08 explícitamente marcado como abierto.
- **Fricción "Coordinación con cirujanos externos"**: reformulada igual — "Quién agenda esa derivación está abierto — la hipótesis de trabajo es Carlos pero NO está validado por la CEO".

#### `docs/VALIDACION-CATALOGO-ARMC.md` (correcciones del dictamen v3.3.18)

- **Fila 3.6 sobre masajes post-quirúrgicos**: corregida contradicción interna del documento. La fila decía "incluidos en cirugía, no se cobran aparte" pero la sección 5.3 del mismo documento contenía la corrección de la CEO afirmando que SÍ se cobran aparte. Fila 3.6 ahora alineada con 5.3.
- **Encabezado**: actualizada "Última actualización" a 2026-04-30. Estado pasa a "validado con la CEO en reunión 2026-04-15. 32/32 preguntas resueltas. 2 puntos derivados quedan abiertos en REVIEW-PRISMA-APEX C07 y C08".

## [2026-04-30] — v3.2.53

### Análisis ARMC — Documentación transversal de cirujanos externos en producción (parcial — Opción A)

Publicación a producción de la documentación transversal de los 3 cirujanos externos (Figueroa, Vargas, Ducón) bajo la Opción A (no se crea perfil/flujo separado). De las 6 ediciones aplicadas en `dev` (v3.3.14), esta publicación trae a producción solo las 3 que NO son de blueprint, manteniendo la regla histórica de que el blueprint vive solo en `dev`.

#### Diagnóstico (2 archivos)

- **`portal/analisis/armc/diagnostico/mapa-fricciones.html`**: añadida fricción transversal nº 9 — "Coordinación con cirujanos externos sin canal formal" (3 roles: Atención, Cirujano, CEO). Contador actualizado 8 → 9.
- **`portal/analisis/armc/diagnostico/resumen-ejecutivo.html`**: subtítulo actualizado para incluir los 3 cirujanos externos identificados. Bloque destacado nuevo en el hallazgo central documenta personal externo, decisión de quedarse con expediente/CI originales, y referencia a la fricción transversal nº 9.

#### Flujo por rol (1 archivo)

- **`portal/analisis/armc/diagramas/flujo-cirujano.html`** (Slide Perfil): añadida entrada "Procedimientos que NO realiza Gabriel (derivados a cirujanos externos)" — rinoplastia (Vargas/Ducón), mastopexía y abdominoplastía (Figueroa). Cierra el bucle visualmente sin contradecir la decisión previa de excluir externos del flujo de Gabriel.

**No se publican a producción** (siguen solo en `dev`):
- `portal/analisis/armc/blueprint/modelo-datos.html` (RBAC con sub-rol Cirujano externo)
- `portal/analisis/armc/blueprint/flujos-to-be.html` (card Cirujano con item To-Be sub-rol externo)
- `portal/analisis/armc/blueprint/fases-implementacion.html` (F1 con item Modelado de Personal Externo)

Justificación: regla histórica del proyecto — el blueprint vive solo en `dev`, no en producción (commit `3a2b92e Remove blueprint section from production`).

## [2026-04-30] — v3.2.52

### Análisis ARMC — Publicación a producción de los 5 flujos restantes post-entrevista CEO

Cierre del primer pase de revisión de los 7 flujos a la luz de la entrevista CEO 2026-04-15. Esta publicación trae a producción los 5 flujos restantes (Óscar, Brisa, Divani, Elián, CEO Marisela). Carlos y Gabriel ya estaban en producción desde v3.2.45 y v3.2.46. Cambios in-place dentro de secciones existentes — sin cambios estructurales. No incluye trabajo de reorganización Sprint A (CONTRATOS, MODELO-DOMINIO, ECOSISTEMA, REVIEW-PRISMA-APEX, GLOSARIO, REGISTRO-RUTAS, PLAN-FASE2) que sigue solo en `dev`.

#### `portal/analisis/armc/diagramas/flujo-enfermero.html` (3 ediciones)

- Slide "Post-procedimiento y seguimiento", entrada "Masajes ultrasonido post-lipo → Brisa": añadida confirmación CEO de que estos masajes son procedimientos cobrados aparte (no incluidos en cirugía).
- Sección "Vacíos de información": añadido segundo bloque `<details>` "Vacíos resueltos por otras entrevistas (1)" siguiendo el patrón estándar — los 2 procedimientos nuevos del catálogo (lifting facial láser, bruxismo) que Óscar tendrá que preparar.
- Sección "Fricciones identificadas por análisis": añadida fricción nueva — lipoenzimas activas sin consentimiento informado estandarizado.

#### `portal/analisis/armc/diagramas/flujo-cosmiatra.html` (5 ediciones)

- Slide "Brisa: Perfil y rol", entrada SUBUTILIZACIÓN: ampliada con catálogo CEO — Cosmiatría línea propia con 9 servicios + Brisa también opera Aparatología (7 servicios) = 16 servicios oficiales vs 3-4 reales. Subutilización DOBLE.
- Slide "Tratamientos y aparatología", entrada Protocolo post-lipo: añadida confirmación CEO de masajes cobrados aparte.
- Sección "Vacíos de información": añadido `<details>` "Vacíos resueltos por otras entrevistas (3)" — Cosmiatría como línea propia, sublíneas melasma/acné con cobro por sesión, masajes reductivos = futuro.
- Sección "Fricciones identificadas", fricción "Rol subutilizado": ampliada con confirmación CEO del alcance oficial del rol.
- Sección "Fricciones identificadas": añadida fricción nueva — "Catálogo de Cosmiatría confirmado pero invisible al paciente" (causa estructural de la subutilización).

#### `portal/analisis/armc/diagramas/flujo-primer-ayudante.html` (4 ediciones)

- Slide "Valoraciones": Variante A confirmada (Marisela O Divani); B y C no involucran a Divani.
- Slide "Procedimientos": entrada tirzepatida ampliada con confirmación CEO (Elián lidera obesidad); solapamiento marcado como pendiente aclarar.
- Sección "Vacíos resueltos por otras entrevistas": 2 → 5 entradas — Variante A, manejo de obesidad/PNO pendiente, procedimientos nuevos del catálogo que realiza Gabriel.
- Sección "Fricciones identificadas": +2 nuevas (solapamiento Divani/Elián en obesidad sin protocolo, tirzepatida sin PNO formal).

#### `portal/analisis/armc/diagramas/flujo-tricologia.html` (6 ediciones)

- Slide "Perfil y rol": Tricología confirmada como línea propia (línea 5) con 8 servicios oficiales.
- Slide "Tratamientos capilares": separación oficial Consulta capilar regenerativa vs Implante capilar (🔮 futuro).
- Slide "Control de peso (consulta)": Elián lidera obesidad dentro de Medicina Estética; falta PNO formal.
- Slide "Control de peso (bitácora)": contexto del reparto Elián/Divani via bitácora compartida (cierra solapamiento del flujo Primer Ayudante).
- Sección "Vacíos resueltos por otras entrevistas": nuevo `<details>` con 3 entradas (Tricología línea propia, Implante capilar futuro, manejo obesidad ubicación + PNO pendiente).
- Sección "Fricciones identificadas": +1 fricción nueva — "Manejo de obesidad activo sin PNO formal".

#### `portal/analisis/armc/diagramas/flujo-ceo.html` (8 ediciones)

- Slide "Perfil y rol": Variante A clarificada (Marisela O Divani).
- Slide "Expansión y servicios": 3 cirujanos externos confirmados (Figueroa, Vargas, Ducón).
- Slide "Captación y flujo del paciente": 3 variantes A/B/C de la valoración en paso 2.
- Slide "Retención": contextualizada con catálogo oficial — 16 servicios oficiales ignorados en oferta y promoción.
- Slide "Expediente y regulación": gaps documentales — lipoenzimas sin CI + PNO obesidad pendiente.
- Sección "Vacíos resueltos por 2ª entrevista CEO": nuevo `<details>` con 5 entradas (catálogo definitivo, personal externo, 3 variantes valoración, Cosmiatría/Tricología líneas propias, manejo obesidad).
- Sección "Puntos de Handoff": +1 handoff Marisela/Divani → Cirujanos externos (Variante B).
- Sección "Fricciones identificadas": +2 fricciones (catálogo confirmado pero promoción restringida + decisiones pendientes de la propia CEO C07/C08).

**Cierre completo del primer pase post-entrevista CEO en producción**: los 7 flujos (6 roles operativos + CEO) ya están actualizados en `prismaconsul.com`. Quedan pendientes para próximas iteraciones: flujo nuevo "Cirujanos externos" (Figueroa/Vargas/Ducón), validación con CEO de los puntos abiertos C07 (costo 2ª valoración pre-cirugía con externo) y C08 (quién agenda B/C/leads obesidad).

## [2026-04-29] — v3.2.46

### Análisis ARMC — Flujo Cirujano (Gabriel) post-entrevista CEO

Publicación a producción de la actualización del flujo del cirujano a la luz de la entrevista CEO 2026-04-15. Cambios in-place dentro de secciones existentes — sin secciones nuevas ni cambios estructurales. No incluye trabajo de reorganización Sprint A (CONTRATOS, MODELO-DOMINIO, ECOSISTEMA, GLOSARIO, REGISTRO-RUTAS, REVIEW-PRISMA-APEX) que sigue solo en `dev`.

#### `portal/analisis/armc/diagramas/flujo-cirujano.html`

- **Sección "Datos del cirujano"**: actualizada la entrada sobre valoraciones con Gabriel — costo confirmado en `$1,950` (antes sin precio explícito). Añadida la **variante C de la consulta de valoración** confirmada por la CEO: cuando el paciente pide directamente a Gabush desde el inicio, Marisela y Divani no intervienen — Gabush hace la única valoración.
- **Sección "Datos del cirujano"**: añadida entrada nueva sobre **2 procedimientos de Gabriel añadidos al catálogo oficial** por la CEO 2026-04-15: (1) lifting facial láser (distinto del endolifting), (2) aplicación de toxina botulínica en maseteros para bruxismo. Antes no aparecían en el catálogo oficial.
- **Sección "Otros datos relevantes"**: añadida entrada sobre **masajes post-quirúrgicos cobrados aparte** — confirmado por la CEO que los masajes de drenaje linfático y las terapias de ultrasonido posteriores a la cirugía son procedimientos cobrados por separado, NO incluidos en el precio de la cirugía. Los realiza Brisa (cosmiatra).
- **Diagrama Mermaid (subgraph VALORACIÓN)**: actualizado el coste mostrado de `$500 MXN` a `$1,950 MXN`, alineado con la confirmación de la CEO sobre el costo real de la valoración con Gabush.

## [2026-04-29] — v3.2.51

### Sprint A fase 1 — definición operativa del bloque B del registro de rutas

Con el bloque A ya cerrado por revisión, esta iteración convierte el bloque B en un entregable ejecutable por el otro agente. No cambia lógica del producto; define el checklist, las evidencias obligatorias y la forma exacta de reportar la smoke test del slice.

- **`docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`** (NUEVO): checklist operativo del bloque B. Fija alcance, definición de hecho, prerrequisitos, muestra mínima, ejecución por bloques (local, externos con credenciales `N/A`, dev/VPS), probe técnica opcional de `warn + null`, y matriz de reporte obligatoria.
- **`REVIEW-PRISMA-APEX.md`**: actualizado para dejar explícito que la base operativa del bloque B ya está definida y que la ejecución sigue pendiente. Añadida entrada de bitácora para separar con claridad "bloque B definido" de "bloque B ejecutado".

Estado: checklist del bloque B definido. La siguiente iteración ya no es de definición, sino de ejecución y evidencia.

## [2026-04-27] — v3.2.45

### Análisis ARMC — Flujo Atención al Paciente (Carlos) post-entrevista CEO + limpieza VALIDACION-CATALOGO

Publicación a producción del primer pase de revisión del flujo de Atención al Paciente a la luz de la entrevista CEO 2026-04-15, más la limpieza coherente del documento de validación del catálogo. Cambios in-place dentro de secciones existentes — sin secciones nuevas ni cambios estructurales. No incluye trabajo de reorganización Sprint A (CONTRATOS, MODELO-DOMINIO, ECOSISTEMA, REVIEW-PRISMA-APEX) que sigue solo en `dev`.

#### `portal/analisis/armc/diagramas/flujo-atención-paciente.html` (8 ediciones)

- **Slide "Equipo de la clínica"**: entrada "Hermana de Gabo" reidentificada como **Dra. Elián Cabrera** (hermana de Gabo, hija de Marisela) con su rol clínico (tricología + obesidad). Añadido sub-bloque "Personal no mencionado por Carlos" con cirujanos externos Figueroa / Vargas / Ducón.
- **Slide "Equipo" / entrada Dra. Elián**: añadida nota — hoy los leads de obesidad NO entran por Carlos, los gestiona Elián al 100% (lead intake separado del flujo principal).
- **Slide "Flujo paciente nuevo", paso 10**: redactado con las 3 variantes de la consulta de valoración confirmadas por la CEO. **A** general gratuita (Marisela/Divani), **B** pre-cirugía con especialista externo (2ª valoración con costo pendiente), **C** vía directa con Dr. Cabrera por demanda del paciente desde el inicio = $1,950 (Marisela/Divani no intervienen).
- **Slide "Flujo paciente nuevo", paso 11**: la transición a "Carlos cobra anticipo" ahora reconoce explícitamente las 2 rutas — variante A o tras la 2ª valoración con especialista externo (variante B). La 2ª valoración deja de ser solo nota dentro del paso 10 y queda visible en la secuencia.
- **Sección "Vacíos resueltos por otras entrevistas"**: 10 → 12 entradas. Añadidas 2 resueltas por la CEO: las 3 variantes A/B/C de la consulta de valoración, y el catálogo definitivo de servicios (5 líneas, ~52 procedimientos, hallazgos nuevos: bruxismo, abdominoplastía, lifting facial láser, personal externo Figueroa/Vargas/Ducón).
- **Sección "Puntos de Handoff"**: añadidos 2 handoffs nuevos al final (sin tocar los 6 existentes) — Carlos → Cirujano externo (Figueroa/Vargas/Ducón) en variante B sin canal formal hoy; Carlos ↔ Dra. Elián para leads de obesidad (handoff hoy inexistente).
- **Sección "Fricciones identificadas por análisis"**: añadida fricción nueva al final (sin tocar las 9 existentes) — coordinación con cirujanos externos sin sistema (en variante B Carlos asume agendamiento sin canal formal).
- **Diagrama Mermaid (subgraph VALORACIÓN)**: añadida rama desde el decision "Maricela o Divani dan valoración" para reflejar la variante B — `M --pre-cirugía con externo--> Carlos agenda 2ª valoración --> Figueroa / Vargas / Ducón --acepta--> Carlos cobra anticipo`.

#### `docs/VALIDACION-CATALOGO-ARMC.md` (NUEVO en producción)

- Documento de validación del catálogo de servicios de ARMC, fruto de la entrevista CEO 2026-04-15. 32/32 preguntas resueltas. Incluye registro de decisiones, hallazgos nuevos, estructura definitiva de líneas y catálogo maestro.
- Ajustes finales pre-publicación: limpieza coherente entre el cuerpo del documento y el resumen final ("Pendientes: 0"). Reabierta como pendiente la fila B del bloque 3.7 — la entrevista CEO no precisa si la 2ª valoración con especialista externo es gratuita o de pago. Clarificada fila C: Gabush hace la única valoración cuando el paciente lo pide desde el inicio, Marisela/Divani no intervienen.

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
