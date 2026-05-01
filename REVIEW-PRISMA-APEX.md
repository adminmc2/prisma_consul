# Review Prisma APEX

Documento vivo de revisión de la reorganización de Prisma APEX.

Este archivo centraliza:
- el estado actual de la revisión,
- las decisiones ya cerradas,
- las decisiones condicionales o pendientes,
- los gates entre fases,
- los riesgos abiertos,
- y la bitácora de revisiones.

Regla operativa: después de cada revisión relevante, este documento se actualiza antes de dar por cerrada la iteración.

Vigencia: temporal. Cuando la reorganización quede estabilizada, su contenido debe haberse absorbido en la documentación permanente del proyecto y este archivo se elimina.

## 1. Propósito

Este documento existe para evitar tres problemas:
- perder contexto entre revisiones,
- mezclar decisiones cerradas con hipótesis todavía abiertas,
- y avanzar de fase sin dejar constancia de qué quedó realmente aprobado.

No sustituye a la documentación permanente. Actúa como capa de control y seguimiento mientras dure la reorganización.

## 2. Protocolo de actualización

Después de cada revisión importante, este documento debe actualizarse con estos pasos:

1. Ajustar el estado global del proyecto.
2. Mover decisiones entre "cerradas", "condicionales" y "bloqueantes" según corresponda.
3. Añadir una entrada a la bitácora de revisión.
4. Registrar qué documentos permanentes deben absorber el cambio.
5. Marcar si algún gate de fase se abre o se mantiene bloqueado.

Regla adicional: no se pasa a una fase nueva solo porque el trabajo técnico parezca listo. Se pasa cuando el gate correspondiente esté explícitamente marcado como aprobado aquí.

## 3. Estado global actual

| Campo | Estado actual |
|---|---|
| Proyecto | Reorganización de Prisma APEX |
| Momento actual | Sprint A / Fase 1 cerrada formalmente; Fase 2 autorizada por gate pero no arrancada |
| Naturaleza del trabajo | Revisión cerrada de Fase 1 + ordenamiento operativo entre `main` y `dev` antes de Fase 2 |
| Estado de aprobación | `MODELO-DOMINIO.md` aprobado; `ECOSISTEMA.md` alineado; `CONTRATOS.md` aprobado (C09 cerrado); `GLOSARIO.md` aprobado (C10 cerrado); bloque A de la capa de registro de rutas cerrado; bloques B, C y D cerrados; Fase 1 cerrada formalmente; Fase 2 desbloqueada por gate, pero pendiente de coordinación de ramas antes de ejecución |
| Condición de avance | Gate de Fase 2 cumplido (v3.2.44). **Bloque B PASS** (v3.3.3), **bloque C PASS** (v3.3.8) y **bloque D PASS** tras validación durable en `above-pharma`, `apex-agents`, `prisma-consulting` y `prisma-server-ops` el 2026-04-30. La publicación directa a `main` hasta `v3.2.54` y la continuidad de `dev` hasta `v3.3.19` no reabren Fase 1, pero sí obligan a ordenar la integración entre ramas antes de tocar estructura física. Fase 2 queda pausada operativamente hasta ejecutar `docs/PLAN-COORDINACION-PRE-FASE2.md`. |

### Dictamen operativo vigente

- `MODELO-DOMINIO.md` v4 queda aprobado como primer entregable auditable de Fase 1.
- `CONTRATOS.md`, `GLOSARIO.md`, `REGISTRO-RUTAS.md` y la implementación en `portal/index.html` quedan coherentes entre sí respecto al cierre del bloque A.
- Fase 2 no se ejecuta automáticamente por inercia. Aunque el gate ya está cumplido, su arranque queda pausado hasta reconciliar `main` y `dev` según `docs/PLAN-COORDINACION-PRE-FASE2.md`.
- El bloque B queda cerrado con **PASS**; el cierre efectivo queda documentado en `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` con addendum de sesión humana y decisión Opción A aceptada por revisión.
- El bloque C queda cerrado con **PASS**; `docs/PLAN-FASE2.md` queda aceptado como clasificación archivo por archivo + plan secuencial auditable de Fase 2.
- El bloque D queda cerrado con **PASS**: la réplica Ecosistema ya quedó integrada de forma durable en `above-pharma`, `apex-agents`, `prisma-consulting` y `prisma-server-ops`.
- Fase 1 queda cerrada formalmente.
- El endurecimiento posterior de credenciales GitHub, runbooks y posibles guardrails preventivos queda expresamente fuera de este cierre y no altera el dictamen de Fase 1.
- `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md` queda como checklist base e historial del criterio original del bloque B; el resultado vigente de ejecución vive en `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md`.
- Antes de movimientos físicos o cambios de serving, cada subpaso debe acompañarse de validación runtime específica sobre los contratos y sistemas que toque.
- No hay discrepancia activa sobre el cierre de Fase 1. El problema actual ya no es de aprobación sino de orden operativo: `origin/main` y `origin/dev` divergen y deben reconciliarse antes de ejecutar Fase 2.

## 4. Realidad actual del repo y del sistema

### 4.1 Contratos públicos actuales

- `/` sirve la landing pública.
- `/apex` sirve el discovery actual.
- `/hub` sirve el sistema interno actual.
- `/api/*` expone los endpoints legacy reales.

### 4.2 Realidad técnica actual

- El backend es Express y hoy sirve estáticos desde la raíz del repo.
- El login y la autorización efectiva siguen dependiendo de `role` en JWT y en la tabla `portal_users`.
- El estado de negocio efectivo del sistema sigue dependiendo de `current_phase`, `profile_type` y `apex_submission_id`.
- Los uploads del cliente viven hoy en Google Drive; `portal_files` solo guarda metadata.
- Los entregables publicados de ARMC viven hoy como HTML estático dentro del repo en `portal/analisis/armc/`.
- El discovery actual ya es mixto clínica/distribuidor; no pertenece solo a una vertical.

### 4.3 Consecuencia de revisión

La reorganización no puede tratarse como un simple renombrado de carpetas. Implica compatibilidad de rutas, compatibilidad de modelo, compatibilidad de permisos y continuidad operativa para ARMC.

## 5. Objetivo de esta reorganización

El objetivo no es solo ordenar archivos. El objetivo es alinear el repo y el sistema con el modelo real del producto:

- APEX como producto,
- Prisma APEX como sistema interno donde PRISMA opera,
- verticales como variantes del producto,
- engagement como entidad formal,
- plantillas por tipo de cliente,
- separación entre código, trabajo interno y material publicado,
- y uso explícito de Claude Code como infraestructura del proceso.

## 6. Decisiones cerradas

| ID | Decisión | Resolución actual |
|---|---|---|
| D01 | Naming del sistema interno | `Prisma APEX` |
| D02 | Producto en este repo | Este repo se reorganiza alrededor de APEX; no se prepara estructura multi-producto aquí |
| D03 | Verticales activas | `clinica-multi`, `clinica-personal`, `distribuidor` |
| D04 | Discovery | Núcleo común con packs por vertical |
| D05 | Repositorio principal | `web-de-prisma` sigue siendo el repo principal del producto |
| D06 | Trabajo interno de cliente | Se centraliza en `prisma-trabajo-clientes` como repo privado de texto |
| D07 | Media y binarios pesados | Se mantienen fuera de git |
| D08 | Uploads en Sprint A | Google Drive sigue siendo el backend real de uploads durante Sprint A |
| D09 | Entregables publicados en Sprint A | Viven en este repo, en `prisma-apex/clientes-publicados/[cliente]/` |
| D10 | Membresía | Se introduce `ClientMembership` como modelo nuevo, pero no reemplaza auth legacy en Sprint A |
| D11 | EngagementAccess | Fuera de alcance por ahora; depende de futura centralización de auth |
| D12 | Compatibilidad auth en Sprint A | `role` legacy sigue siendo la verdad efectiva; `client_membership` solo se sincroniza como estructura derivada |
| D13 | URLs públicas | `/`, `/apex`, `/hub`, `/api/*` quedan congeladas durante la reorganización |
| D14 | Revisión continua | Toda decisión importante se contrasta con contratos, modelo de dominio, impacto vertical y buenas prácticas |
| D15 | Claude Code | Se diseña solo para Claude Code; no se abstrae hoy para otras herramientas |
| D16 | Botón "Descargar mis entregables" | Fuera de alcance actual |
| D17 | Sprint de almacén | La migración de uploads a IONOS se separa en un Sprint B posterior |
| D18 | Aprobación del modelo de dominio | `MODELO-DOMINIO.md` v4 queda aprobado como base canónica del modelo y de la compatibilidad de Sprint A |
| D19 | Punteros transitorios en `portal_users` | `cliente_id` y `active_engagement_id` se aceptan solo como conveniencia transitoria para `cliente_user`; `prisma_admin` queda con ambos en NULL |
| D20 | Regla de migración de engagement | Cada cliente identificado con contraparte `cliente_user` genera exactamente un engagement en la migración; caso sin `cliente_user` queda como excepción manual |

## 7. Decisiones condicionales y puntos abiertos

Estos puntos no bloquean el arranque de Fase 1, pero sí condicionan el paso a Fase 2.

| ID | Tema | Estado | Qué falta cerrar | Impacto |
|---|---|---|---|---|
| C01 | Identidad canónica de `Cliente` | Cerrado | Aprobado en `MODELO-DOMINIO.md` v4: entidad `Cliente`, read/write path y no regresión visible definidos | Base canónica cerrada para Sprint A |
| C02 | Compatibilidad `Engagement` / `Vertical` con modelo legacy | Cerrado | Aprobado en `MODELO-DOMINIO.md` v4: mapping legacy, fases verbatim y sincronización definidos | Compatibilidad de modelo cerrada para Sprint A |
| C03 | Serving de `clientes-publicados` tras mover la web a `/web` | Cerrado | Aprobado en `MODELO-DOMINIO.md` v4: contrato `/publicados/[cliente]/...`, redirect legacy y serving explícito definidos | Compatibilidad conceptual de rutas cerrada; pendiente absorción en `CONTRATOS.md` |
| C04 | Alineación de `ECOSISTEMA.md` | Cerrado | Cerrado en commit v3.2.37: ECOSISTEMA.md alineado con MODELO-DOMINIO.md (runtime IONOS vs storage Drive durante Sprint A; flujo de publicación apuntando al repo en `prisma-apex/clientes-publicados/[cliente]/`) | Coherencia documental cerrada |
| C05 | Regla de sincronización `client_membership` | Cerrado | Aprobada en `MODELO-DOMINIO.md` v4: sincronización derivada desde `role` legacy y alcance de transición definidos | Seguridad conceptual de transición cerrada |
| C06 | Diseño detallado de Sprint B | Diferido | Especificar paths, sync IONOS→Drive, fallback y esquema de metadata | Almacén futuro |
| C07 | Costo de la 2ª valoración pre-cirugía con especialista externo | Abierto | Confirmar con CEO si la 2ª cita con Figueroa / Vargas / Ducón es gratuita o se cobra (variante B del flujo de valoración ARMC) | Modelo de Cita y precio del flujo pre-cirugía |
| C08 | Quién agenda variantes B y C de valoración + futuros leads de obesidad | Abierto | Definir en el proceso/sistema APEX si Carlos asume el agendamiento de la 2ª cita pre-cirugía (B), de la cita directa con Gabush (C) y de los leads de obesidad (hoy 100% Dra. Elián), o si la lógica la resuelve el sistema | Diseño de flujo de agendamiento y lead intake |
| C09 | Inventario contractual real en `CONTRATOS.md` | Cerrado | Cerrado en v3.2.43 tras 6 correcciones del revisor: 17 endpoints documentados con shapes exactas, 31 columnas de `apex_submissions` (5 ausentes en `schema.sql`), 3 paths hardcodeados, redirects 301, validación runtime de Fase 2, alineamiento con gate del review | Gate funcional de Fase 2 cumplido |
| C10 | Absorción del vocabulario canónico en `GLOSARIO.md` | Cerrado | Cerrado en v3.2.44: glosario consolidado con 15 secciones cubriendo producto, modelo de datos, roles, términos arquitectónicos, legacy frozen, ecosistema, servicios externos, proceso, contratos, URLs, Claude Code, convenciones y aclaraciones de qué NO es cada término | Coherencia documental cerrada para Fase 1 |
| C11 | Coordinación operativa `main`/`dev` antes de Fase 2 | Abierto | Ejecutar `docs/PLAN-COORDINACION-PRE-FASE2.md`: congelar cambios paralelos, integrar `origin/main` en una rama/worktree temporal desde `origin/dev`, resolver la superficie dual-modificada real (`.gitignore`, archivos blueprint y compartidos), fusionar `CHANGELOG.md` manualmente, desplegar y validar dev antes del subpaso 2.1 | Orden operativo y trazabilidad antes del movimiento físico |

### Gate para pasar a Fase 2

Gate de Fase 2 **cumplido en v3.2.44**: C01, C02, C03, C04, C05, C09 y C10 cerrados. Fase 2 desbloqueada desde el punto de vista de revisión.

**Fase 1 queda cerrada formalmente** tras la integración durable de la sección Ecosistema en `above-pharma`, `apex-agents`, `prisma-consulting` y `prisma-server-ops`, más la presente sincronización final de este review.

**Precondición operativa adicional (2026-05-01):** no arrancar la ejecución de Fase 2 mientras `origin/main` y `origin/dev` sigan divergidos tras `v3.2.54` / `v3.3.19`. Esa reconciliación se rige por `docs/PLAN-COORDINACION-PRE-FASE2.md` y no reabre Fase 1.

**Validación runtime** antes de cada subpaso de Fase 2 que toque contratos reales o sistemas externos (Neon, Drive, Gmail SMTP, Tavily, Groq, Whisper, serving en `dev.prismaconsul.com`, infraestructura nginx/PM2/IONOS) — no es gate global, es prerrequisito de cada subpaso.

## 8. Plan de fases vigente

### Sprint A

#### Fase 1 — Definición y compatibilidad

Objetivo:
- documentar el modelo,
- inventariar contratos reales,
- abstraer paths críticos,
- preparar el terreno sin cambios funcionales visibles.

Entregables esperados:
- `MODELO-DOMINIO.md` — aprobado
- `CONTRATOS.md` — aprobado
- `GLOSARIO.md` — aprobado
- actualización de `CLAUDE.md` — realizada
- actualización de `ECOSISTEMA.md` — realizada
- capa de registro de rutas — cerrada
- smoke tests del slice del registro (bloque B) — aprobados
- bloque C — clasificación archivo por archivo + plan archivo a archivo de Fase 2 — aprobado
- bloque D — modo revisor permanente + replicación Ecosistema — aprobado

Estado actual de la secuencia:
- `MODELO-DOMINIO.md` queda cerrado como primer entregable auditable.
- Los canónicos base y los bloques A, B, C y D quedan cerrados por revisión.
- Fase 1 queda cerrada formalmente.
- El siguiente paso autorizado no es todavía el subpaso 2.1, sino ordenar la integración entre `main` y `dev` conforme a `docs/PLAN-COORDINACION-PRE-FASE2.md`.
- Solo después de ese ordenamiento operativo se ejecuta Fase 2 conforme a `docs/PLAN-FASE2.md` y con validación runtime específica en cada subpaso.

#### Fase 2 — Reorganización física

Solo tras gate aprobado.

Objetivo:
- mover carpetas,
- separar web pública y sistema,
- extraer núcleo común,
- mantener URLs públicas idénticas.

#### Fase 3 — Verticales y plantillas

Objetivo:
- extraer plantillas de ARMC,
- dejar las tres verticales preparadas,
- reducir artesanía por cliente.

#### Fase 4 — Claude Code

Objetivo:
- crear subagentes,
- skills,
- hooks,
- y documentación operativa por carpeta.

### Sprint B

Objetivo:
- migrar el almacén de uploads de Drive a IONOS,
- mantener Drive como espejo para el cliente,
- dejar los archivos accesibles localmente para futuros procesos de IA.

## 9. Riesgos vigentes

| ID | Riesgo | Estado | Mitigación actual |
|---|---|---|---|
| R01 | Paths hardcodeados no inventariados | Activo | Inventario real + capa de registro cerrada + bloque B + test manual antes del movimiento físico |
| R02 | Reorganización rompe ARMC | Activo | Dev primero + bloque B + validación completa cliente/admin antes de cualquier movimiento físico |
| R03 | Modelo nuevo y legacy divergen | Activo | `MODELO-DOMINIO.md` y `CONTRATOS.md` aprobados; falta implementación disciplinada mediante capa única de sincronización en Fase 2 |
| R04 | `Cliente` sigue siendo texto libre demasiado tiempo | Activo | Modelo aprobado; falta materializarlo en migración aditiva de Fase 2 |
| R05 | `/web` deja fuera a los publicados | Activo | Contrato `/publicados/[cliente]/...` aprobado y absorbido en `CONTRATOS.md`; falta ejecutarlo en Fase 2 |
| R06 | Documentación del ecosistema se contradice | Mitigado | C04 cerrado en v3.2.37; ECOSISTEMA.md alineado con MODELO-DOMINIO.md |
| R07 | Sprint B subestimado | Activo | Tratarlo como sprint separado con diseño propio |
| R08 | `main` y `dev` divergen antes de Fase 2 | Activo | Ejecutar `docs/PLAN-COORDINACION-PRE-FASE2.md`, usar un solo agente escritor y prohibir cambios directos a `main` sin reconciliación inmediata hacia `dev` |

## 10. Documentación permanente que debe absorber decisiones

Este archivo es temporal. Sus decisiones deben migrar a documentación estable según su naturaleza:

| Documento | Qué debe absorber |
|---|---|
| `MODELO-DOMINIO.md` | Ya absorbió producto, vertical, engagement, cliente, membresías y compatibilidad base del modelo |
| `CONTRATOS.md` | Ya absorbió URLs públicas congeladas, endpoints reales, redirects legacy, payloads críticos, inventario contractual y cierre del bloque A del registro de rutas; debe revalidarse cuando Fase 2 materialice `/publicados/[cliente]/...` y el redirect desde `/portal/analisis/...` |
| `GLOSARIO.md` | Ya absorbió naming canónico, roles y la distinción entre atributo canónico y conveniencia transitoria; futuras altas terminológicas deben entrar ahí |
| `CLAUDE.md` | Modo revisor permanente, convenciones operativas y reglas del workspace |
| `ECOSISTEMA.md` | Ya quedó alineado con `MODELO-DOMINIO.md`; debe mantenerse consistente con Drive actual, publicados en repo y separación con `prisma-trabajo-clientes` |
| `CHANGELOG.md` | Cambios ya ejecutados, no hipótesis |

### 10.1 Impactos posteriores ya detectados

- `CONTRATOS.md` ya absorbió los contratos congelados `/`, `/apex`, `/hub`, `/api/*`, el inventario contractual real del sistema y el cierre del bloque A del registro de rutas; debe revalidarse cuando Fase 2 materialice `/publicados/[cliente]/...` y el redirect desde `/portal/analisis/...`.
- `CONTRATOS.md` ya deja trazado el estado legacy y actual de los hardcodes del frontend; cualquier hallazgo nuevo en backend o discovery debe añadirse ahí con el mismo criterio factual.
- `GLOSARIO.md` ya absorbió el vocabulario aprobado en `MODELO-DOMINIO.md`; futuras altas terminológicas deben seguir entrando ahí, no en el review.
- `ECOSISTEMA.md` no tiene discrepancia activa; debe revalidarse antes de movimientos físicos para asegurar que no se reintroduzcan contradicciones sobre uploads, publicados y trabajo interno por repo.

### 10.2 Criterio del Revisor Sobre Discrepancias

- Las menciones antiguas en bitácora a C04, C09 o C10 abiertos, o a `CONTRATOS.md` / capa de registro como "siguiente paso", se consideran **histórico de revisión**, no discrepancia activa.
- La fuente de verdad operativa para el estado vigente es esta combinación: sección 3 (estado global), sección 7 (puntos abiertos), el gate de fase correspondiente y la entrada más reciente de bitácora.
- No hay discrepancia activa de gate ni de los bloques A, B, C y D.
- No hay entregables internos abiertos de Fase 1. Los follow-ups operativos separados, como el hardening de credenciales GitHub y posibles guardrails preventivos, no forman parte de este cierre.

### 10.3 Trabajo posterior ya resuelto / follow-up separado

El diferimiento que existió sobre la integración durable del bloque D queda **resuelto**: `apex-agents`, `prisma-consulting` y `prisma-server-ops` ya absorbieron la sección Ecosistema de forma durable en historial y esa condición dejó de ser un punto abierto.

- El endurecimiento operativo de credenciales GitHub, la redacción de runbooks específicos y cualquier guardrail anti-credenciales-en-URL quedan como **follow-up separado**. No forman parte del cierre de Fase 1 ni modifican el estado de aprobación del bloque D.

## 11. Bitácora de revisión

### 2026-04-27 — Inicio del modo revisor

- Se fija el rol del agente como revisor/arquitecto: revisar, analizar, proponer, comprobar, preguntar, definir y concluir antes de ejecutar.
- Se acuerda no tocar el repo en revisiones estratégicas salvo instrucción explícita.

### 2026-04-27 — Primera ronda de revisión estructural

- Se detecta que el acoplamiento a nombres legacy (`apex`, `portal`, `hub`) es más profundo de lo que parecía.
- Se concluye que la reorganización no puede empezar por movimientos físicos.
- Se exige definición y compatibilidad antes de cambios de estructura.

### 2026-04-27 — Corrección del modelo de producto

- Se valida `Prisma APEX` como nombre del sistema interno.
- Se corrige que las verticales son variantes del producto, no productos independientes.
- Se fija la jerarquía `Producto > Vertical > Engagement`.

### 2026-04-27 — Corrección del discovery

- Se confirma que el discovery actual ya es mixto clínica/distribuidor.
- Se descarta asignarlo a una sola vertical.
- Se fija como decisión que el discovery vive en un núcleo común con packs por vertical.

### 2026-04-27 — Corrección de almacenamiento y auth

- Se corrige que Drive es el backend real de uploads hoy.
- Se separa la migración a IONOS como sprint posterior.
- Se corrige que `ClientMembership` no sustituye todavía al auth legacy.
- Se fija compatibilidad explícita: `role` sigue siendo la verdad efectiva en Sprint A.

### 2026-04-27 — Estado vigente para arrancar

- Fase 1 puede comenzar.
- Fase 2 queda condicionada a cerrar C01, C02, C03 y C04.
- Este documento se crea como fuente viva de revisión para acompañar toda la reorganización.

### 2026-04-27 — Aprobación de MODELO-DOMINIO v4

- Qué se revisó: `MODELO-DOMINIO.md` v4 como primer entregable auditable de Fase 1.
- Hallazgos: quedaron resueltas las contradicciones sobre `cliente_id`, `active_engagement_id`, la regla engagement-por-cliente y el write path sin regresión visible.
- Decisiones cerradas afectadas: se añaden D18, D19 y D20; C01, C02, C03 y C05 pasan a cerrados.
- Decisiones abiertas afectadas: C04 sigue abierta; se abren C09 y C10 como impactos posteriores obligatorios.
- Documentos que deben actualizarse: este review queda actualizado; el siguiente entregable del ejecutor debe ser `CONTRATOS.md`; después deberán revisarse `GLOSARIO.md` y `ECOSISTEMA.md`.
- Impacto en gates: Fase 2 sigue bloqueada hasta cerrar C04 y C09.
- Próximo paso: el ejecutor debe producir `CONTRATOS.md` con inventario real de rutas, endpoints, payloads, redirects y hardcodes que deban sobrevivir a la reorganización.

### 2026-04-27 — Cierre de C04 (alineación de ECOSISTEMA.md)

- Qué se revisó: ajustes documentales tras la aprobación de `MODELO-DOMINIO.md` v4 (commit v3.2.37).
- Hallazgos: el revisor identificó tres ajustes mínimos para dejar el bloque cerrado: cerrar C04, eliminar la deuda residual de la sección 15 de `MODELO-DOMINIO.md`, y normalizar el flujo de publicación de `ECOSISTEMA.md`.
- Decisiones cerradas afectadas: C04 pasa a Cerrado.
- Decisiones abiertas afectadas: ninguna nueva. C09 (CONTRATOS.md) y C10 (GLOSARIO.md) siguen abiertas.
- Documentos actualizados: `ECOSISTEMA.md` (flujo de publicación apunta solo al repo), `MODELO-DOMINIO.md` (eliminada deuda residual de sección 15), este `REVIEW-PRISMA-APEX.md` (cierre formal de C04 + actualización de gate Fase 2).
- Impacto en gates: Fase 2 ahora bloqueada únicamente por C09. C04 ya no bloquea.
- Próximo paso: el ejecutor produce `CONTRATOS.md` con inventario real (cierra C09 y abre el avance a Fase 2).

### 2026-04-27 — Consolidación del criterio del revisor tras cierre de C04

- Qué se revisó: coherencia final entre `REVIEW-PRISMA-APEX.md`, `MODELO-DOMINIO.md`, `ECOSISTEMA.md` y `CHANGELOG.md` después del cierre documental de C04.
- Hallazgos: no hay discrepancia activa sobre C04. La observación previa sobre referencias antiguas en bitácora se reclasifica como rastro histórico, no como inconsistencia operativa.
- Decisiones cerradas afectadas: ninguna nueva; se consolida el cierre de C04.
- Decisiones abiertas afectadas: C09 sigue como único bloqueante de Fase 2. C10 sigue abierto como absorción documental de cierre de Fase 1.
- Documentos que deben actualizarse: este review queda consolidado como fuente de verdad operativa; el siguiente entregable sigue siendo `CONTRATOS.md`.
- Impacto en gates: sin cambio funcional; Fase 2 continúa bloqueada únicamente por C09.
- Próximo paso: producir `CONTRATOS.md` con inventario real de rutas, endpoints, payloads, redirects y hardcodes que deban sobrevivir a la reorganización.

### 2026-04-27 — Cierre de C09 (CONTRATOS.md) y desbloqueo del gate de Fase 2

- Qué se revisó: `CONTRATOS.md` v3.2.43 tras 3 pasadas de correcciones del revisor (apex_submissions exhaustivo, alineación de gate, shapes de research-company y submit-form, error path real, conteo interno).
- Hallazgos: el inventario contractual ya refleja el código real (17 endpoints, 31 columnas, 3 paths hardcodeados, redirects 301, validación runtime de Fase 2). El error path de `research-company` documentado correctamente como HTTP 200 con fallback (no 500). El conteo de `apex_submissions` desglosado y sumado explícitamente.
- Decisiones cerradas afectadas: C09 pasa a Cerrado.
- Decisiones abiertas afectadas: C10 sigue abierto (cierre en próxima iteración).
- Documentos actualizados: `CONTRATOS.md` v3.2.43, `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`.
- Impacto en gates: gate de Fase 2 cumplido. Fase 2 desbloqueada por revisión.
- Próximo paso: el ejecutor produce `GLOSARIO.md` para cerrar C10 antes del cierre total de Fase 1.

### 2026-04-27 — Cierre de C10 (GLOSARIO.md) y absorción documental del vocabulario canónico

- Qué se revisó: `GLOSARIO.md` v3.2.44 como entregable de absorción documental que consolida todo el vocabulario aprobado en `MODELO-DOMINIO.md`, `CONTRATOS.md`, `ECOSISTEMA.md` y este review.
- Hallazgos: 15 secciones cubriendo producto y sistema, modelo de datos, roles, términos arquitectónicos, legacy frozen, ecosistema, servicios externos, proceso, contratos, URLs, Claude Code, convenciones, aclaraciones de qué NO es cada término, términos pendientes de definir, y regla de precedencia (canónico > glosario).
- Decisiones cerradas afectadas: C10 pasa a Cerrado.
- Decisiones abiertas afectadas: ninguna nueva. Quedan abiertos los entregables internos de Fase 1 (capa de registro, smoke tests, clasificación, plan archivo a archivo, modo revisor permanente, replicación Ecosistema) que no son gates de Fase 2 sino requisitos del cierre total de Fase 1.
- Documentos actualizados: `GLOSARIO.md` (nuevo), `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`.
- Impacto en gates: gate de Fase 2 sigue cumplido. Cierre total de Fase 1 avanza.
- Próximo paso: el ejecutor produce la especificación de la capa de registro de rutas, prerrequisito técnico del subpaso de Fase 2 que mueve `portal/analisis/armc/`.

### 2026-04-29 — Cierre operativo del bloque A y sincronización del review vivo

- Qué se revisó: estado actual del bloque A tras v3.2.46-v3.2.50 en `portal/index.html`, `REGISTRO-RUTAS.md`, `CONTRATOS.md` y este `REVIEW-PRISMA-APEX.md`.
- Hallazgos: el slice técnico quedó cerrado y coherente; la última deuda ya no estaba en código ni en canónicos permanentes, sino en referencias stale del review vivo que seguían tratando la capa de registro como pendiente.
- Decisiones cerradas afectadas: se consolida el cierre del bloque A (capa de registro de rutas) como entregable interno ya completado de Fase 1.
- Decisiones abiertas afectadas: ninguna nueva. El siguiente entregable interno abierto pasa a ser el bloque B (smoke tests del slice del registro).
- Documentos actualizados: `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, versionado visible del proyecto.
- Impacto en gates: sin cambio funcional. Gate de Fase 2 sigue cumplido; el cierre total de Fase 1 avanza al dejar el review otra vez sincronizado con el repo.
- Próximo paso: el ejecutor produce el bloque B con checklist y primera ejecución, separado en locales, externos con credenciales (`N/A`) y dev/VPS.

### 2026-04-29 — Definición operativa del bloque B

- Qué se revisó: el alcance ya fijado en `REGISTRO-RUTAS.md` y `CONTRATOS.md` para convertirlo en un checklist ejecutable, sin ampliar el scope del slice.
- Hallazgos: la spec ya contenía el criterio funcional; faltaba aterrizarlo en un procedimiento repetible que obligara a validar vista cliente, vista admin, entorno local, bloque `N/A` de externos y entorno dev/VPS.
- Decisiones cerradas afectadas: ninguna nueva.
- Decisiones abiertas afectadas: el bloque B queda definido pero no ejecutado; su cierre sigue pendiente de evidencia runtime.
- Documentos actualizados: `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`, `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, versionado visible del proyecto.
- Impacto en gates: sin cambio. Gate de Fase 2 sigue cumplido; se reduce ambigüedad operativa para el cierre total de Fase 1.
- Próximo paso: el ejecutor ejecuta el checklist del bloque B y entrega matriz completa con resultado `PASS`, `FAIL` o `BLOCKED`.

### 2026-04-29 — Bloque B ejecutado parcialmente y dictamen del revisor: BLOCKED

- Qué se revisó: ejecución del checklist del bloque B por el ejecutor agente sobre commit `ff8036b` v3.3.0, reportada en `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` v3.3.1.
- Hallazgos:
  - El ejecutor agente no dispone de navegador real con DevTools. Aportó evidencia HTTP+probe JS sólida y honesta sobre limitaciones.
  - Probe técnica del contrato `warn + null + optional chaining + guardia en viewers`: 9/9 sub-tests PASS en Node aislado.
  - Bloque externos con credenciales: N/A explícito y justificado.
  - 12 tests visuales (local + dev/VPS, cliente + admin) no alcanzan PASS porque falta sesión humana en navegador real.
  - Dev sirve `v3.2.47`, no el estado validado localmente — no estaba al día.
- Decisiones cerradas afectadas: ninguna nueva.
- Decisiones abiertas afectadas: bloque B recategorizado formalmente a **BLOCKED — visual humana pendiente** (v3.3.2). Probe técnica y N/A se mantienen como evidencia complementaria aceptada.
- Documentos actualizados: `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` (recategorización), este `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, versionado visible.
- Impacto en gates: sin cambio en gate de Fase 2 (sigue cumplido). El cierre total de Fase 1 sigue requiriendo bloque B en estado PASS.
- Próximo paso (3 pasos secuenciales, ninguno opcional, descritos en sección 8 del reporte):
  1. Desplegar dev al estado actual del repo (`ssh prisma@... && git pull && pm2 restart`).
  2. Ejecutar sesión humana mínima en navegador real: 4 sesiones (local cliente, local admin, dev cliente, dev admin) × 3 items obligatorios (Cirujano, Resumen Ejecutivo, Modelo de Datos) = 12 verificaciones visuales.
  3. Añadir addendum corto al reporte con resultado de cada verificación. Si todo PASS, bloque B queda cerrado.
- **No se avanza al bloque C** hasta cerrar el bloque B con PASS limpio.

### 2026-04-29 — Cierre del bloque B con sesión humana (Opción A: solo dev)

- Qué se revisó: ejecución de la sesión humana visual en navegador real, en ventana de incógnito de Chrome contra `https://dev.prismaconsul.com/hub`. Versión validada en dev: `v3.3.1`.
- Hallazgos:
  - 6/6 verificaciones visuales PASS (3 items × 2 vistas: cliente y admin).
  - Errores en consola: solo el warning ignorable de iframe sandbox + ruido de extensión Norton ajeno a la app. Ningún error rojo de código.
  - Probe técnica del contrato `warn + null` (sección 3 del reporte) ya estaba PASS 9/9.
  - Decisión operativa tomada en la sesión: **Opción A — solo dev, omitiendo local**. Justificación: el slice es exclusivamente JS de frontend; local y dev ejecutan código idéntico; probar local es redundante para este cambio. Decisión documentada explícitamente en el addendum del reporte para que el revisor pueda validarla o pedir las 6 verificaciones de local si considera que el umbral lo requiere.
- Decisiones cerradas afectadas: bloque B pasa a **PASS** (con decisión Opción A documentada).
- Decisiones abiertas afectadas: ninguna nueva. Próximo entregable interno autorizado: bloque C (clasificación archivo por archivo + plan archivo a archivo de Fase 2).
- Documentos actualizados: `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` (addendum añadido), este `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, versionado visible.
- Impacto en gates: bloque B cerrado. Cierre total de Fase 1 sigue requiriendo bloques C y D.
- Próximo paso: el ejecutor arranca bloque C — clasificación archivo por archivo del repo (qué se mueve, qué se queda, qué va a `prisma-consulting`) + plan archivo a archivo de Fase 2 (movimientos físicos secuenciales).

### 2026-04-29 — Cierre del bloque C y autorización del bloque D

- Qué se revisó: `docs/PLAN-FASE2.md` tras la entrega inicial del bloque C y las dos rondas de corrección del ejecutor (`v3.3.6` y `v3.3.8`) hasta cerrar los 6 hallazgos del revisor.
- Hallazgos:
  - El plan ya clasifica el repo contra el inventario real de `git ls-files` (98 archivos), corrige la ubicación de la guía interna, define la migración aditiva de BD con DDL ejecutable y deja coherente el serving de `/apex` mediante `static mount`.
  - No quedan contradicciones internas activas entre el subpaso 2.4, la sección 5 y la decisión PF2-3 sobre cómo preservar los assets relativos del discovery.
  - La dirección general del plan queda alineada con `MODELO-DOMINIO.md`, `CONTRATOS.md` y los contratos aprobados de Sprint A.
- Decisiones cerradas afectadas: bloque C pasa a **PASS**.
- Decisiones abiertas afectadas: ninguna nueva. El único entregable interno restante de Fase 1 pasa a ser el bloque D.
- Documentos actualizados: este `REVIEW-PRISMA-APEX.md`, `CHANGELOG.md`, versionado visible del proyecto.
- Impacto en gates: sin cambio en el gate de Fase 2 (ya cumplido). El cierre total de Fase 1 queda condicionado únicamente al bloque D.
- Próximo paso: el ejecutor arranca bloque D — modo revisor permanente en `CLAUDE.md` + replicación Ecosistema en los otros 4 repos.

### 2026-04-30 — Revisión del bloque D y decisión sobre cierre formal de Fase 1

- Qué se revisó: commit `8f2595e` (`v3.3.10`) en `web-de-prisma`, estado actual del working tree local y presencia efectiva de la sección "Ecosistema de repositorios" en `above-pharma`, `apex-agents`, `prisma-consulting` y `prisma-server-ops`.
- Hallazgos:
  - `web-de-prisma` ya incorpora el modo revisor permanente en `CLAUDE.md`.
  - `above-pharma` absorbió la sección Ecosistema de forma durable (commit propio ya empujado).
  - `apex-agents`, `prisma-consulting` y `prisma-server-ops` sí contienen la sección Ecosistema, pero solo como modificación local dentro de working trees con WIP ajeno. La decisión de no commitear esos cambios mezclados con trabajo del usuario fue correcta.
  - Como consecuencia, el bloque D no queda todavía en estado de cierre auditable completo.
- Decisiones cerradas afectadas: ninguna nueva.
- Decisiones abiertas afectadas: el bloque D queda en estado **aplicado parcialmente / integración durable pendiente**. Fase 1 no se cierra formalmente todavía.
- Documentos actualizados: este `REVIEW-PRISMA-APEX.md`.
- Impacto en gates: sin cambio en el gate de Fase 2 (ya cumplido). Fase 2 sigue sin ejecutarse automáticamente.
- Próximo paso: integrar de forma durable la réplica Ecosistema en `apex-agents`, `prisma-consulting` y `prisma-server-ops`, y después cerrar formalmente Fase 1 en este review.

### 2026-04-30 — Diferimiento explícito del cierre durable del bloque D como trabajo posterior

- Qué se revisó: la conveniencia operativa de forzar ahora la integración durable en los 3 repos con WIP frente a posponerla hasta el siguiente contexto natural de commit del usuario.
- Hallazgos:
  - El pendiente restante no es de diseño ni de redacción; es de integración durable en historial.
  - Ejecutarlo ahora con prisa aumenta el riesgo de mezclar WIP ajeno en commits artificiales y reduce la trazabilidad del cambio.
  - Posponerlo no altera el gate ya cumplido de Fase 2, pero sí preserva el bar de aceptación del bloque D y evita declarar cierres que no sean auditables.
- Decisiones cerradas afectadas: ninguna nueva.
- Decisiones abiertas afectadas: el cierre durable del bloque D queda registrado como trabajo posterior planificado; Fase 1 sigue abierta hasta completar esa integración.
- Documentos actualizados: este `REVIEW-PRISMA-APEX.md`.
- Impacto en gates: sin cambio. Fase 2 sigue desbloqueada por gate, pero no se ejecuta automáticamente y Fase 1 no se da por cerrada.
- Próximo paso: cuando el usuario retome `apex-agents`, `prisma-consulting` y `prisma-server-ops`, integrar `CLAUDE.md` en el contexto natural de cada repo y después sincronizar este review para cerrar Fase 1 con el siguiente PATCH libre.

### 2026-04-30 — Validación durable de repos hermanos y cierre formal de Fase 1

- Qué se revisó: integración durable de la sección Ecosistema en `apex-agents` (`7205be7`), `prisma-consulting` (`9ed1324`) y `prisma-server-ops` (`2249f78`), además del estado ya durable de `above-pharma`; tracking `origin/main`; aislamiento del WIP local no relacionado; y normalización suficiente de la autenticación GitHub para cerrar esta iteración.
- Hallazgos:
  - `apex-agents` quedó alineado con `origin/main` en `7205be7` y absorbió de forma durable la sección Ecosistema.
  - `prisma-consulting` quedó alineado con `origin/main` en `9ed1324`; el WIP local no fue arrastrado al commit documental.
  - `prisma-server-ops` quedó alineado con `origin/main` en `2249f78`; el WIP local tampoco fue arrastrado.
  - La condición pendiente del bloque D queda resuelta de forma auditable: los 4 repos hermanos requeridos ya contienen la réplica Ecosistema de forma durable en historial.
  - El hardening posterior de credenciales GitHub y posibles guardrails preventivos se tratará aparte y no bloquea este cierre.
- Decisiones cerradas afectadas: bloque D pasa a **PASS** y Fase 1 queda cerrada formalmente.
- Decisiones abiertas afectadas: ninguna nueva dentro de Fase 1. Fase 2 queda autorizada pero no se ejecuta automáticamente.
- Documentos actualizados: este `REVIEW-PRISMA-APEX.md`.
- Impacto en gates: sin cambio en el gate de Fase 2 (ya cumplido). Se cierra formalmente Fase 1.
- Próximo paso: el ejecutor sincroniza el cierre en el versionado visible y en `CHANGELOG.md` del repo principal usando el siguiente PATCH libre actual (`v3.3.16`) y, si se decide continuar, podrá arrancar Fase 2 conforme a `docs/PLAN-FASE2.md`.

### 2026-05-01 — Orden operativo previo a Fase 2 tras publicación directa a `main`

- Qué se revisó: estado real de `origin/main` (`e50e63f`, `v3.2.54`) frente a `origin/dev` (`f1819ae`, `v3.3.19`), archivos en solapamiento efectivo, estado del review y condiciones mínimas para no arrancar Fase 2 sobre ramas divergidas.
- Hallazgos:
  - Fase 1 sigue cerrada formalmente; la publicación directa a `main` no reabre bloques A-D.
  - La divergencia entre `main` y `dev` sí crea un problema operativo real antes de Fase 2: la comprobación completa arroja 25 rutas, con 8 archivos modificados en ambas ramas (`.gitignore`, `CHANGELOG.md`, `CLAUDE.md`, `index.html`, `portal/index.html` y 3 archivos blueprint de ARMC) y 17 altas solo en `dev` que llegarán como carga de integración.
  - Los archivos del catch-up de producción `docs/VALIDACION-CATALOGO-ARMC.md`, `mapa-fricciones.html`, `cadena-causal.html` y `flujo-atención-paciente.html` ya quedaron absorbidos en `dev`; no son el centro del conflicto actual.
  - El problema principal ya no es de contenido funcional sino de coordinación: dos tracks de versión (`v3.2.x` y `v3.3.x`), dos canales de publicación y múltiples agentes escritores sobre el mismo repo.
- Decisiones del primer corte operativo de C11:
  - El carril repo del ejecutor 1 se limita a `.gitignore`, `CHANGELOG.md`, `CLAUDE.md`, `index.html` y `portal/index.html`; blueprint y contenido ARMC quedan fuera de este corte.
  - `.gitignore` gana `dev`.
  - `CLAUDE.md` y la estructura funcional de `portal/index.html` ganan `dev`.
  - El versionado visible del batch actual queda en `v3.3.19`.
  - `CHANGELOG.md` se resuelve con fusion historica acotada: `dev` como base y preservacion explicita de `v3.2.52`, `v3.2.53` y `v3.2.54` como publicaciones reales de `main`.
- Decisiones cerradas afectadas: ninguna nueva en Fase 1.
- Decisiones abiertas afectadas: se abre C11 como precondición operativa antes del arranque de Fase 2.
- Documentos actualizados: este `REVIEW-PRISMA-APEX.md`, `docs/PLAN-FASE2.md`, `docs/PLAN-COORDINACION-PRE-FASE2.md`, `CLAUDE.md`.
- Impacto en gates: ninguno sobre Fase 1 ni sobre el gate conceptual de Fase 2. La pausa es operativa, no de aprobación.
- Próximo paso: ejecutar `docs/PLAN-COORDINACION-PRE-FASE2.md`, reconciliar `main` y `dev`, desplegar dev reconciliado y solo entonces arrancar Fase 2.

## 12. Plantilla de actualización para futuras revisiones

Usar este formato mínimo cuando se actualice la bitácora:

```md
### YYYY-MM-DD — [nombre corto de la revisión]

- Qué se revisó:
- Hallazgos:
- Decisiones cerradas afectadas:
- Decisiones abiertas afectadas:
- Documentos que deben actualizarse:
- Impacto en gates:
- Próximo paso:
```

## 13. Cierre de este documento

Este archivo se elimina cuando se cumplan estas condiciones:

1. Las decisiones activas ya estén absorbidas por la documentación permanente.
2. La reorganización haya terminado o pasado a estado estable.
3. No existan gates de fase abiertos que dependan de esta bitácora.
4. La bitácora ya no aporte información que no viva en otro documento oficial.