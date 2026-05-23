# Capa de registro de rutas — especificación

> **Estado:** histórico · **Última verificación:** 2026-05-23.
> **Slice ejecutado:** las 3 constantes hardcodeadas fueron reemplazadas por
> `ANALISIS_REGISTRY` + `getAnalysisPaths` en `v3.2.46-48`; alineación a los valores
> canónicos `/publicados/armc/...` en `v3.3.31`. Verificado contra
> `prisma-apex/index.html:3640-3701`.
> Esta spec se conserva como referencia documental del slice. Candidata a mover a
> `docs/historico/` en un slice futuro.

Spec breve, pegada a la implementación. Reemplaza las 3 constantes hardcodeadas en `portal/index.html` por un registro consultable que las hace dejar de ser fuente de verdad.

> **Alcance estricto.** Esta spec describe **únicamente el slice del Hub que sirve los entregables ARMC**. No define una arquitectura futura. No abstrae para casos que aún no existen. Si en el futuro hace falta más (multi-cliente real, registro en BD, multi-vertical), se evalúa entonces.

---

## 1. Propósito

Desacoplar la SPA del Hub de los paths físicos de los entregables ARMC, sin mover los archivos físicos, sin cambiar URLs públicas, sin tocar el backend.

**Razón:** la siguiente fase del Sprint A (Fase 2) moverá `portal/analisis/armc/` físicamente. Si la SPA tiene los paths hardcodeados, mover archivos rompe la SPA aunque se añadan redirects HTTP. La capa de registro desacopla previamente para que el movimiento físico sea seguro.

---

## 2. Fuente de verdad

Un objeto JavaScript literal `ANALISIS_REGISTRY` declarado **inline en `portal/index.html`**, en el mismo bloque `<script>` donde hoy viven las constantes. No se crea archivo nuevo.

**Razón de mantenerlo inline:** hoy todo el JS del Hub vive en `portal/index.html`. Crear un archivo aparte añadiría una decisión de carga (script tag, module/non-module, orden) que está fuera del scope de este slice.

---

## 3. Shape mínima del registro

```javascript
const ANALISIS_REGISTRY = {
  armc: {
    diagramas:   '/portal/analisis/armc/diagramas/',
    diagnostico: '/portal/analisis/armc/diagnostico/',
    blueprint:   '/portal/analisis/armc/blueprint/'
  }
};
```

**Reglas:**
- **Una entrada por cliente.** Hoy solo `armc` (único cliente operativo).
- **Tres claves canónicas por cliente:** `diagramas`, `diagnostico`, `blueprint`. Mismas tres secciones que hoy ya tiene la SPA.
- **Valores = paths exactos actuales.** Sin normalización, sin reordenamiento. Lo que hoy resuelve a `/portal/analisis/armc/...` sigue resolviendo idéntico.

---

## 4. Función de resolución

Una sola función exportada para uso interno del archivo:

```javascript
function getAnalysisPaths(cliente) {
  const entry = ANALISIS_REGISTRY[cliente];
  if (!entry) {
    console.warn(`getAnalysisPaths: cliente "${cliente}" no registrado`);
    return null;
  }
  return entry;
}
```

**Razón de devolver el bloque entero (no path por path):** los tres consumers de hoy (lines 2457-2459) acceden a `diagramas`, `diagnostico` y `blueprint` en el mismo objeto literal `ANALISIS_SECTION_MAP`. Una sola llamada por cliente, propiedad point-access para cada sección. Mínimo número de invocaciones.

---

## 5. Comportamiento si un cliente o sección no existe

**Cliente no registrado:**
- `getAnalysisPaths(cliente)` devuelve `null`.
- Loggea `console.warn(...)` con el nombre solicitado para facilitar diagnóstico durante desarrollo.
- **No lanza excepción.** No interrumpe la inicialización de la SPA.
- **Los consumers honran este contrato end-to-end** en dos capas:
  1. **Construcción de `ANALISIS_SECTION_MAP`**: optional chaining (`_armcPaths?.diagramas`). Si la resolución devuelve `null`, las propiedades `path` quedan en `undefined`.
  2. **Apertura de viewers** (`analisisOpenItem`, `udAnalisisOpenItem`): guardia explícita `if (!section || !section.path) return;` antes de construir el `src` del iframe. Garantiza que **la sección queda literalmente vacía** (sin iframe cargado) en lugar de intentar abrir una URL rota tipo `'undefinedflujo-ceo.html'`.

**Sección no existe dentro de un cliente registrado:**
- Acceso por punto a una propiedad no declarada devuelve `undefined` (comportamiento JS estándar).
- No se añade defensa adicional. Las 3 secciones (`diagramas`, `diagnostico`, `blueprint`) se asume que existen para cualquier cliente registrado, **por convención del registro**.
- Si en el futuro algún cliente tiene secciones distintas, esta convención se revisa.

---

## 6. Constantes hardcodeadas reemplazadas

Quedan eliminadas las 3 declaraciones siguientes en `portal/index.html`:

```javascript
const ANALISIS_BASE_PATH        = '/portal/analisis/armc/diagramas/';     // línea 2423
const ANALISIS_DIAGNOSTICO_PATH = '/portal/analisis/armc/diagnostico/';  // línea 2432
const ANALISIS_BLUEPRINT_PATH   = '/portal/analisis/armc/blueprint/';     // línea 2441
```

Quedan modificadas las 3 referencias en `ANALISIS_SECTION_MAP` (lines 2457-2459):

```javascript
// Antes:
const ANALISIS_SECTION_MAP = {
  roles:       { items: () => ANALISIS_ROLES,       path: ANALISIS_BASE_PATH,        title: '...' },
  diagnostico: { items: () => ANALISIS_DIAGNOSTICO, path: ANALISIS_DIAGNOSTICO_PATH, title: '...' },
  blueprint:   { items: () => ANALISIS_BLUEPRINT,   path: ANALISIS_BLUEPRINT_PATH,   title: '...' }
};

// Después:
const _armcPaths = getAnalysisPaths('armc');
const ANALISIS_SECTION_MAP = {
  roles:       { items: () => ANALISIS_ROLES,       path: _armcPaths?.diagramas,   title: '...' },
  diagnostico: { items: () => ANALISIS_DIAGNOSTICO, path: _armcPaths?.diagnostico, title: '...' },
  blueprint:   { items: () => ANALISIS_BLUEPRINT,   path: _armcPaths?.blueprint,   title: '...' }
};
```

**Optional chaining (`?.`) en los consumers:** honra literalmente el contrato "warn + null, sin excepción" de la sección 5. Si el cliente no estuviera registrado, `_armcPaths` sería `null` y la propiedad `?.diagramas` evaluaría a `undefined` sin lanzar `TypeError`.

**Diff esperado:**
- Añadidas: 1 declaración `ANALISIS_REGISTRY` + 1 función `getAnalysisPaths` + 1 línea `_armcPaths`.
- Eliminadas: 3 constantes hardcodeadas.
- Modificadas: 3 referencias dentro de `ANALISIS_SECTION_MAP`.
- Total: ~12-15 líneas tocadas dentro de un único archivo.

---

## 7. Lo que NO hace este registro (alcance excluido)

- **No define una arquitectura genérica** de registro extensible a otros casos del Hub.
- **No persiste en BD.** Es objeto JS inline.
- **No carga desde endpoint.** Sin red.
- **No mueve archivos físicos.** Eso es Fase 2.
- **No cambia URLs públicas.** Las URLs `/portal/analisis/armc/...` siguen siendo las que el navegador pide cuando la SPA abre un iframe.
- **No introduce multi-vertical** (clínica-multi vs clínica-personal vs distribuidor). Sigue siendo cliente único.
- **No introduce sistema de plantillas.** Eso es fase 3.

Si cualquiera de estos puntos se considera necesario más adelante, se evalúa en su propio bloque, no se cuela en este slice.

---

## 8. Criterios de aceptación

Para que la implementación de este slice se considere correcta:

1. ✅ Las 3 constantes `ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH` **dejan de existir** en `portal/index.html`.
2. ✅ Las 3 referencias en `ANALISIS_SECTION_MAP` resuelven los mismos valores de path que hoy (paths exactos preservados).
3. ✅ La SPA del Hub abre correctamente:
   - Los 7 diagramas ARMC (atencion-paciente, cirujano, enfermero, cosmiatra, primer-ayudante, tricologia, ceo).
   - Los 5 HTMLs de diagnóstico (resumen-ejecutivo, matriz-dolor-proceso, mapa-fricciones, embudo-operativo, cadena-causal).
   - Los 5 HTMLs de blueprint (modelo-datos, flujos-to-be, automatizaciones, fases-implementacion, kpis-objetivo).
4. ✅ Ningún otro flujo del Hub se ha tocado (login, upload, perfil, panel admin, actividad).
5. ✅ Cambios de producto (lógica del Hub) acotados a un único archivo: `portal/index.html`. Otros archivos modificados como **metadocumentación del slice** son legítimos y esperados: `CHANGELOG.md` (entrada del bump), `CLAUDE.md` (versión actual), `index.html` y `portal/index.html` (string de versión en footer/login), y la propia spec `REGISTRO-RUTAS.md`.
6. ✅ No hay errores en consola del navegador al cargar la SPA y navegar las 3 secciones.

---

## 9. Verificación post-implementación

Bloque B (smoke tests) validará:

- **Bloque local:** servir el repo local y abrir la SPA en `http://localhost:3000/hub`. Recorrer las 3 secciones, abrir al menos un HTML de cada una, verificar que se renderiza en el iframe.
- **Bloque con credenciales:** N/A — este slice no toca servicios externos (Drive, Neon, SMTP, Tavily, Groq, Whisper).
- **Bloque dev/VPS:** desplegar a `dev.prismaconsul.com`, abrir el Hub, recorrer las 3 secciones, verificar que carga ARMC idéntico.

El N/A del bloque "credenciales" se documenta explícitamente en el entregable B, no se omite.

---

## 10. Evolución futura (fuera de scope)

Cuando llegue el momento de evolucionar este registro, los siguientes son cambios posibles **no contemplados aquí**:

- Multi-cliente real: añadir más entradas al registro (`distribuidor-x`, `clinica-y`, etc.).
- Mapping a paths post-Fase 2: cuando se mueva `portal/analisis/armc/` a `prisma-apex/clientes-publicados/armc/`, los valores del registro se actualizan a `/publicados/armc/...`. Los redirects 301 en el servidor cubren la URL antigua.
- Carga desde endpoint: si el número de clientes crece, el registro pasa a JSON servido desde `/api/...`. No hoy.
- Persistencia en BD: idem, vinculado a la entidad `Engagement` y sus entregables. No hoy.

Cada uno de estos pasos tiene su propio plan, no se ejecuta aquí.

---

**Fin de spec.**

Implementación a continuación. Pausa post-impl, antes de smoke tests.
