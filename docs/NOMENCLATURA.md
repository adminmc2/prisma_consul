# PRISMA — Nomenclatura oficial de documentos

**Versión:** 1.0
**Fecha:** 2026-04-14
**Ámbito:** todos los archivos que viven en el Hub de PRISMA Consul (Google Drive + tabla `portal_files`) para cualquier cliente y proyecto.
**Objetivo:** garantizar que cada documento tenga un nombre único, auto-descriptivo y adecuado para alimentar sistemas de IA (entrenamiento, búsqueda semántica, clasificación automática).

---

## 1. Formato canónico

```
{CLIENTE}_{PROYECTO}_{TIPODOC}_{VERSION}_{DESCRIPTOR}_{VARIANTE}_{FECHA}.ext
```

**7 campos separados por guion bajo**, más la extensión al final.

### Ejemplo canónico

```
34_01_CONSENTIMIENTO_V1_RINOPLASTIA_VARGAS_20260407.docx
```

Se lee como: *Cliente 34 (ARMC), proyecto 01 (APEX), Consentimiento informado, versión 1, procedimiento Rinoplastia, plantilla con cirujana Vargas pre-asignada, firmado/emitido el 7 de abril de 2026, en formato Word*.

---

## 2. Reglas de forma (obligatorias)

| Regla | Valor |
|---|---|
| Separador | Guion bajo `_` (nunca guion `-`, punto, ni espacio) |
| Caso | MAYÚSCULAS estrictas en todos los campos |
| Acentos / ñ | Prohibidos. Usar `ACIDOHIALURONICO`, no `ÁCIDO HIALURÓNICO` |
| Espacios | Prohibidos. Colapsar `TOXINA BOTULINICA` → `TOXINABOTULINICA` |
| Caracteres especiales | Prohibidos. Solo `[A-Z0-9_]` en los campos y `.[a-z0-9]+` en la extensión |
| Extensión | Minúsculas (`.pdf`, `.docx`, `.xlsx`). Los Google Docs nativos no llevan extensión |
| Longitud | Sin límite práctico. Preferir nombres completos sobre abreviaturas |
| Abreviaturas | Prohibidas (ver sección 6) |

---

## 3. Campos del nombre

### 3.1. CLIENTE (2 dígitos)

Número único por cliente. Cada empresa tiene su código.

| Código | Cliente |
|---|---|
| `33` | Prisma (interno) |
| `34` | ARMC — Aesthetic Rejuvenation Medical Center |

La numeración empieza en `33` y se incrementa al añadir nuevos clientes (`35`, `36`, ...).

### 3.2. PROYECTO (2 dígitos)

Número único por proyecto **a nivel global de PRISMA**, no por cliente. Un proyecto tiene siempre el mismo código independientemente del cliente que lo consuma.

| Código | Proyecto |
|---|---|
| `01` | APEX |

Cuando nazca un proyecto nuevo (ej. HUB, SYNAPSE), se asigna el siguiente número disponible (`02`, `03`, ...).

**Decisión justificada:** la numeración global es preferible a la numeración por cliente porque permite a la IA aprender la asociación "código → proyecto" de forma absoluta. Con numeración global, `_01_` significa APEX en cualquier archivo del corpus; con numeración por cliente, el mismo `_01_` podría significar proyectos distintos según el cliente, obligando al modelo a memorizar tuplas (cliente, proyecto) en vez de un solo identificador.

### 3.3. TIPODOC (palabra completa)

Categoría del documento. Lista oficial de tipos (ampliable a petición):

| TIPODOC | Significado | Etiqueta en Hub UI |
|---|---|---|
| `PNO` | Procedimiento Normalizado de Operación | PNO (Proc. Normalizado de Operación) |
| `CONSENTIMIENTO` | Consentimiento informado (específico o general) | Consentimiento informado |
| `HISTCLIN` | Historia clínica (plantilla o rellena) | Historia clínica |
| `CATALOGO` | Catálogo de servicios o procedimientos | Catálogo de servicios |
| `ORGANIGRAMA` | Documento organizativo / organigrama | Doc. organizacional |
| `FACTURA` | Factura CFDI / comprobante fiscal | Factura |
| `EXPEDIENTE` | Expediente clínico completo de un paciente | Expediente clínico |
| `RECETA` | Receta médica (plantilla o personalizada) | Receta médica |
| `NOTAVUELO` | Nota médica para autorizar vuelo | Nota médica para vuelo |
| `AVISOPRIV` | Aviso de privacidad | Aviso de privacidad |
| `ENTREVISTA` | Entrevista (discovery, discovery APEX, Fase 1) | Entrevista |

**Importante:** el TIPODOC nunca se abrevia. `CI` se escribe `CONSENTIMIENTO`. `TB` se escribe `TOXINABOTULINICA` en el descriptor asociado.

### 3.4. VERSION (letra V + número)

Iteración cronológica del **mismo documento**. Se incrementa solo cuando el contenido real del documento cambia.

- `V1`, `V2`, `V3`, ...
- Cuando ARMC actualiza el PNO de Otoplastia de V1 a V2 por un cambio normativo, el archivo nuevo recibe `V2` y el viejo queda archivado con `V1`.

**No se usa VERSION para diferenciar variantes funcionales simultáneas** (ver VARIANTE en 3.6).

### 3.5. DESCRIPTOR (palabra completa)

Qué trata el documento dentro de su TIPODOC. Captura el asunto específico:

| TIPODOC | Qué describe el DESCRIPTOR | Ejemplos |
|---|---|---|
| `PNO` | Procedimiento médico | `OTOPLASTIA`, `MASTOPEXIA`, `TOXINABOTULINICA` |
| `CONSENTIMIENTO` | Procedimiento o materia | `RINOPLASTIA`, `PEPTONAS`, `PUBLICACIONFOTOS`, `GENERAL` |
| `EXPEDIENTE` | Tratamiento o producto | `HIALURONICO`, `LIPOFACIALYBICHECTOMIA` |
| `RECETA` | Procedimiento o `ENBLANCO` | `RINOPLASTIA`, `ENBLANCO` |
| `ENTREVISTA` | Nombre del entrevistado | `GABUSH`, `BRIZA`, `CARLOS` |
| `FACTURA` | Inicial + apellido del paciente | `GMUNOZ`, `RSOLIS`, `CSKINFILL` |
| Documentos únicos | `BASE` (ver 5.2) | `BASE` |

### 3.6. VARIANTE (palabra completa)

Diferencia funcional dentro del mismo TIPODOC + DESCRIPTOR + VERSION. Se usa cuando hay **dos o más archivos legítimos** que comparten tipo, descriptor y versión pero no son duplicados.

Casos reales en ARMC:

| Uso de VARIANTE | Ejemplo | Justificación |
|---|---|---|
| Plantilla genérica vs con cirujano pre-asignado | `CONSENTIMIENTO_V1_RINOPLASTIA_GENERICO` vs `CONSENTIMIENTO_V1_RINOPLASTIA_VARGAS` | Dos plantillas del mismo CI que coexisten, una sin médico y otra con la Dra. Vargas |
| Sesiones múltiples del mismo entrevistado | `ENTREVISTA_V1_CARLOS_PARTE1` vs `ENTREVISTA_V1_CARLOS_PARTE2` | Dos sesiones de discovery del mismo entrevistado |
| Documento único sin variantes | `PNO_V1_OTOPLASTIA_BASE` | La mayoría de archivos llevan `BASE` como valor por defecto |

**Regla clave**: si no tienes una variante real que declarar, usa `BASE`. Nunca inventes variantes.

### 3.7. FECHA (YYYYMMDD)

Fecha en formato ISO 8601 básico (sin separadores).

**Convención sobre qué fecha usar**:

1. **Preferencia 1 — Fecha intrínseca del contenido**: fecha de firma, emisión, celebración del evento. Aplica a facturas (fecha CFDI), expedientes (fecha del procedimiento), entrevistas (fecha de la entrevista).
2. **Preferencia 2 — Fecha de creación del archivo**: cuando no hay fecha intrínseca clara en el contenido. Aplica a plantillas, PNOs, consentimientos genéricos, manuales.
3. **Nunca**: usar la fecha actual del momento del renombrado si el documento tiene fecha intrínseca más antigua.

---

## 4. Campo extensión

- Se conserva la extensión original del archivo en minúsculas: `.pdf`, `.docx`, `.xlsx`, `.txt`, `.csv`.
- **Google Docs nativos no llevan extensión** (ni `.gdoc` ni nada). Ejemplo: `34_01_ENTREVISTA_V1_BRIZA_BASE_20260330`.

---

## 5. Reglas especiales

### 5.1. Resolución de colisiones

Si dos archivos producirían el mismo nombre, significa que alguno de los campos semánticos no está capturando bien la diferencia real. Aplicar por orden:

1. **Probar variante** — distinguir con `VARIANTE` si hay una diferencia funcional real (plantilla con/sin médico, parte 1/parte 2 de una sesión...).
2. **Probar descriptor** — si la diferencia es de contenido (dos entrevistados distintos, dos procedimientos), refinar el `DESCRIPTOR`.
3. **Último recurso — sufijo secuencial** `_01`, `_02` al final. Solo usar si las dos opciones anteriores no aplican.

**Nunca** usar `VERSION` para diferenciar archivos que no son iteraciones del mismo documento.

### 5.2. Documentos únicos (sin descriptor ni variante naturales)

Para documentos que son únicos en su tipo y no tienen diferenciación natural:

- Usar `BASE` como descriptor
- Usar `BASE` como variante
- Resultado: **doble BASE** en el nombre

Ejemplo:

```
34_01_HISTCLIN_V1_BASE_BASE_20260402.pdf       ← Historia clínica plantilla
34_01_AVISOPRIV_V1_BASE_BASE_20260402.docx     ← Aviso de privacidad
34_01_ORGANIGRAMA_V1_BASE_BASE_20260402.pdf    ← Organigrama
34_01_NOTAVUELO_V1_BASE_BASE_20260402.docx     ← Nota médica para vuelo
```

**Justificación del doble BASE:** mantener los 7 campos siempre presentes da consistencia estructural total al corpus. Para la IA es mejor un slot uniforme con valor neutro que un formato variable.

### 5.3. Unificación de conceptos (no usar marcas ni abreviaturas)

Cuando un mismo concepto tiene múltiples nombres coloquiales o comerciales, usar **siempre el nombre técnico completo**.

| Evitar | Usar |
|---|---|
| `TB` | `TOXINABOTULINICA` |
| `BOTOX` | `TOXINABOTULINICA` |
| `BÓTOX` | `TOXINABOTULINICA` |
| `CI` | `CONSENTIMIENTO` |
| `PNO TB` | `PNO` + descriptor `TOXINABOTULINICA` |
| `AC HIALURONICO` | `ACIDOHIALURONICO` |

**Justificación:** las marcas comerciales (`BOTOX`) fragmentan el corpus. Si unos archivos usan `BOTOX` y otros `TOXINABOTULINICA`, la IA tiene que aprender que son sinónimos, lo cual es trabajo extra y potencialmente inconsistente. Con un único término canónico, una búsqueda `grep TOXINABOTULINICA` captura todo.

### 5.4. Conceptos compuestos

Cuando un documento cubre dos conceptos simultáneamente, unir con `Y` en mayúsculas, sin espacios:

```
LIPOFACIALYENDOLIFTING          ← Liposucción facial + endolifting
HIALURONICOYTOXINABOTULINICA    ← Ácido hialurónico + toxina botulínica
LIPOFACIALYBICHECTOMIA          ← Liposucción facial + bichectomía
```

### 5.5. Datos personales en descriptores

Cuando un documento contiene datos personales identificables (nombre de paciente, RFC, etc.), el descriptor debe:

- **Referirse al procedimiento o concepto**, no al nombre del paciente.
- Si el documento es una factura individual (contexto fiscal), se permite inicial + apellido: `GMUNOZ`, `RSOLIS`.
- Nunca incluir RFC, DNI, fecha de nacimiento ni datos sensibles en el nombre del archivo.

---

## 6. Prohibiciones absolutas

- ❌ **Guion** `-` como separador.
- ❌ **Espacios** en cualquier campo.
- ❌ **Acentos**, eñes o caracteres Unicode no ASCII.
- ❌ **Minúsculas** en los campos semánticos (la extensión sí va en minúsculas).
- ❌ **Abreviaturas ambiguas** (`CI`, `TB`, `HC`) — siempre nombre completo.
- ❌ **Marcas comerciales** como descriptor (`BOTOX`) — usar nombre técnico (`TOXINABOTULINICA`).
- ❌ **Prefijos numéricos de flujo interno** del cliente (`1.`, `3.`, etc. que ARMC usaba en los display_names).
- ❌ **Nombres de pacientes reales** en el descriptor para documentos distintos a facturas.

---

## 7. Cómo se integra con el Hub

El Hub (portal de documentos) almacena **tres nombres distintos** para cada archivo en la tabla `portal_files`:

| Campo BD | Contenido | Sincronización |
|---|---|---|
| `file_name` | Nombre técnico según esta nomenclatura | **Igual** al nombre en Google Drive |
| `display_name` | Nombre legible que el usuario cliente puso al subir el archivo | **Intacto**, no se toca al renombrar |
| `doc_type` | Categoría del documento (valor reducido, ver 7.1) | Se asigna automáticamente según el TIPODOC |

**Principio de diseño:**

- El **cliente** (ej. ARMC) entra al Hub y ve los nombres legibles (`1. PNO otoplastia`) — sigue la experiencia familiar, no se entera del cambio técnico.
- El **sistema** (Drive, BD, IA, scripts de procesamiento) usa los nombres técnicos — permite búsquedas sistemáticas, entrenamiento IA, automatizaciones.
- Ambos niveles conviven sin pisarse.

### 7.1. Mapeo TIPODOC → doc_type del Hub

El `doc_type` es un valor más corto que el Hub usa para agrupar archivos en categorías visuales (badges con color). Mapeo oficial:

| TIPODOC | doc_type | Etiqueta UI del Hub |
|---|---|---|
| PNO | `pno` | PNO (Proc. Normalizado de Operación) |
| CONSENTIMIENTO | `consentimiento` | Consentimiento informado |
| HISTCLIN | `historia` | Historia clínica |
| CATALOGO | `catalogo` | Catálogo de servicios |
| ORGANIGRAMA | `organizacional` | Doc. organizacional |
| FACTURA | `factura` | Factura |
| EXPEDIENTE | `expediente` | Expediente clínico |
| RECETA | `receta` | Receta médica |
| NOTAVUELO | `nota_vuelo` | Nota médica para vuelo |
| AVISOPRIV | `aviso_privacidad` | Aviso de privacidad |
| ENTREVISTA | `entrevista` | Entrevista |

---

## 8. Ejemplos completos reales (ARMC, cliente 34, proyecto APEX)

### PNOs

```
34_01_PNO_V1_TRICOLOGIA_BASE_20260402.docx
34_01_PNO_V1_OTOPLASTIA_BASE_20260402.docx
34_01_PNO_V1_MASTOPEXIA_BASE_20260402.docx
34_01_PNO_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.docx
34_01_PNO_V1_BLEFAROPLASTIA_BASE_20260402.docx
34_01_PNO_V1_BICHECTOMIA_BASE_20260402.docx
34_01_PNO_V1_RFMICROAGUJAS_BASE_20260402.docx
34_01_PNO_V1_TOXINABOTULINICA_BASE_20260402.docx
34_01_PNO_V1_DERMATOCOSMETICA_BASE_20260402.docx
34_01_PNO_V1_LASERCO2_BASE_20260402.docx
34_01_PNO_V1_BIOESTIMULADOR_BASE_20260402.docx
34_01_PNO_V1_ACIDOHIALURONICO_BASE_20260402.docx
```

### Consentimientos sin variante

```
34_01_CONSENTIMIENTO_V1_PEPTONAS_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_TIRZEPATIDA_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_LIPOFACIAL_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_ENDOLIFTINGLASER_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_LIFTINGFACIALLASER_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_BIOESTIMULADOR_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_ACIDOHIALURONICO_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_PUBLICACIONFOTOS_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_GENERAL_BASE_20260402.docx
34_01_CONSENTIMIENTO_V1_BRAQUIOPLASTIA_BASE_20260407.docx
```

### Consentimientos con variante de cirujano pre-asignado

```
34_01_CONSENTIMIENTO_V1_RINOPLASTIA_GENERICO_20260402.docx    ← plantilla base
34_01_CONSENTIMIENTO_V1_RINOPLASTIA_VARGAS_20260407.docx      ← con Dra. Vargas

34_01_CONSENTIMIENTO_V1_OTOPLASTIA_GENERICO_20260402.docx
34_01_CONSENTIMIENTO_V1_OTOPLASTIA_FIGUEROA_20260407.docx

34_01_CONSENTIMIENTO_V1_MASTOPEXIA_GENERICO_20260402.docx
34_01_CONSENTIMIENTO_V1_MASTOPEXIA_FIGUEROA_20260407.docx

34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_GENERICO_20260402.docx
34_01_CONSENTIMIENTO_V1_BLEFAROPLASTIA_FIGUEROA_20260407.docx

34_01_CONSENTIMIENTO_V1_BICHECTOMIA_GENERICO_20260402.docx
34_01_CONSENTIMIENTO_V1_BICHECTOMIA_FIGUEROA_20260407.docx
```

### Documentos únicos con doble BASE

```
34_01_HISTCLIN_V1_BASE_BASE_20260402.pdf
34_01_NOTAVUELO_V1_BASE_BASE_20260402.docx
34_01_AVISOPRIV_V1_BASE_BASE_20260402.docx
34_01_ORGANIGRAMA_V1_BASE_BASE_20260402.pdf
```

### Recetas

```
34_01_RECETA_V1_RINOPLASTIA_BASE_20260402.pdf
34_01_RECETA_V1_LIPOFACIALYENDOLIFTING_BASE_20260402.pdf
34_01_RECETA_V1_ENBLANCO_BASE_20260402.pdf
```

### Expedientes clínicos (compuestos)

```
34_01_EXPEDIENTE_V1_HIALURONICO_BASE_20260212.pdf
34_01_EXPEDIENTE_V1_HIALURONICOYTOXINABOTULINICA_BASE_20260318.pdf
34_01_EXPEDIENTE_V1_LIPOFACIALYBICHECTOMIA_BASE_20260220.pdf
34_01_EXPEDIENTE_V1_TOXINABOTULINICA_BASE_20260310.pdf
```

### Facturas CFDI

```
34_01_FACTURA_V1_GMUNOZ_BASE_20260122.pdf
34_01_FACTURA_V1_RSOLIS_BASE_20260122.pdf
34_01_FACTURA_V1_RGUTIERREZ_BASE_20260128.pdf
34_01_FACTURA_V1_CSKINFILL_BASE_20260221.pdf
```

### Entrevistas (Google Docs nativos, sin extensión)

```
34_01_ENTREVISTA_V1_GABUSH_BASE_20260407
34_01_ENTREVISTA_V1_BRIZA_BASE_20260330
34_01_ENTREVISTA_V1_CARLOS_PARTE1_20260327
34_01_ENTREVISTA_V1_CARLOS_PARTE2_20260331
34_01_ENTREVISTA_V1_DIVANI_BASE_20260327
34_01_ENTREVISTA_V1_ELIAN_BASE_20260331
34_01_ENTREVISTA_V1_MARISELA_BASE_20260401
34_01_ENTREVISTA_V1_OSCAR_BASE_20260330
```

---

## 9. Por qué esta nomenclatura está optimizada para IA

La nomenclatura no es arbitraria. Cada decisión de diseño está tomada pensando en cómo los tokenizadores de modelos LLM (BPE, SentencePiece, tiktoken) procesan los nombres.

### 9.1. Guion bajo frente a guion

- `_` mantiene los tokens pegados. `34_01_NDA_V1` se tokeniza en 3-4 tokens como identificador único.
- `-` produce tokens separados. `34-01-NDA-V1` se tokeniza en ~7 tokens fragmentados.
- El modelo aprende identificadores compactos con `_`, no frases rotas con `-`.

### 9.2. Nombres completos frente a abreviaturas

- `BLEFAROPLASTIA` → el modelo reconoce el concepto médico y lo asocia con anatomía ocular, cirugía, riesgos. Activa conocimiento previo del corpus de entrenamiento.
- `BLEFARO` (abreviatura) → token opaco. El modelo no distingue si es blefaroplastia, blefaritis, blefarospasmo. Pierde capacidad semántica.

### 9.3. Un concepto = un token

- `TOXINABOTULINICA` siempre, nunca `BOTOX` / `TB` / `BUTOLINICA` (typo de ARMC).
- Un solo token canónico para cada concepto médico permite búsquedas exactas, agregaciones limpias y entrenamiento eficiente.

### 9.4. Consistencia estructural

- Los 7 campos siempre presentes (con `BASE` por defecto) permiten al modelo aprender un patrón fijo de formato.
- Un pipeline de preprocesado puede parsear los nombres con un regex único: `^(\d{2})_(\d{2})_([A-Z]+)_V(\d+)_([A-Z]+)_([A-Z0-9]+)_(\d{8})(\..+)?$`

### 9.5. Orden del corpus por estructura

Al listar alfabéticamente los archivos renombrados en una carpeta, el resultado queda ordenado por:
1. Cliente
2. Proyecto
3. Tipo de documento (agrupando todos los PNOs, luego todos los CI, etc.)
4. Descriptor (dentro de cada tipo, alfabéticamente por procedimiento)
5. Variante
6. Fecha

Este orden es ideal para inspección visual y para pipelines que procesan el corpus en lotes por tipo.

---

## 10. Cómo añadir un cliente o proyecto nuevo

### Añadir cliente

1. Asignar el siguiente número disponible (`35`, `36`, ...).
2. Documentar el código en esta tabla (sección 3.1) y en la memoria del proyecto.
3. Todos los archivos del cliente nuevo usan ese código en el campo CLIENTE.

### Añadir proyecto

1. Asignar el siguiente número disponible a nivel global (`02`, `03`, ...) — no por cliente.
2. Documentar el código en esta tabla (sección 3.2).

### Añadir TIPODOC nuevo

1. Justificar por qué los tipos existentes no cubren el caso.
2. Elegir un nombre corto, en mayúsculas, sin abreviaturas (ej. `PROTOCOLO`, `ACTA`, `AUTORIZACION`).
3. Actualizar esta tabla (sección 3.3) y el mapeo a `doc_type` del Hub (sección 7.1).
4. Si el tipo nuevo requiere una categoría nueva en la UI del Hub, añadir la categoría a `DOC_TYPE_COLORS`, `DOC_TYPE_LABELS` y `DOC_TYPE_OPTIONS` en `prisma-apex/index.html` y desplegar a producción.

---

## 11. Historial de la nomenclatura

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-04-14 | Versión inicial. Formato de 7 campos. Aplicada a los 59 archivos de ARMC como primer cliente real del Hub. |

---

## 12. Referencias internas

- **Script de renombrado masivo**: `prisma-consulting/scripts/clientes/armc/rename-files.js` — aplica la nomenclatura a archivos ya existentes en el Hub (Drive + BD). Exportado a `prisma-consulting` en el subpaso 2.9 / `v3.3.41` por ser operación consultiva cliente-específica.
- **Script de doc_type**: `prisma-consulting/scripts/clientes/armc/update-doctypes.js` — asigna la categoría correcta en el campo `doc_type` según el TIPODOC. Exportado a `prisma-consulting` en el subpaso 2.9 / `v3.3.41`.
- **Código del Hub afectado**: [`prisma-apex/index.html`](../prisma-apex/index.html) líneas 1087-1119 (`DOC_TYPE_COLORS`, `DOC_TYPE_LABELS`, `DOC_TYPE_OPTIONS`).
- **Endpoint de upload**: [`server/routes/portal.js`](../server/routes/portal.js) línea 223 (`POST /portal-upload`) — **pendiente** de reescribir para que genere automáticamente nombres según esta nomenclatura en vez del formato sistemático legacy (`{prefijoUsuario}_{NNN}.ext`).
- **Memoria del proyecto**: `memory/project_nomenclatura_documentos.md` (referencia para conversaciones futuras con asistentes de IA).
