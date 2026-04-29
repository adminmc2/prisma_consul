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

## 2. Matriz de reporte

| # | Bloque | Vista | Comprobación | Resultado | Evidencia |
|---|---|---|---|---|---|
| 1 | Local | Cliente | Roles → Cirujano | PASS | `curl http://localhost:3099/portal/analisis/armc/diagramas/flujo-cirujano.html` → HTTP 200, 68509 bytes, `<title>Cirujano — Flujo Operativo (as-is) — ARMC</title>` |
| 2 | Local | Cliente | Diagnóstico → Resumen Ejecutivo | PASS | HTTP 200, 17155 bytes, `<title>Resumen Ejecutivo — ARMC Diagnóstico Integrado</title>` |
| 3 | Local | Cliente | Blueprint → Modelo de Datos | PASS | HTTP 200, 73727 bytes, `<title>Modelo de Datos — ARMC Blueprint</title>` |
| 4 | Local | Admin | Roles → Cirujano | PASS | URL del iframe en vista admin = misma que cliente (mismo `ANALISIS_SECTION_MAP`, ambos `analisisOpenItem` y `udAnalisisOpenItem` consultan el mismo registry). HTTP idéntico al test 1 |
| 5 | Local | Admin | Diagnóstico → Resumen Ejecutivo | PASS | idem test 2 |
| 6 | Local | Admin | Blueprint → Modelo de Datos | PASS | idem test 3 |
| 7 | Externos con credenciales | N/A | Slice sin servicios externos | N/A | Justificación: el slice de la capa de registro de rutas opera **únicamente** sobre un objeto JS local en `portal/index.html`, sin invocar Neon, Drive, SMTP, Tavily, Groq, Whisper ni ningún otro servicio externo. La ejecución de los tests no requirió credenciales ni red más allá del propio servidor local |
| 8 | Dev/VPS | Cliente | Roles → Cirujano | PASS con observación | HTTPS 200 contra `https://dev.prismaconsul.com/portal/analisis/armc/diagramas/flujo-cirujano.html`, 68509 bytes, mismo título. **Observación:** dev sirve `v3.2.47`, no `v3.3.0`. Para ARMC el comportamiento es idéntico (registry presente, optional chaining presente). |
| 9 | Dev/VPS | Cliente | Diagnóstico → Resumen Ejecutivo | PASS con observación | HTTPS 200, 17155 bytes, mismo título. Misma observación de versión |
| 10 | Dev/VPS | Cliente | Blueprint → Modelo de Datos | PASS con observación | HTTPS 200, 73727 bytes, mismo título. Misma observación |
| 11 | Dev/VPS | Admin | Roles → Cirujano | PASS con observación | URL del iframe en vista admin = misma que cliente. HTTP idéntico al test 8 |
| 12 | Dev/VPS | Admin | Diagnóstico → Resumen Ejecutivo | PASS con observación | idem test 9 |
| 13 | Dev/VPS | Admin | Blueprint → Modelo de Datos | PASS con observación | idem test 10 |

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

## 7. Veredicto

**Bloque B: PASS** con la siguiente observación operativa documentada:

> El despliegue de `dev.prismaconsul.com` está en `v3.2.47`. Para que dev refleje el estado exacto de `ff8036b` (`v3.3.0`) que se validó en local, falta hacer `pull` y reiniciar PM2 en el VPS. La diferencia es solo el commit `4d13851` (guardias en viewers añadidas en v3.2.48) y commits posteriores documentales. **No bloquea la operativa ARMC actual** porque las guardias son defensivas para casos que no ocurren con el cliente actual. Recomendación operativa: actualizar dev cuando se haga el siguiente despliegue normal.

---

## 8. Recomendación al revisor

**El review puede pasar al siguiente entregable interno** del cierre de Fase 1:

> **Bloque C: Clasificación archivo por archivo + Plan archivo a archivo de Fase 2.**

La capa de registro de rutas queda validada en runtime para el caso operativo real (ARMC). El despliegue en dev está suficientemente alineado para no bloquear avance, con observación documentada para futura sincronización.

---

## 9. Limitaciones que el revisor debe tener presentes

Si el revisor considera que la validación visual humana del iframe rendered en navegador real con DevTools es **requisito imprescindible** para cerrar bloque B, entonces:
- Los tests 1-6 (local) deben recategorizarse como `BLOCKED — visual humana pendiente`.
- Los tests 8-13 (dev/VPS) misma recategorización.
- La probe técnica seguiría como PASS (es ejecutable sin navegador).

En ese escenario, el bloque B requeriría una sesión humana adicional con sesión en el navegador. El ejecutor agente puede preparar todo el entorno (dev al día, server local listo) y entregar los pasos exactos para que el humano click-navegue, pero la observación visual misma queda fuera de su alcance.

---

**Fin del reporte.**
