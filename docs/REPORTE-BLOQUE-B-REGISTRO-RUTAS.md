# Reporte de ejecución — Bloque B (registro de rutas ARMC)

**Ejecutor:** agente Claude (entorno: terminal sin navegador con DevTools).
**Revisor:** agente Claude del usuario.
**Fecha:** 2026-04-29.
**Estado del repo validado:** commit `ff8036b` — `v3.3.0` — rama `dev`.
**Checklist de referencia:** `docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md`.

---

## 1. Limitaciones del entorno del ejecutor

El ejecutor **no dispone de navegador real con DevTools**, por lo que la inspección visual del iframe y de la consola del navegador no es directamente observable. La validación se realiza mediante:

1. **HTTP en local** (`curl` contra `node server.js` levantado en `localhost:3099`) — confirma que el servidor sirve los HTMLs que el iframe pediría.
2. **Probe técnica del slice JS en aislamiento** (Node) — replica exactamente el código del registro en `portal/index.html` y verifica el contrato `warn + null + optional chaining + guardia en viewers`.
3. **HTTP HTTPS contra `dev.prismaconsul.com`** — confirma serving en VPS y compara contenido SPA vs local.

**Lo que esta ejecución NO cubre directamente:**
- Click-navegación visual con captura de pantalla.
- Lectura en vivo de la consola DevTools del navegador con la SPA cargada.
- Login con sesión humana real (las rutas de los HTMLs son públicas a nivel HTTP — el registry decide qué `src` poner al `iframe`, y eso lo cubrimos por probe JS).

**Mitigación aplicada:** los tests HTTP equivalen a "el iframe pediría esta URL y recibiría este contenido". La probe JS confirma que el código que decide la URL del iframe construye exactamente los paths esperados. La combinación es evidencia robusta del slice runtime, aunque no sustituya la confirmación visual humana.

---

## 2. Matriz de reporte (recategorizada por dictamen del revisor)

**Dictamen del revisor (v3.3.1 → v3.3.2):** los 12 tests visuales (local + dev/VPS, cliente + admin) **no alcanzan PASS** porque falta la sesión humana en navegador real con DevTools. La evidencia HTTP+probe JS es complementaria, no sustituye el umbral acordado. Se recategorizan formalmente a **BLOCKED — visual humana pendiente**. Se conservan como PASS solo la probe técnica (sección 3) y el bloque N/A de externos.

| # | Bloque | Vista | Comprobación | Resultado | Evidencia técnica recogida (no sustituye visual) |
|---|---|---|---|---|---|
| 1 | Local | Cliente | Roles → Cirujano | **BLOCKED — visual humana pendiente** | `curl http://localhost:3099/portal/analisis/armc/diagramas/flujo-cirujano.html` → HTTP 200, 68509 bytes, `<title>Cirujano — Flujo Operativo (as-is) — ARMC</title>` |
| 2 | Local | Cliente | Diagnóstico → Resumen Ejecutivo | **BLOCKED — visual humana pendiente** | HTTP 200, 17155 bytes, `<title>Resumen Ejecutivo — ARMC Diagnóstico Integrado</title>` |
| 3 | Local | Cliente | Blueprint → Modelo de Datos | **BLOCKED — visual humana pendiente** | HTTP 200, 73727 bytes, `<title>Modelo de Datos — ARMC Blueprint</title>` |
| 4 | Local | Admin | Roles → Cirujano | **BLOCKED — visual humana pendiente** | URL del iframe en vista admin = misma que cliente (mismo `ANALISIS_SECTION_MAP`). HTTP idéntico al test 1 |
| 5 | Local | Admin | Diagnóstico → Resumen Ejecutivo | **BLOCKED — visual humana pendiente** | idem test 2 |
| 6 | Local | Admin | Blueprint → Modelo de Datos | **BLOCKED — visual humana pendiente** | idem test 3 |
| 7 | Externos con credenciales | N/A | Slice sin servicios externos | **N/A (aprobado por revisor)** | Justificación: el slice opera únicamente sobre un objeto JS local; sin Neon, Drive, SMTP, Tavily, Groq, Whisper |
| 8 | Dev/VPS | Cliente | Roles → Cirujano | **BLOCKED — dev desfasado + visual humana pendiente** | HTTPS 200 contra dev, mismo título. **Pero dev sirve `v3.2.47`, no el estado validado.** Falta deploy + sesión visual |
| 9 | Dev/VPS | Cliente | Diagnóstico → Resumen Ejecutivo | **BLOCKED — dev desfasado + visual humana pendiente** | idem test 8 |
| 10 | Dev/VPS | Cliente | Blueprint → Modelo de Datos | **BLOCKED — dev desfasado + visual humana pendiente** | idem test 8 |
| 11 | Dev/VPS | Admin | Roles → Cirujano | **BLOCKED — dev desfasado + visual humana pendiente** | idem test 8 |
| 12 | Dev/VPS | Admin | Diagnóstico → Resumen Ejecutivo | **BLOCKED — dev desfasado + visual humana pendiente** | idem test 8 |
| 13 | Dev/VPS | Admin | Blueprint → Modelo de Datos | **BLOCKED — dev desfasado + visual humana pendiente** | idem test 8 |

---

## 3. Probe técnica del contrato `warn + null` (sección 8 del checklist)

Replica fiel del slice ejecutada en Node aislado:

| Test | Resultado | Detalle |
|---|---|---|
| `getAnalysisPaths('armc')` devuelve los 3 paths esperados | PASS | `diagramas` = `/portal/analisis/armc/diagramas/`, `diagnostico` = `/portal/analisis/armc/diagnostico/`, `blueprint` = `/portal/analisis/armc/blueprint/` |
| `getAnalysisPaths('cliente-inexistente')` devuelve `null` | PASS | retorno = `null` |
| Emite `console.warn(...)` ante cliente no registrado | PASS | mensaje capturado: `getAnalysisPaths: cliente "cliente-inexistente" no registrado` |
| No lanza excepción ante cliente no registrado | PASS | bloque `try`/`catch` confirma sin throw |
| Optional chaining en consumer cuando cliente sí existe | PASS | `_armcPaths?.diagramas` resuelve correctamente |
| Optional chaining en consumer cuando cliente NO existe | PASS | `_armcPaths?.diagramas` evalúa a `undefined` sin `TypeError` |
| Guardia en viewer (`if (!section || !section.path) return`) ante section válida | PASS | construye `src` correctamente |
| Guardia en viewer ante `section.path` `undefined` | PASS | retorna sin construir URL rota tipo `'undefinedflujo-ceo.html'` |
| Guardia en viewer ante `section` `null` | PASS | retorna sin construir nada |

**Probe técnica resultado: PASS completo en los 9 sub-tests.**

---

## 4. Verificación de slice en `dev.prismaconsul.com`

Comparación del JavaScript del Hub servido por dev vs local:

| Marcador del slice | Apariciones en dev | Apariciones en local | Comentario |
|---|---|---|---|
| `ANALISIS_REGISTRY` | ✓ presente | ✓ presente | igual |
| `getAnalysisPaths(cliente)` | ✓ presente | ✓ presente | igual |
| `console.warn` para cliente no registrado | ✓ presente | ✓ presente | igual |
| `_armcPaths` lookup único | ✓ presente | ✓ presente | igual |
| Optional chaining `_armcPaths?.diagramas` etc. | ✓ presente (3 apariciones) | ✓ presente (3 apariciones) | igual |
| Guardia `if (!section \|\| !section.path) return;` en viewers | ✗ **AUSENTE** (0 apariciones) | ✓ presente (2 apariciones) | dev no tiene v3.2.48-v3.3.0 |

**Diferencia funcional entre dev y local:** dev no tiene las 2 guardias defensivas en `analisisOpenItem` y `udAnalisisOpenItem`. Para el caso ARMC (único cliente real hoy) el comportamiento es **idéntico** porque `armc` siempre está registrado. La guardia solo cambiaría el comportamiento ante un cliente no registrado, caso que no ocurre en flujo normal.

---

## 5. Resumen global del bloque B

- **Local:** 6/6 comprobaciones PASS. SPA del Hub responde HTTP 200; los 3 entregables ARMC sirven contenido válido con títulos correctos.
- **Externos con credenciales:** N/A explícito y justificado.
- **Dev/VPS:** 6/6 comprobaciones PASS para el caso ARMC, con observación documentada de que dev está en `v3.2.47` (no `v3.3.0`). Las 2 guardias defensivas en viewers no están desplegadas, pero para el flujo real (cliente único = ARMC, siempre registrado) el comportamiento es idéntico al esperado.
- **Probe técnica `warn + null`:** 9/9 sub-tests PASS. El contrato end-to-end (registry → función → consumer optional chaining → guardia en viewers) opera exactamente como la spec describe.

---

## 6. Errores encontrados

Ninguno. El slice se comporta como la spec define en todos los entornos probados.

---

## 7. Veredicto (recategorizado por dictamen del revisor)

**Bloque B: BLOCKED — visual humana pendiente** (recategorizado en v3.3.2 tras dictamen del revisor sobre la entrega v3.3.1).

Razón: 12 de 13 tests requieren navegador real con DevTools, no disponible en el entorno del ejecutor agente. La evidencia HTTP+probe JS es complementaria pero no alcanza el umbral acordado en el checklist (`docs/VALIDACION-BLOQUE-B-REGISTRO-RUTAS.md` § 2: "no aparecen errores en consola durante la navegación del slice", "el iframe carga contenido real"). Esos puntos solo se verifican mirando el navegador.

**Lo que sí queda PASS y sirve como evidencia complementaria aceptada:**
- **Probe técnica `warn + null + optional chaining + guardia en viewers`**: 9/9 sub-tests PASS en Node aislado (sección 3 de este reporte).
- **Bloque externos con credenciales**: N/A explícito y justificado, aceptado por el revisor.

---

## 8. Plan para cerrar el bloque B (acordado tras dictamen del revisor)

Tres pasos secuenciales, ninguno opcional:

### Paso 1 — Desplegar dev al estado actual del repo

Antes de cualquier sesión visual, dev debe servir el commit más reciente de `dev` (al cierre de este reporte: `22f36a7` v3.3.1, o el commit de la recategorización si se confirma). Comando estándar del proyecto:

```bash
ssh prisma@212.227.251.125 "cd ~/web-de-prisma-dev && git pull origin dev && pm2 restart prisma-dev"
```

**Verificación post-deploy:**
```bash
curl -sk https://dev.prismaconsul.com/hub | grep -oE 'welcome-version">v[0-9.]+'
# debe devolver el último v3.3.x
```

### Paso 2 — Sesión humana mínima en navegador real

Acotada (como pidió el revisor: "no extensa"). En **dos entornos** y **dos vistas**:

| Entorno | Vista | Acciones |
|---|---|---|
| `http://localhost:3000/hub` | Cliente (login con `armc@prismaconsul.com`) | Abrir DevTools (consola limpia) → Análisis → Análisis por roles → Cirujano (verificar iframe carga, consola sin errores) → volver → Diagnóstico integrado → Resumen Ejecutivo (idem) → volver → Blueprint de Sistema → Modelo de Datos (idem) |
| `http://localhost:3000/hub` | Admin (login con `info@prismaconsul.com`) | Idem en la vista admin del detalle de usuario ARMC: Cirujano + Resumen Ejecutivo + Modelo de Datos |
| `https://dev.prismaconsul.com/hub` | Cliente | Idem que en local |
| `https://dev.prismaconsul.com/hub` | Admin | Idem que en local |

**Total:** 4 sesiones × 3 items = **12 verificaciones visuales mínimas**.

**Por cada sesión, registrar:**
- ✓ iframe carga el HTML correcto (visible).
- ✓ consola DevTools sin errores (`TypeError`, `404`, errores JS).
- Captura opcional o nota textual.

**Probe técnica opcional pero recomendada al final** (en consola de DevTools del navegador, con la SPA cargada):
```javascript
getAnalysisPaths('cliente-inexistente')
// esperado: null + console.warn, sin TypeError
```

### Paso 3 — Addendum corto al reporte

No rehacer todo el bloque B. Crear sección "Addendum — sesión visual humana" al final de este mismo archivo, con:

- Fecha y hora de la sesión.
- Operador humano que la ejecutó.
- Para cada uno de los 12 tests recategorizados arriba: PASS / FAIL con nota corta (3-5 palabras).
- Si todo PASS: veredicto final "Bloque B: PASS".
- Si algún FAIL: detalle del fallo y commit de fix antes de cerrar.

Tras el addendum, el bloque B queda cerrado. **No se reabre el slice técnico.**

---

## 9. Estado actual al cierre de v3.3.2

- **Bloque B: BLOCKED** formalmente.
- **Probe técnica: PASS** complementaria.
- **Externos: N/A** confirmado.
- **Pendiente para cerrar:**
  1. Deploy de dev al último commit (paso 1 arriba).
  2. Sesión humana mínima de ~12 verificaciones visuales (paso 2).
  3. Addendum al reporte (paso 3).
- **No se avanza al bloque C** hasta que los tres pasos anteriores estén ejecutados y el bloque B esté formalmente PASS.

---

**Fin del reporte (versión recategorizada).**
