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
| Momento actual | Sprint A / Fase 1 en curso |
| Naturaleza del trabajo | Revisión activa + definición + compatibilidad + cierre progresivo de entregables |
| Estado de aprobación | `MODELO-DOMINIO.md` aprobado; Fase 1 en curso; Fase 2 no aprobada todavía |
| Condición de avance | Cerrar C04 y C09 de la sección 7; completar el inventario contractual real antes de Fase 2 |

### Dictamen operativo vigente

- `MODELO-DOMINIO.md` v4 queda aprobado como primer entregable auditable de Fase 1.
- No se debe ejecutar Fase 2 automáticamente.
- El siguiente entregable obligatorio del ejecutor es `CONTRATOS.md`.
- Antes de movimientos físicos o cambios de serving, deben cerrarse C04 y C09 y quedar trazados sus impactos documentales.

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
| C04 | Alineación de `ECOSISTEMA.md` | Abierto | Corregir contradicciones sobre dónde viven uploads y publicados | Coherencia documental |
| C05 | Regla de sincronización `client_membership` | Cerrado | Aprobada en `MODELO-DOMINIO.md` v4: sincronización derivada desde `role` legacy y alcance de transición definidos | Seguridad conceptual de transición cerrada |
| C06 | Diseño detallado de Sprint B | Diferido | Especificar paths, sync IONOS→Drive, fallback y esquema de metadata | Almacén futuro |
| C07 | Costo de la 2ª valoración pre-cirugía con especialista externo | Abierto | Confirmar con CEO si la 2ª cita con Figueroa / Vargas / Ducón es gratuita o se cobra (variante B del flujo de valoración ARMC) | Modelo de Cita y precio del flujo pre-cirugía |
| C08 | Quién agenda variantes B y C de valoración + futuros leads de obesidad | Abierto | Definir en el proceso/sistema APEX si Carlos asume el agendamiento de la 2ª cita pre-cirugía (B), de la cita directa con Gabush (C) y de los leads de obesidad (hoy 100% Dra. Elián), o si la lógica la resuelve el sistema | Diseño de flujo de agendamiento y lead intake |
| C09 | Inventario contractual real en `CONTRATOS.md` | Abierto | Auditar y documentar rutas públicas, endpoints, payloads, redirects, paths hardcodeados y consumers que deben sobrevivir a la reorganización a la luz de `MODELO-DOMINIO.md` aprobado | Gate funcional antes de Fase 2 |
| C10 | Absorción del vocabulario canónico en `GLOSARIO.md` | Abierto | Trasladar términos ya aprobados (`Cliente`, `ClientMembership`, `Engagement`, `atributo canónico`, `conveniencia transitoria`) para evitar deriva terminológica | Coherencia documental e implementación futura |

### Gate para pasar a Fase 2

Fase 2 solo puede aprobarse cuando C04 y C09 estén marcados como cerrados en este documento. C10 debe quedar absorbido antes del cierre total de Fase 1.

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
- `CONTRATOS.md` — siguiente entregable obligatorio
- `GLOSARIO.md`
- actualización de `CLAUDE.md`
- actualización de `ECOSISTEMA.md`
- capa de registro de rutas
- plan archivo a archivo de Fase 2

Estado actual de la secuencia:
- `MODELO-DOMINIO.md` queda cerrado como primer entregable auditable.
- El siguiente paso del ejecutor debe ser `CONTRATOS.md`.

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
| R01 | Paths hardcodeados no inventariados | Activo | Inventario real + capa de registro + test manual al final de Fase 2 |
| R02 | Reorganización rompe ARMC | Activo | Dev primero + gate antes de Fase 2 + validación completa cliente/admin |
| R03 | Modelo nuevo y legacy divergen | Activo | `MODELO-DOMINIO.md` aprobado; falta `CONTRATOS.md` + implementación disciplinada mediante capa única de sincronización |
| R04 | `Cliente` sigue siendo texto libre demasiado tiempo | Activo | Modelo aprobado; falta materializarlo en migración aditiva de Fase 2 |
| R05 | `/web` deja fuera a los publicados | Activo | Contrato `/publicados/[cliente]/...` aprobado; falta absorberlo en `CONTRATOS.md` y ejecutarlo en Fase 2 |
| R06 | Documentación del ecosistema se contradice | Activo | Cerrar C04 en Fase 1 |
| R07 | Sprint B subestimado | Activo | Tratarlo como sprint separado con diseño propio |

## 10. Documentación permanente que debe absorber decisiones

Este archivo es temporal. Sus decisiones deben migrar a documentación estable según su naturaleza:

| Documento | Qué debe absorber |
|---|---|
| `MODELO-DOMINIO.md` | Ya absorbió producto, vertical, engagement, cliente, membresías y compatibilidad base del modelo |
| `CONTRATOS.md` | Debe absorber URLs públicas, endpoints reales, redirects legacy, payloads críticos, paths hardcodeados y contratos no rompibles derivados del modelo aprobado |
| `GLOSARIO.md` | Debe absorber naming canónico, roles y la distinción entre atributo canónico y conveniencia transitoria |
| `CLAUDE.md` | Modo revisor permanente, convenciones operativas y reglas del workspace |
| `ECOSISTEMA.md` | Debe alinearse con la relación entre repos, Drive actual, publicados en repo y separación con `prisma-trabajo-clientes` |
| `CHANGELOG.md` | Cambios ya ejecutados, no hipótesis |

### 10.1 Impactos posteriores ya detectados

- `CONTRATOS.md` debe revisar expresamente los contratos congelados `/`, `/apex`, `/hub`, `/api/*`, el futuro contrato `/publicados/[cliente]/...`, el redirect desde `/portal/analisis/...`, y los payloads legacy que no pueden romperse durante la transición.
- `CONTRATOS.md` debe inventariar los hardcodes activos en frontend y backend que hoy atan paths, fases o recursos publicados al estado legacy.
- `GLOSARIO.md` debe absorber el vocabulario aprobado en `MODELO-DOMINIO.md` para que implementación y documentación usen los mismos términos.
- `ECOSISTEMA.md` debe revisarse después de `CONTRATOS.md` para no reintroducir contradicciones sobre uploads, publicados y trabajo interno por repo.

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