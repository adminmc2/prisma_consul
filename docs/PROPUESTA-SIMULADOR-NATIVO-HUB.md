# Propuesta — Simulador UX a superficie nativa del Hub (sin iframes)

> **Tipo:** slice de definición técnica. No es implementación.
> **Estado:** propuesta para revisión. Si se aprueba, la implementación es un pase posterior.
> **Base:** `v3.3.63` (`8858729`).

## 1. Contexto y motivación

El simulador UX ARMC deja de tratarse como **entregable público estable cerrado** y pasa a
considerarse **módulo interno en construcción** dentro del Hub. Esta propuesta define cómo
eliminar la arquitectura de iframes y convertir el simulador en una superficie nativa del Hub,
sin proponer todavía el refactor completo ni reanudar el poblado funcional.

## 2. Diagnóstico de la arquitectura actual

Hoy el simulador se monta con **iframes anidados en tres niveles**:

```
Hub (prisma-apex/index.html)
  └─ <iframe id="simuladorIframe" src="/publicados/armc/simulador-ux/">   ← nivel 1
       └─ shell (simulador-ux/index.html)
            ├─ <iframe src="./capa-1-ux/index.html">                      ← nivel 2
            ├─ <iframe src="./capa-2-diccionario/index.html">
            ├─ <iframe src="./capa-3-sql/index.html">
            └─ <iframe src="./mapa/index.html">
```

Consecuencias del modelo actual:

- **Triple anidamiento** Hub → shell → capa para cada una de las 4 capas.
- Cada capa es un documento HTML autónomo (~2.051 líneas en total) con su propio `<head>`,
  fuentes Google, Phosphor CSS y redefinición de variables `:root` del design system.
- La navegación entre capas (cross-layer) depende de `window.postMessage` con `setTimeout`,
  un canal frágil y difícil de depurar.
- Atributos `sandbox`, alturas fijas (`min-height:600px`) y problemas de dimensionado.
- No hay estado compartido ni routing común con el Hub; cada iframe es un mundo aislado.
- El simulador vive bajo `prisma-apex/clientes-publicados/armc/` — superficie de **entregable
  publicado por cliente**, incoherente con su nuevo estatus de módulo interno.

## 3. Propuesta de arquitectura nativa

El Hub ya es una única página con conmutación de pestañas (`switchTab`). La propuesta es que
el simulador se renderice **directamente en el DOM del Hub**, sin ningún iframe.

```
Hub (prisma-apex/index.html)
  └─ #tab-simulador  (sección nativa, sin iframe)
       └─ barra de sub-pestañas nativa (Capa 1 / Capa 2 / Capa 3 / Mapa)
            └─ 4 paneles nativos renderizados en el DOM del Hub
```

Principios:

- **Sin iframes.** Se eliminan los del nivel 1 (Hub) y los del nivel 2 (shell).
- **Las 4 capas pasan a ser paneles nativos** dentro de `#tab-simulador`. La barra de
  sub-pestañas se implementa con la misma lógica de conmutación del Hub.
- **El `<body>` y la lógica JS de cada capa** se extraen de sus HTML autónomos y se
  reorganizan como partials/módulos cargados por el Hub.
- **Estilos consolidados.** Las capas dejan de redefinir `:root`; heredan el design system
  del Hub. La CSS específica del simulador se aísla en una hoja propia con prefijo de clase.
- **Cross-layer por llamada directa.** `postMessage` + `setTimeout` se sustituye por llamadas
  a funciones JS y un estado en memoria compartido.
- **Los datos JSON** (`catalogo-demandas.json`, `forms/`, `events/`, `mappings.json`) se
  mantienen como assets estáticos y se consumen vía `fetch()` (ver sección 6, contrato de
  assets).
- **Ubicación de destino propuesta.** El destino futuro del módulo es una ruta interna del
  Hub, alineada con la convención ya existente `prisma-apex/core/discovery-engine/` →
  propuesta: `prisma-apex/core/simulador-ux/`. **El movimiento físico del subtree no es parte
  de la reclasificación (línea A); se ejecuta dentro del refactor (línea B)** — ver sección 8.

## 4. Inventario — conservar / reorganizar / eliminar

### Se conserva (sin cambio de contenido)
- Datos: `catalogo-demandas.json`, `forms/web-contact-form.json`, `forms/lead-capture.json`,
  `events/lead-captured.json`, `mappings.json`.
- Capa 3: `schema.sql` y `data-dictionary.md`.
- El contenido y la lógica de render de cada capa (qué se muestra y cómo se calcula).
- El design system (tema oscuro, tabs, acentos). Se conserva el resultado visual.

### Se reorganiza
- Los 4 `index.html` de capa → paneles nativos: su `<body>` y su JS se reubican como
  módulos del Hub; pierden el `<head>` autónomo.
- CSS de cada capa → hoja consolidada del simulador, sin redefinir `:root`.
- Navegación cross-layer → API JS interna del módulo (sustituye `postMessage`).
- Ubicación física: `clientes-publicados/armc/simulador-ux/` → `prisma-apex/core/simulador-ux/`.

### Desaparece
- `<iframe id="simuladorIframe">` del Hub y los 4 `<iframe>` del shell.
- El shell `simulador-ux/index.html` como página autónoma (su barra de pestañas se integra
  en el Hub).
- `<head>`, fuentes y Phosphor CSS duplicados por capa.
- Atributos `sandbox` y alturas fijas asociadas al modelo iframe.
- El canal `window.postMessage` + `setTimeout` de navegación entre capas.
- La ruta pública directa del simulador (ver sección 5).

## 5. Ruta pública durante la transición

Hoy el simulador es alcanzable directamente en `/publicados/armc/simulador-ux/`. Al
reclasificarse como módulo interno, **no debe tener ruta pública propia**: se accede solo a
través de la pestaña del Hub.

Transición propuesta en dos fases:

- **Fase de coexistencia.** Mientras se construye y verifica la versión nativa, la ruta
  `/publicados/armc/simulador-ux/` se mantiene viva y **congelada** (sin nuevos cambios), para
  no romper nada hasta tener la nativa validada.
- **Fase de retirada.** Verificada la versión nativa en el Hub, la ruta antigua se retira con
  un **redirect 301** a `/hub` (coherente con el patrón legacy ya usado en el proyecto:
  `/portal/analisis/...` → redirect 301). No se deja la ruta sirviendo contenido duplicado.

Decisión a confirmar por el revisor: si el simulador interno debe quedar **solo** tras login
de Hub (lo natural para un módulo interno) o admitir algún acceso directo.

## 6. Contrato de assets durante la transición

El simulador consume datos estáticos: `catalogo-demandas.json`, `forms/web-contact-form.json`,
`forms/lead-capture.json`, `events/lead-captured.json`, `mappings.json`, y los recursos de
Capa 3 `schema.sql` y `data-dictionary.md`. Hoy se sirven bajo
`/publicados/armc/simulador-ux/...` porque el simulador vive en `clientes-publicados/`.

Al dejar de vivir bajo `clientes-publicados/`, esos assets necesitan una ruta de servicio
definida. La propuesta:

- **Fase de coexistencia (durante B, antes de la versión nativa final).** El subtree no se
  mueve hasta que el refactor lo requiera. Mientras tanto los assets se siguen sirviendo desde
  `/publicados/armc/simulador-ux/...` sin cambios. La carga actual no se rompe porque la ruta
  no se toca todavía.
- **Al mover el subtree (dentro de B).** Cuando el módulo pase a `prisma-apex/core/simulador-ux/`,
  los assets pasan a servirse desde una **ruta interna nueva** (p. ej. `/core/simulador-ux/...`,
  a confirmar contra la config de nginx/Express). El código nativo del Hub apunta `fetch()` a
  esa ruta nueva.
- **Alias técnico temporal.** Para no romper la carga durante el solapamiento entre la versión
  iframe (congelada) y la nativa, se mantiene un **alias temporal**: la ruta antigua
  `/publicados/armc/simulador-ux/...` sigue resolviendo a los mismos assets hasta que la
  versión iframe se retire. Se elimina el alias junto con la ruta pública (sección 5, fase de
  retirada).

Decisión a confirmar por el revisor: ruta interna definitiva de los assets y si el alias se
implementa a nivel de nginx, de Express o de copia física temporal.

## 7. Superficies consumidoras del simulador

El simulador no se monta en un solo sitio. Hoy hay **dos superficies** que cargan el mismo
`/publicados/armc/simulador-ux/` mediante iframes independientes:

| Superficie | Contenedor | Iframe | Contexto |
|---|---|---|---|
| Pestaña de usuario | `#tab-simulador` | `#simuladorIframe` | El usuario ve su propio simulador |
| Detalle de usuario (admin) | `#ud-simulador` | `#udSimuladorIframe` | El admin ve el simulador de un cliente desde la ficha de usuario |

Propuesta para el módulo nativo:

- **Una sola fuente reutilizable.** El simulador nativo se define **una vez** como módulo
  (`prisma-apex/core/simulador-ux/`) con una función de montaje que recibe el contenedor
  destino. Las dos superficies invocan el mismo módulo sobre contenedores distintos
  (`#tab-simulador` y `#ud-simulador`). No se duplica código ni contenido.
- **Composición sobre la misma base.** Ambas superficies comparten las 4 capas, los datos y la
  lógica de render. Lo que cambia es el contenedor host, no el módulo.
- **Diferencias de shell/layout a confirmar:** hoy el montaje admin (`#ud-simulador`) fuerza
  `min-height:600px` y vive dentro de la ficha de usuario; el montaje de usuario
  (`#tab-simulador`) ocupa la pestaña completa. La propuesta es que el módulo nativo acepte
  un parámetro de layout/altura, de modo que la misma base se adapte a ambos hosts sin lógica
  divergente. El revisor debe confirmar si admin y usuario deben verse idénticos o si el
  contexto admin requiere algún chrome adicional (p. ej. indicación de "viendo como cliente").

## 8. Separación en tres líneas de trabajo

Para que la ejecución no mezcle conceptos, la propuesta separa explícitamente:

| Línea | Qué es | Naturaleza | ¿En este pase? |
|---|---|---|---|
| **A — Reclasificación** | Cambio de estatus **conceptual y documental**: el simulador deja de tratarse como entregable público y pasa a módulo interno. Incluye la **decisión** del destino futuro (`prisma-apex/core/simulador-ux/`) y la actualización de CLAUDE.md y docs. **No mueve archivos físicos** y no cambia comportamiento. | Solo documentación | No — slice futuro corto |
| **B — Refactor de arquitectura** | Eliminar iframes, nativizar las 4 capas dentro del Hub **y mover el subtree** a `prisma-apex/core/simulador-ux/` con su contrato de assets (sección 6). El movimiento físico vive aquí porque hoy el Hub carga desde `/publicados/armc/simulador-ux/`: mover antes del refactor cambiaría comportamiento o exigiría compatibilidad. Es el grueso del cambio de código. | Refactor de código + movimiento | No — slice(s) futuro(s) |
| **C — Poblado funcional** | Seguir añadiendo nodos/contratos del flujo (respuesta automática, escalado humano, intake preclínico, etc.). | Contenido funcional | No — se reanuda tras B |

Reglas de secuencia recomendadas:

- **A antes que B.** Reclasificar conceptualmente primero fija el destino y deja una base
  documental clara para el refactor. A no mueve archivos.
- **El movimiento físico del subtree vive en B**, junto al refactor y al contrato de assets
  (sección 6), porque mover antes de refactorizar rompería la carga actual del Hub.
- **B no se mezcla con C.** El refactor de arquitectura no añade nodos nuevos; el poblado
  funcional se reanuda solo cuando B esté cerrado y verificado.
- **B puede requerir varios slices** (p. ej. un slice por capa, o shell + capas por separado).
  Eso se decide al abrir B, no aquí.

## 9. Riesgos y puntos para revisión del revisor

- **Aislamiento de CSS.** Al fusionar 4 documentos en el DOM del Hub se pierde el aislamiento
  natural del iframe. Hay riesgo de colisión de estilos; mitigación: prefijo de clase y hoja
  propia. El revisor debe validar el enfoque de aislamiento.
- **Aislamiento de JS.** Cada capa tiene su propio script global; al nativizar hay riesgo de
  colisión de nombres. Mitigación: encapsular cada capa en módulo/namespace.
- **Volumen del refactor.** ~2.051 líneas de HTML de capa más el shell. Confirmar si B se
  entrega como un slice único o fragmentado por capa.
- **Ruta pública.** Decisión pendiente sobre acceso (sección 5): ¿solo tras login de Hub?
- **Contrato de assets.** Decisión pendiente sobre ruta interna definitiva y mecanismo del
  alias temporal (sección 6): ¿nginx, Express o copia física?
- **Superficies consumidoras.** Decisión pendiente (sección 7): ¿admin y usuario ven el
  simulador idéntico, o el contexto admin requiere chrome adicional?
- **Contratos y boundaries.** Esta propuesta **no altera** los contratos del simulador
  (`forms/`, `events/`, `mappings.json`) ni los boundaries cerrados en B1/B2. El refactor B es
  de presentación/arquitectura, no de modelo de dominio. Si durante B aparece necesidad de
  tocar contratos, se para y se separa en otro slice.

## 10. Qué NO incluye este pase

- No implementa el refactor (líneas A, B y C quedan para slices posteriores).
- No mueve archivos ni elimina iframes todavía.
- No integra en `dev`, no hace bump de versión, no toca `CHANGELOG`, no toca `main` ni deploy.
- No modifica contratos, boundaries ni modelo de dominio.