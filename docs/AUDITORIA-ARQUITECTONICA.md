# Auditoría arquitectónica — `web-de-prisma`

> **Estado:** vigente (snapshot puntual) · **Fecha:** 2026-05-23 · **Base:** rama `dev`, `v3.3.70`.
> Diagnóstico arquitectónico del proyecto realizado a petición del usuario tras detectar
> deriva documental crónica. No es contrato ni doctrina; es **fotografía con evidencia y
> propuesta de remediación priorizada**. No reemplaza ningún documento canónico.

## Índice

1. Inventario (números crudos)
2. Diagnóstico del código
3. Diagnóstico del corpus documental
4. Diagnóstico del setup Claude Code / VSCode
5. Raíz estructural de la deriva
6. Propuesta de remediación priorizada
7. Lo que NO se ha mirado

---

## 1. Inventario (números crudos)

**Archivos de código fuente > 500 líneas** (excluyendo binarios, `docs/historico/` y `REVIEW-PRISMA-APEX.md`):

| Archivo | Líneas |
|---|---|
| `web/css/styles.css` | 4.700 |
| `shared/fonts/phosphor/phosphor.css` | 4.627 (fuente icónica, generado, no escrito a mano) |
| `server/lib/pain-knowledge-base.js` | 4.579 |
| `prisma-apex/index.html` | **3.830** |
| `prisma-apex/core/discovery-engine/form.js` | 3.591 |
| `prisma-apex/core/discovery-engine/form.css` | 2.850 |
| `web/js/main.js` | 1.182 |
| `prisma-apex/core/discovery-engine/index.html` | 1.115 |
| `server/routes/apex.js` | 920 |
| `prisma-apex/core/simulador-ux/capa-1-ux/index.html` | 912 |
| `prisma-apex/clientes-publicados/armc/blueprint/modelo-datos.html` | 912 |
| (varios `flujo-*.html` ARMC) | 711–951 |
| `server/routes/portal.js` | 592 |
| `web/index.html` | 840 |

**Monolito más sintomático**: `prisma-apex/index.html` (3.830 líneas) — un `<style>` de **974 líneas** (líneas 30–1.298) y un `<script>` de **2.533 líneas** (líneas 1.299–3.830) embebidos en el mismo fichero.

**Corpus documental vigente** (sin `docs/historico/` ni `REVIEW-PRISMA-APEX.md`):

- Raíz: CHANGELOG 2.758 · CONTRATOS 810 · MODELO-DOMINIO 722 · GLOSARIO 434 · CLAUDE 420 · ECOSISTEMA 307 · REGISTRO-RUTAS 176 · README 112 = **5.739 líneas**.
- `docs/`: NOMENCLATURA 437 · GUIA-NUEVAS-SECCIONES 368 · PROPUESTA-SIMULADOR 218 · OPERATIVA 154 = **1.177 líneas**.
- **Total ≈ 6.916 líneas de Markdown vigente** que hay que mantener consistente a mano.

**Estado de `.claude/`**:

- `settings.json` (85 líneas): un único hook PreToolUse + 59 entradas en `permissions.allow`.
- `settings.local.json` (47 líneas): otras 42 entradas de permisos personales.
- `hooks/recordar-revisar-docs.sh` (28 líneas): hook que detecta cambios estructurales en `git commit` y añade un recordatorio. No bloquea.
- `skills/revisar-docs/SKILL.md` (62 líneas): único skill.
- `agents/`: **no existe** el directorio. **Cero subagentes**.
- `claude-code-chat-images/`: ~30 PNGs locales **no versionados** (`.gitignore` con `*`).

**Toolchain**: `package.json` raíz tiene 2 dependencias y **ningún script**. `server/package.json` solo declara `start` y `dev`. **No hay linter, formatter, tests ni CI**. `.github/` solo contiene `dependabot.yml`.

---

## 2. Diagnóstico del código

### 2.1 El monolito del Hub — `prisma-apex/index.html`

3.830 líneas en un solo HTML. Composición:

- HTML estructural: ~325 líneas.
- CSS embebido: **974 líneas** (líneas 30–1.298).
- JavaScript embebido: **2.533 líneas** (líneas 1.299–final).

En ese único fichero conviven estilos del sistema de diseño, login, navegación, lógica de tabs, render de tarjetas, gestión de iframes, lógica de admin ("User Detail") y carga de cada sección de análisis.

**Duplicación literal**, no hipotética. En `prisma-apex/index.html:3704-3795` hay dos familias paralelas de funciones que hacen exactamente lo mismo, una para la pestaña pública y otra para el panel admin:

```
3704  function analisisOpenSection(sectionId) { ... }
3720  function analisisShowSections()         { ... }
3727  function analisisShowRoles()            { ... }
3733  function analisisOpenItem(itemId, ...)  { ... }
...
3757  function udAnalisisOpenSection(sectionId)  { ... }   ← clon
3773  function udAnalisisShowSections()           { ... }   ← clon
3780  function udAnalisisShowRoles()              { ... }   ← clon
3786  function udAnalisisOpenItem(itemId, ...)    { ... }   ← clon
```

Cuerpos prácticamente idénticos, solo cambia el prefijo `ud` en los IDs del DOM. Cualquier cambio de comportamiento debe hacerse dos veces o se rompe la simetría en silencio.

**Mezcla de capas**: en el mismo archivo se mezclan *presentación* (CSS), *estructura* (HTML), *comportamiento* (JS), *datos de negocio* (catálogos `ANALISIS_SECTIONS`, `ANALISIS_DIAGNOSTICO`, `ANALISIS_BLUEPRINT`) y *rutas de servir* (paths a entregables). Cuatro responsabilidades en un único fichero.

**Riesgo concreto**: con 2.533 líneas de JS global y >50 IDs DOM referenciados, modificar este archivo con un LLM o con un colaborador nuevo tiene riesgo lateral alto. No hay sistema de tipos, no hay tests, los bugs se detectan visualmente al recargar `/hub`.

### 2.2 Discovery engine

`prisma-apex/core/discovery-engine/index.html` (1.115 líneas) **sí separa** HTML del JS — referencia `signal-detector.js` (394 líneas) y `form.js` (3.591 líneas). Es una mejora respecto al Hub. Pero `form.js` con 3.591 líneas y un solo objeto `CONFIG` global sigue siendo un monolito JS sin módulos: todo es global, no se importa con ESM.

### 2.3 Backend — `server/`

Aquí la arquitectura **sí está modular y limpia**. `server/server.js` (139 líneas) solo declara middleware, monta rutas y sirve estáticos. Las rutas están bien separadas: `routes/portal.js`, `routes/apex.js`, `routes/ai.js`, middlewares en `middleware/`, helpers en `lib/`. **Es el área menos preocupante del repo.**

Matiz: `server/lib/pain-knowledge-base.js` con 4.579 líneas es un *catálogo de datos* (constantes), no lógica. Defendible, pero es **dato disfrazado de código** — ningún test puede validar unicidad/coherencia porque vive embebido en JS. Lo mismo aplica al diccionario `SITUACIONES` en `server/routes/apex.js:17-67`.

### 2.4 Web pública

`web/css/styles.css` (4.700) y `web/js/main.js` (1.182) son grandes pero al menos están separados por tipo de archivo. No es lo más preocupante; sí es candidato a fragmentación cuando se aborde.

### 2.5 Lo que NO existe en el código

- Ningún `.test.js`, `.spec.js`, `vitest`, `jest`, ni carpeta `tests/`.
- Ningún `.eslintrc`, `.prettierrc`, `tsconfig`.
- Ningún workflow de CI en `.github/workflows/` — solo `dependabot.yml`.
- Ningún `build` step.

**Defendible para una landing estática. No defendible para `/hub` con login, JWT, subida a Drive y entrega a clientes reales.** Un cambio en el JS del Hub no tiene ninguna red de seguridad automática.

---

## 3. Diagnóstico del corpus documental

### 3.1 Tamaño y solapamiento

CONTRATOS (810) + MODELO-DOMINIO (722) + GLOSARIO (434) + CLAUDE (420) + ECOSISTEMA (307) + REGISTRO-RUTAS (176) cubren un mismo territorio con secciones que se pisan:

- **Rutas/URLs**: aparecen en `CONTRATOS.md:40-118` (§3 URLs públicas), en `REGISTRO-RUTAS.md` (los 176 enteros), en `CLAUDE.md:70-148` (Architecture + Directory Structure) y en `server/server.js:51-130` como código. **Cuatro lugares**, ninguno generado del otro.
- **Modelo de datos**: prosa en `MODELO-DOMINIO.md` §3 (líneas 46–202), de nuevo en `CONTRATOS.md` §5 (líneas 358–501) y reapuntado en `CLAUDE.md` §"Database Tables" (líneas 215–229). **Tres lugares.**
- **Glosario de conceptos**: `GLOSARIO.md` los define, `MODELO-DOMINIO.md` los redefine al usarlos, `CLAUDE.md` los menciona, `ECOSISTEMA.md` los recombina por flujos.
- **Modo operativo**: `docs/OPERATIVA.md` (154 líneas, fija ahora), pero `CLAUDE.md:46-69` aún contiene una sección "Modo de trabajo en dos carriles" que el propio commit `98c2e8a` declara *superado*.

### 3.2 Mezcla de estado actual con narrativa histórica

`CLAUDE.md` mezcla "lo que el repo es ahora" con decisiones de Sprint A. Ejemplo: `CLAUDE.md:83` es una sola línea de **712 caracteres** que arrastra historia de subpasos (`v3.3.25`, `v3.3.37`, `v3.3.38`, `v3.3.42`) dentro de la "Estructura vigente". Lo histórico debería estar en CHANGELOG; lo vigente debería ser una foto sin fechas. Aquí están fusionados.

`CONTRATOS.md` declara "contratos *congelados*", pero §5.5 habla de "Tablas del modelo de dominio (aditivas, creadas en `v3.3.38`)" — mezcla de contrato congelado con historia de cuándo se creó. La línea entre "qué hay" y "cómo llegamos aquí" no está clara.

### 3.3 Falta de generación automática

Ninguno de los seis documentos canónicos se genera desde el código. Las rutas reales viven en `server/server.js`; el doc las repite a mano. El esquema de BD vive en migraciones/código; el doc lo repite a mano. Los paths hardcodeados (CONTRATOS §6.1, líneas 507–543) son una **lista escrita a mano** de algo que vive como código fuente.

**Esto es lo que hace inevitable la deriva.** Cuando una fuente cambia y las otras son réplicas humanas, alguien las olvida — siempre.

### 3.4 CHANGELOG monstruoso

`CHANGELOG.md` son 2.758 líneas sin índice ni separación por fase/sprint. Buscar "cuándo introdujimos `/shared/`" obliga a grep — y `CLAUDE.md:83` ya lo cita explícitamente porque buscar no es trivial.

---

## 4. Diagnóstico del setup Claude Code / VSCode

### 4.1 Lo que hay

- `.claude/settings.json` con un único hook (recordatorio anti-deriva) y un único skill (`revisar-docs`).
- 59 entradas en `permissions.allow` + 42 en `settings.local.json`.

### 4.2 Síntomas en `permissions.allow`

La lista no es de patrones generales sino una **caja de cosas específicas que un día se permitió**:

```
"Bash(sed -i.bak 's|· v3\\.3\\.35|· v3.3.36|g' web/index.html)"
"Bash(sed -i.bak 's|· v3\\.3\\.37|· v3.3.38|g' web/index.html)"
"Bash(sed -i.bak 's|· v3\\.3\\.38|· v3.3.39|g' web/index.html)"
"Bash(awk '{print \"  web: \"$0}')"
"Bash(awk '{print \"  prisma-apex: \"$0}')"
"Bash(awk '{print \"  CLAUDE.md: \"$0}')"
```

Esto no es defensa en profundidad — es ruido. Cada bump de versión añade tres entradas más. En vez de un patrón `Bash(sed -i.bak *)` o un script `bump-version.sh` autorizado una vez, hay literales por subpaso.

### 4.3 Lo que falta

- **`.claude/agents/` no existe**. El glosario y la operativa imaginan subagentes especializados, pero no hay ninguno creado.
- **Skills ausentes**: `ECOSISTEMA.md` §"Flujos cruzados típicos" (líneas 234–272) describe Flujo A (nuevo cliente), B (procesar entrevista), C (generar entregable), D (evolucionar metodología), E (mantenimiento). **Ninguno está plasmado como skill.** Solo existe `/revisar-docs`.
- **Sin hooks de calidad**: no hay PreToolUse que ejecute formato o lint al editar, no hay PostToolUse que verifique nada. El único hook es informativo.
- **Sin statusline** que muestre versión actual / rama / estado.
- **Sin MCPs activos** configurados específicamente al flujo.

### 4.4 VSCode

`.vscode/settings.json` solo tiene `"claudeCodeChat.permissions.yoloMode": true`. No hay configuración de formato al guardar, no hay tareas, no hay extensiones recomendadas. Cada developer configura lo suyo en su cabeza.

---

## 5. Raíz estructural de la deriva documental

No es "se nos olvida actualizar". Hay **cuatro fallas estructurales** encadenadas:

1. **Múltiples fuentes de verdad para la misma información, todas escritas a mano.** Las rutas viven simultáneamente como código (`server/server.js`), como tabla en `CONTRATOS.md §3`, como spec en `REGISTRO-RUTAS.md`, y como árbol descriptivo en `CLAUDE.md §83`. Cuando una de las cuatro cambia, las otras tres no tienen forma automática de enterarse. **Esto garantiza deriva matemáticamente.**

2. **Ningún documento se genera desde el código.** Todo doc es prosa humana. La mejor documentación es la que no se puede desincronizar porque se genera.

3. **Monolitos = imposible documentar por bloques.** `prisma-apex/index.html` no se puede documentar parcialmente: como todo está mezclado, cualquier doc que lo describa tiene que describirlo todo. Si estuviera dividido en `hub/login.js`, `hub/tabs.js`, `hub/analisis.js`, cada uno podría tener su README de 30 líneas que se mantiene solo. **La documentación monolítica deriva más rápido que la modular** porque tiene más superficie por commit.

4. **Estado actual y narrativa histórica mezclados.** Cuando una fase termina, no hay mecanismo para *mover* esa frase del doc vigente al histórico. Los docs vigentes acumulan capas geológicas y se vuelven más largos con cada sprint — lo cual reduce aún más la probabilidad de que alguien los lea entero — y la deriva se acelera.

A esto se suma una falla blanda: **no existe ningún test automático** que falle cuando un doc menciona una ruta o un archivo inexistente. El skill `revisar-docs` cubre esto manualmente, pero solo cuando se invoca.

---

## 6. Propuesta de remediación priorizada

### Nivel 1 — Sangra ahora (1–2 semanas, impacto alto, riesgo bajo)

Operaciones reversibles que preservan el comportamiento visible del producto.

1. **Extraer CSS y JS del Hub a archivos separados.** Mover el `<style>` de `prisma-apex/index.html:30-1298` a `prisma-apex/hub.css` y el `<script>` (líneas 1.299–3.830) a archivos JS por dominio (`hub-login.js`, `hub-tabs.js`, `hub-analisis.js`, `hub-admin.js`, `hub-helpers.js`). **Resuelve** el archivo más grande y más mezclado del repo. **Esfuerzo**: 1–2 días.

2. **Deduplicar funciones `analisis*` vs `udAnalisis*`** (líneas 3704-3795). Extraer una factoría `crearControladorAnalisis(prefix)`. **Esfuerzo**: medio día.

3. **Crear los subagentes ya nombrados.** El glosario y la operativa describen `revisor`, `plantillador`, `entrevistador`, `auditor-rutas` pero no existen. Materializar al menos `revisor` y `auditor-rutas` como `.claude/agents/*.md`. **Esfuerzo**: 1 día. **Riesgo**: cero (aditivo).

4. **Crear skills para los flujos ya documentados** en `ECOSISTEMA.md`: `/nuevo-cliente`, `/procesar-entrevista`, `/generar-entregable`. **Esfuerzo**: 1–2 días.

5. **Limpiar `permissions.allow`.** Reemplazar los `sed -i.bak '...version...'` específicos por un patrón `Bash(sed -i.bak * web/index.html)` o un script `scripts/bump-version.sh` autorizado una vez. **Esfuerzo**: 2 horas.

6. **Hook `PreToolUse` que valide que los docs no rompen el árbol.** Antes de un commit que toque `*.md`, `grep` de las rutas mencionadas contra el árbol real. Si menciona un archivo que no existe, avisa. **Esfuerzo**: medio día.

### Nivel 2 — Importante pero no urgente (1–2 meses, impacto alto, riesgo medio)

7. **Generar el bloque §3 de CONTRATOS y todo `REGISTRO-RUTAS.md` desde `server/server.js`.** Un script `scripts/gen-rutas.js` lee el código y emite el Markdown. CI falla si el doc difiere del generado. **Esfuerzo**: 2–3 días.

8. **Generar §"Database Tables" desde un único sitio** (un `db/schema.sql` o migraciones versionadas como fuente). **Esfuerzo**: 3–5 días.

9. **Separar `CLAUDE.md` en dos archivos**: `CLAUDE.md` (foto del estado vigente, ≤150 líneas, sin historia) y `docs/historico/SPRINT-A-evolucion.md`. Criterio de purga: si la frase contiene una versión, va al histórico. **Esfuerzo**: 1 día.

10. **Fragmentar `CHANGELOG.md` por sprint** (`docs/changelog/sprint-A.md`, etc.). **Esfuerzo**: medio día.

11. **Fragmentar `web/css/styles.css`** por sección. **Esfuerzo**: 1 día.

### Nivel 3 — Cuando llegue el momento (3+ meses, refactor profundo)

12. **Migrar `prisma-apex/index.html` a componentes** sin framework: módulos ESM nativos, un `<template>` por componente. **Precondición**: paso 1 ya hecho.

13. **Introducir testing**: al menos un `playwright` que abra `/hub`, haga login y verifique las tres pestañas. Y tests de API con `node:test` para `server/routes/*.js`.

14. **Pipeline de CI mínimo** en GitHub Actions: linter, tests, validación de docs generados. **Sin esto, todo lo demás depende de disciplina humana.**

15. **Considerar build pipeline** (esbuild/vite) solo cuando el proyecto haya cruzado la barrera de tener tests.

16. **Mover el catálogo `PAIN_CATALOG`** a `server/data/pain-catalog.json` + loader. Permite validación con `jq`. Misma idea para `SITUACIONES`.

---

## 7. Lo que NO se ha mirado

- **`server/lib/domain-sync.js` (323), `server/routes/portal.js` (592), `server/routes/ai.js` (120)** — el veredicto de "backend limpio" se basa en `server.js` y la cabecera de `apex.js`.
- **`web/js/main.js` (1.182) y `web/index.html` (840)** — el veredicto sobre la web pública es por tamaño, no por contenido.
- **`form.css` (2.850) y `form.js` (3.591)** más allá de la cabecera — pueden tener problemas similares al Hub o estar mejor estructurados.
- **Migraciones de BD reales** ni el código que crea las tablas. Las afirmaciones sobre el esquema son de los docs, no del código.
- **`prisma-apex/clientes-publicados/armc/`** salvo conteo de líneas.
- **`docs/PROPUESTA-SIMULADOR-NATIVO-HUB.md` ni el `README.md` del simulador**. La parte del simulador es solo por tamaño.
- **Funcionamiento real del hook** `recordar-revisar-docs.sh` en vivo (sintaxis `if` de Claude Code).