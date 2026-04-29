# Modelo de dominio — Prisma APEX

Documento canónico del modelo conceptual del sistema. Define entidades, relaciones, vocabulario y estrategia de compatibilidad con el modelo legacy actual.

> **Lectura del documento.** Las secciones 1-4 describen el **modelo canónico** (lo que el sistema es conceptualmente). Las secciones 5-9 describen **compatibilidad y transición** (cómo el modelo canónico convive con el estado legacy durante Sprint A). Las secciones 10-12 describen mapeo y migración. Las secciones 13-15 son referencias.
>
> Auditable como unidad independiente.

---

## 1. Propósito

Fijar **una sola fuente de verdad** sobre cómo se modelan las cosas en Prisma APEX, **separando explícitamente modelo canónico, compatibilidad transitoria y comportamiento funcional**.

Cubre tres cosas que la versión 4.1 del plan dejó nombradas pero no desarrolladas:

1. **Identidad canónica de Cliente** — cómo nace la entidad y cómo se mapea el campo legacy `empresa` a un cliente real, **incluyendo write path sin regresión funcional**.
2. **Compatibilidad legacy de Engagement/Vertical** — cómo conviven las nuevas entidades con los campos `current_phase`, `profile_type` y `apex_submission_id` que hoy mandan, **sin inventar fases que no existen**.
3. **Serving de entregables publicados** — cómo se siguen sirviendo cuando la web pública pase a `/web/`.

---

## 2. Jerarquía nuclear

```
Producto    = APEX
Vertical    = variante de un producto (clinica-multi, clinica-personal, distribuidor)
Engagement  = instancia comercial-operativa de un cliente en una vertical
```

**Reglas:**
- Un `Engagement` pertenece a exactamente un `Cliente`, un `Producto` y una `Vertical`.
- Un `Cliente` puede tener múltiples `Engagements` (mismo o distintos productos a lo largo del tiempo).
- Una `Vertical` solo es válida dentro del producto al que pertenece.

**Multi-producto:** este repo modela únicamente APEX. Otros productos PRISMA viven en sus propios repos.

---

## 3. Entidades (modelo canónico)

### 3.1 Cliente

**Definición.** Empresa con la que PRISMA mantiene o ha mantenido relación comercial.

**Atributos canónicos:**
- `id` (PK)
- `nombre` (texto canónico)
- `nombre_corto` (slug)
- `tipo_negocio` (enum abierto: `clinica`, `distribuidor`, otros futuros)
- `created_at`
- Atributos de identidad empresarial: `rfc`, `direccion`, `ciudad`, `cp`, `telefono`, `sector` (lista exacta a refinar al diseñar el esquema en fase 2; el principio canónico es: identidad empresarial vive aquí, no en Usuario).

**Lo que NO es:**
- No es Usuario. Un cliente puede tener N usuarios.
- No es Engagement. Un cliente puede tener N engagements.

### 3.2 Usuario

**Definición.** Persona que accede al sistema con credenciales propias.

**Atributos canónicos:**
- `id` (PK), `email` (único), `password_hash`, `nombre`
- `cargo`, `contacto_principal` (atributos personales del rol del usuario)
- `created_at`, `last_login`

**Lo que NO es atributo canónico:**
- **No tiene `cliente_id`.** La pertenencia a uno o varios clientes vive en `ClientMembership` (sección 3.3). Cualquier columna `cliente_id` en `portal_users` durante la transición es **conveniencia, no canónica** (sección 11.2).
- **No tiene `active_engagement_id`.** El "engagement activo" es contexto operativo / de UI, no identidad de dominio. Aplica solo a `cliente_user` y se modela como puntero transitorio fuera del modelo canónico (sección 6.5).
- **No tiene "rol global"** como atributo a largo plazo. Hoy lo tiene en `portal_users.role` por compatibilidad; el modelo canónico lo expresa vía `ClientMembership.role` (sección 8).
- **No tiene atributos de identidad empresarial** (`empresa`, `rfc`, `direccion`, etc.). Esos viven en Cliente.

### 3.3 ClientMembership

**Definición.** Relación N-N entre `Usuario` y `Cliente`, con un rol específico para ese contexto. **Es la única verdad canónica de la pertenencia usuario↔cliente.**

**Atributos:**
- `id`, `usuario_id`, `cliente_id`, `role`, `created_at`
- `role` ∈ {`prisma_admin`, `cliente_admin`, `cliente_user`}

**Reglas:**
- Una persona puede tener membresías en múltiples clientes con roles distintos.
- `prisma_admin` = administrador PRISMA con acceso operativo al cliente.
- `cliente_admin` = administrador en el lado del cliente.
- `cliente_user` = usuario regular del cliente.

**Estado actual:** no existe como tabla. Se introduce en fase 2 sincronizada desde el rol legacy global.

### 3.4 Engagement

**Definición.** Compromiso comercial-operativo entre PRISMA y un cliente, vinculado a un producto y a una vertical, con una fase actual y un ciclo de vida.

**Atributos:**
- `id`, `cliente_id`, `producto`, `vertical`
- `fase_legacy_id` (INTEGER) — refleja el `current_phase` numérico actual durante transición (sección 6)
- `submission_id` (FK opcional → apex_submissions)
- `created_at`, `closed_at`

**Reglas:**
- Si un cliente vuelve a contratar APEX, es un **nuevo Engagement** (no se reabre el viejo).
- **No hay regla de monotonía de fases.** El admin puede saltar a cualquier fase desde la UI. El modelo no la impone.
- **Un engagement puede tener múltiples usuarios asignados** (admin PRISMA y uno o varios usuarios cliente trabajando sobre el mismo engagement). La pertenencia usuario↔engagement se resuelve vía `ClientMembership` (acceso a engagements del cliente al que pertenece) más, opcionalmente, contexto de UI (`active_engagement_id` transitorio).

**Estado actual:** no existe como tabla. Hoy se modela implícitamente con campos `current_phase`, `profile_type` y `apex_submission_id` directamente en `portal_users` — mezclando atributos de usuario y de engagement (ver sección 6).

### 3.5 Producto

**Definición.** Producto que PRISMA ofrece. Hoy en `web-de-prisma` solo se modela `apex`.

**Estado.** Implícito (enum dentro de Engagement).

### 3.6 Vertical

**Definición.** Variante del producto adaptada a un universo de cliente.

**Valores válidos hoy** (todos para producto `apex`):
- `clinica-multi`
- `clinica-personal`
- `distribuidor` (con submódulos `pharma`, `cosmetica`, `dermatologia`)

**Estado.** Implícita (enum dentro de Engagement).

### 3.7 Fase

**Definición.** Etapa actual del engagement. Es enum dentro de Engagement, no entidad propia.

#### 3.7.1 Fases legacy reales (estado actual del sistema)

El sistema hoy expone **cuatro fases** en el panel admin (visibles en `portal/index.html`, sección "Fase del Proceso"):

| `current_phase` | Nombre legacy verbatim |
|---|---|
| 1 | Formulario APEX |
| 2 | Documentación |
| 3 | Entrevistas |
| 4 | Análisis de flujos y procesos |

Estas son las **únicas fases reales** del sistema actualmente. Cualquier mapping a otros nombres durante Sprint A se considera invención y queda prohibido.

**Comportamiento legacy importante:**
- El admin puede establecer cualquiera de las 4 fases para un usuario (sin orden obligatorio).
- La fase es por usuario (al ser campo de `portal_users`), no por engagement. Tras la transición pasa a ser por engagement.

#### 3.7.2 Modelo objetivo de fases — PENDIENTE

**Decisión abierta.** El modelo objetivo de fases (qué fases tendrá el sistema cuando se desarrollen los procesos completos) está intencionalmente abierto. Razones:

- Algunas fases legacy se mantendrán con su nombre actual; otras se renombrarán. Esa decisión todavía no está tomada.
- Hay procesos que aún no existen en el sistema (por ejemplo, captación previa al formulario, operación continua post-análisis) y solo se podrán nombrar y modelar cuando se desarrollen.
- Las verticales pueden tener fases distintas. Hoy todas las fases vienen de la vertical clínica; cuando entre la vertical distribuidor, se evaluará si comparte fases o introduce las suyas.

**Decisión cerrada para Sprint A:** durante Sprint A las fases del modelo coinciden con las legacy verbatim. **No se renombran. No se inventan nuevas.**

### 3.8 Submission

**Definición.** Respuestas concretas del cliente al formulario de discovery, junto con datos de empresa y resultados de investigación.

**Estado actual.** Existe como tabla `apex_submissions`. Se mantiene tal cual; FK desde `engagements.submission_id`.

### 3.9 Entrevista

**Definición.** Sesión grabada con personal del cliente. Audio en Drive (Workspace nativo desde Meet); transcripción en `prisma-trabajo-clientes` como markdown.

**Estado actual.** No modelada en BD. Se introduce en fase 2 con metadatos: id, engagement_id, fecha, participantes, link_drive_audio, path_transcripcion_repo.

### 3.10 Archivo

**Definición.** Documento subido al sistema (por cliente o por PRISMA en nombre del cliente).

**Atributos esenciales:**
- `id`, `engagement_id` (FK), `tipo_almacenamiento` (`drive` Sprint A, `ionos` post-Sprint B)
- `referencia_externa` (drive_file_id hoy; path filesystem post-Sprint B)
- `nombre_visible`, `tipo_documento`, `mime_type`, `tamano`, `created_at`

**Estado actual.** Existe como `portal_files` con `drive_file_id` y `user_id`. Se evoluciona en fase 2 añadiendo `engagement_id`.

### 3.11 Entregable

**Definición.** HTML renderizado a partir de una plantilla y datos del cliente, servido al cliente como producto del engagement.

**Atributos esenciales:**
- `id`, `engagement_id` (FK), `tipo`, `plantilla_origen` (FK)
- `path_servido` — ruta canónica (sección 9)
- `version`, `publicado_en`

**Estado actual.** No modelado en BD. Hoy son archivos HTML estáticos en `portal/analisis/armc/` referenciados por constantes en `portal/index.html`.

### 3.12 Plantilla

**Definición.** Estructura genérica de un tipo de entregable, asociada a una vertical y opcionalmente a un módulo.

**Estado actual.** No existe. Hoy todo es artesanal por cliente. Se introduce en fase 3.

---

## 4. Relaciones (modelo canónico)

```
Cliente 1     ── N    Engagement
Engagement N  ── 1    Producto
Engagement N  ── 1    Vertical
Engagement 1  ── 1    Fase  (estado, no entidad)
Engagement 1  ── 1    Submission  (opcional)
Engagement 1  ── N    Entrevista
Engagement 1  ── N    Archivo
Engagement 1  ── N    Entregable
Entregable N  ── 1    Plantilla
Plantilla N   ── 1    Vertical

Usuario N     ── ClientMembership ── N Cliente
                  (con role: prisma_admin | cliente_admin | cliente_user)
```

**Lo que NO es relación canónica:**

- **Usuario ↔ Engagement**: no hay relación directa en el modelo canónico. El acceso de un usuario a un engagement se deriva de su `ClientMembership` con el cliente del engagement (un usuario con membresía en un cliente puede acceder a sus engagements según su rol).
- **Usuario "tiene su engagement activo"**: no es relación canónica. Es **contexto operativo de UI** — qué engagement está viendo el usuario en pantalla ahora mismo. Modelado como puntero transitorio en `portal_users.active_engagement_id` durante Sprint A (sección 6.5), no como relación de dominio.

---

## 5. Identidad canónica de Cliente (REQUISITO REVISOR 1)

### 5.1 Problema

Hoy no existe entidad `Cliente`. Lo que hay es campo de texto `portal_users.empresa`. Riesgo: el mismo cliente físico puede aparecer como `"ARMC"`, `"Armc Aesthetic"`, `"ARMC SA de CV"` en distintas filas.

### 5.2 Solución: introducir entidad `Cliente`

Tabla `clientes` añadida en migración aditiva durante fase 2:

```sql
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  nombre_corto TEXT UNIQUE NOT NULL,
  tipo_negocio TEXT NOT NULL,
  -- atributos de identidad empresarial (lista exacta a refinar)
  rfc TEXT,
  direccion TEXT,
  ciudad TEXT,
  cp TEXT,
  telefono TEXT,
  sector TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.3 Read path: mapeo legacy `empresa` → `Cliente`

**Migración inicial (sección 11):**

1. Identificar valores únicos no triviales de `portal_users.empresa`. Cliente operativo confirmado a fecha de revisión: ARMC.
2. Crear filas en `clientes` con los datos empresariales del usuario representativo del cliente (`empresa` → `nombre`, slug → `nombre_corto`, copiar `rfc`/`direccion`/etc. del usuario representativo).
3. Asignar `cliente_id` a las filas `portal_users` correspondientes a usuarios `cliente_user` del cliente. **`prisma_admin` queda con `cliente_id=NULL`**: su pertenencia a múltiples clientes se modela exclusivamente vía `ClientMembership`, no vía la columna transitoria (sección 11.2).

**Lectura post-migración:**
- Endpoints existentes (`portal-auth`, `portal-profile`, `portal-users`) siguen devolviendo `empresa`, `rfc`, etc. en su payload.
- Internamente leen de `clientes` cuando hay `cliente_id`; caen al campo legacy si `cliente_id` es NULL.

### 5.4 Write path: cómo se editan los datos de identidad empresarial

**Problema.** Hoy los campos empresariales (`empresa`, `rfc`, `direccion`, `ciudad`, `cp`, `telefono`, `sector`) se editan desde tres lugares:

- **Por el propio usuario:** `PATCH /api/portal-profile` (`server/routes/portal.js`, función handler).
- **Por admin al crear usuario:** `POST /api/portal-users`.
- **Por admin al editar usuario:** `PATCH /api/portal-users/:id`.

Si tras introducir Cliente esos endpoints siguen escribiendo solo a `portal_users`, los datos empresariales y la entidad Cliente divergen.

**Decisión cerrada — sin regresión funcional:**

1. **El usuario sigue pudiendo editar sus datos empresariales desde `PATCH /api/portal-profile` exactamente como hoy.** Cero regresión visible.
2. **Internamente**, cuando exista `cliente_id` en la fila del usuario, los campos empresariales se escriben **a la entidad Cliente** vía `domain-sync` (sección 6.6), no al campo legacy `empresa`/`rfc`/etc. en `portal_users`.
3. **Datos personales** del usuario (`nombre`, `cargo`, `contacto_principal`) siguen escribiéndose a `portal_users` directamente.
4. **Endpoint nuevo `PATCH /api/clientes/:id`** se introduce en fase 2 para escenarios admin (admin editando datos empresariales sin pasar por un usuario concreto: cambios masivos, edición desde vista de cliente, etc.). Restringido a `prisma_admin` y eventualmente `cliente_admin` cuando se asigne ese rol.
5. **Coherencia entre múltiples usuarios del mismo cliente:** dado que los datos empresariales viven en Cliente (no en cada Usuario), si dos usuarios del mismo cliente abren su `/portal-profile` ven los mismos datos. Si uno los modifica, el otro lo ve actualizado. Esto **mejora** la coherencia respecto al estado legacy.

**Distribución de campos:**

| Campo | Vive canónicamente en | Estado durante transición |
|---|---|---|
| `nombre` (persona), `cargo`, `contacto_principal` | Usuario | Sin cambios |
| `email`, `password_hash` | Usuario (auth) | Sin cambios |
| `empresa` (= `clientes.nombre`) | Cliente | Editable vía `/portal-profile`; escritura redirigida a Cliente vía `domain-sync` cuando hay `cliente_id` |
| `rfc`, `direccion`, `ciudad`, `cp`, `telefono`, `sector` | Cliente | Igual que `empresa` |

**Resultado:** sin regresión visible para el usuario; coherencia mejorada entre usuarios del mismo cliente.

### 5.5 Decisiones cerradas

- **Cliente es entidad de primera clase desde fase 2.**
- **Datos empresariales viven canónicamente en Cliente.**
- **Cero regresión visible:** `PATCH /api/portal-profile` sigue aceptando los campos empresariales; `domain-sync` redirige la escritura a Cliente cuando `cliente_id` está presente.
- **Endpoint nuevo `PATCH /api/clientes/:id`** introducido para casos admin.
- **Permisos:** `prisma_admin` puede editar cualquier Cliente. `cliente_admin` (cuando se asigne) puede editar el suyo. `cliente_user` edita su Cliente vía `/portal-profile` transparente.

---

## 6. Compatibilidad legacy de Engagement / Vertical (REQUISITO REVISOR 2)

### 6.1 Problema

`portal_users` mezcla atributos de tres entidades distintas en una sola fila:

| Campo legacy | Pertenece conceptualmente a | Función actual |
|---|---|---|
| `empresa`, `rfc`, `direccion`, etc. | **Cliente** | datos de la empresa |
| `current_phase` (INT, default 1) | **Engagement.fase** | fase legacy del proceso |
| `profile_type` (TEXT, default `'clinica'`) | **Engagement.vertical** | tipo de cliente |
| `apex_submission_id` (TEXT) | **Engagement.submission_id** | enlace al submission |
| `role`, `email`, `password_hash` | **Usuario** + auth | persona y rol |

### 6.2 Estado legacy real (qué hay hoy)

**Fases legacy** — las cuatro reales del sistema, con nombre verbatim (ver sección 3.7.1).

**Vertical legacy** — `profile_type`:
- `'clinica'` → vertical clínica (sin distinguir multi/personal)
- `'distribuidor'` → vertical distribuidor

**Discovery legacy** — `apex_submission_id` apunta a una fila en `apex_submissions`.

**Otros hechos relevantes:**
- El admin puede saltar a cualquier fase libremente.
- No hay registro de "fases completadas" — solo la actual.
- Una fila `portal_users` representa de facto un único engagement.
- **Pueden existir varios usuarios `portal_users` para un mismo cliente** (admin PRISMA + usuario cliente, en el caso ARMC). Esto es importante para la migración (sección 11.2).

### 6.3 Modelo objetivo de fases — PENDIENTE

**Decisión abierta** (sección 3.7.2). Durante Sprint A se mantienen las 4 fases legacy verbatim. Modelo objetivo se cierra cuando los procesos correspondientes maduren.

### 6.4 Tabla de traducción legacy ↔ modelo (durante Sprint A: identidad)

Durante Sprint A, la tabla de traducción es **identidad** — no se renombra nada:

| `current_phase` legacy | `engagements.fase_legacy_id` | Nombre canónico durante Sprint A |
|---|---|---|
| 1 | 1 | Formulario APEX |
| 2 | 2 | Documentación |
| 3 | 3 | Entrevistas |
| 4 | 4 | Análisis de flujos y procesos |

| `profile_type` legacy | `engagements.vertical` | Notas |
|---|---|---|
| `'clinica'` | `'clinica-multi'` | Asignación inicial para clientes existentes (caso ARMC). **No es default permanente.** |
| `'clinica'` | `'clinica-personal'` | Asignable manualmente cuando aplique |
| `'distribuidor'` | `'distribuidor'` | Identidad |

### 6.5 Engagement activo (puntero transitorio, no canónico)

**Aclaración estructural** (corrección revisor):

- `active_engagement_id` **no es atributo canónico** del Usuario. No aparece en sección 3.2 (definición canónica) ni en sección 4 (relaciones canónicas).
- Es **contexto operativo / de UI**: "qué engagement está viendo este usuario en pantalla ahora mismo".
- Aplica a `cliente_user` (que típicamente tiene un engagement con su cliente). **No aplica a `prisma_admin`** — para ellos el contexto activo es navegación de UI entre clientes/engagements.

**Decisión cerrada — implementación durante Sprint A:**

- Se añade columna `portal_users.active_engagement_id` (FK → engagements, nullable) **como conveniencia de transición**, no como atributo de modelo.
- Para `cliente_user`, apunta al engagement abierto del cliente correspondiente (uno hoy, varios futuros).
- Para `prisma_admin`, queda NULL siempre.
- Se documenta en `domain-sync.js` como "puntero transitorio de UI".
- Cuando el modelo canónico se cierre (sprint posterior), la columna se elimina; el contexto activo se resuelve por navegación de UI o consulta.

**Por qué columna y no resolución por consulta:** durante Sprint A el coste de resolver "engagement activo" cada vez que se necesita es alto y reparte la lógica. Una columna explícita es más simple y operativa. Pero la columna **no eleva la semántica a modelo**; sigue siendo conveniencia.

### 6.6 Sincronización legacy ↔ nuevo (capa única de aplicación)

**Decisión cerrada:** la sincronización entre estado legacy y estado nuevo se implementa en una sola capa de aplicación — un módulo helper de dominio — **no por endpoint ni por trigger de BD**.

**Forma esperada:** módulo `server/lib/domain-sync.js` con funciones explícitas:

```javascript
// Lectura
getClienteFromUser(userId)              // devuelve datos empresariales canónicos (Cliente o legacy)
getActiveEngagement(userId)             // devuelve engagement activo del usuario (o null)

// Escritura desde código legacy o /portal-profile
syncLegacyUserUpdate(userId, fields)
   // si fields incluye empresariales y hay cliente_id → escribe a Cliente
   // si fields incluye current_phase/profile_type/apex_submission_id → propaga a Engagement
   // datos personales (nombre, cargo) → escritura directa a portal_users

// Escritura desde código nuevo (admin, /api/clientes, /api/engagements)
syncEngagementUpdate(engagementId, fields)
syncClienteUpdate(clienteId, fields)
```

**Reglas:**
- Cualquier endpoint que toque legacy o nuevo **invoca al helper**, no implementa la sincronización inline.
- Sin triggers de BD.
- El helper es la única definición de "qué se sincroniza con qué". Cuando los campos legacy se cierren (sprint posterior), se borra el helper.

### 6.7 Casos límite

- **Cliente en fase 1 sin formulario** (ningún usuario del cliente tiene `apex_submission_id` y `current_phase=1`): el engagement del cliente se crea igualmente, con `submission_id=NULL`, `fase_legacy_id=1`. Coherente con la migración (sección 11.2): cada Cliente identificado tiene exactamente un Engagement.
- **Usuario que renueva** (segundo engagement): se cierra el viejo, se crea uno nuevo, `active_engagement_id` apunta al nuevo.
- **Cliente con varios usuarios** (caso ARMC: admin PRISMA + usuario cliente): un solo engagement compartido (sección 11.2), `active_engagement_id` apunta al mismo en los `cliente_user`s, NULL en los `prisma_admin`s.
- **Admin salta de fase 4 a fase 2**: válido. `current_phase` se actualiza, `domain-sync` propaga a `engagements.fase_legacy_id`.

### 6.8 Decisiones cerradas

- **Campos legacy son fuente de verdad efectiva durante todo Sprint A.**
- **Tabla de traducción durante Sprint A es identidad** (sin renombre, sin invención).
- **Modelo objetivo de fases queda abierto.**
- **`active_engagement_id` es puntero transitorio de UI**, no atributo canónico del Usuario.
- **Sincronización mediante una sola capa de aplicación** (`server/lib/domain-sync.js`).
- **Sin regla de monotonía de fases.**
- **`profile_type='clinica'` → `'clinica-multi'`** solo asignación inicial; no default permanente para nuevos clientes.

---

## 7. Membresía Usuario↔Cliente

Modelado mediante `ClientMembership` (sección 3.3). **Es la única verdad canónica de pertenencia usuario↔cliente.**

**Sincronización inicial desde estado legacy:**

- `portal_user.role='admin'` → membresía `prisma_admin` en cada cliente activo.
- `portal_user.role='user'` → membresía `cliente_user` en su cliente asignado.
- `cliente_admin` no se asigna automáticamente; se asigna manualmente cuando aplique.

**Granularidad:** por cliente, no por engagement.

**Migración futura a `EngagementAccess`:** depende de centralizar primero la lógica de autorización.

---

## 8. Estrategia de compatibilidad de auth

### 8.1 Estado actual

La autorización está dispersa:

- **JWT** lleva `{id, email, nombre, role}` (`server/middleware/auth.js`, función `auth`).
- **Middleware `requireAdmin`** consulta `req.user.role !== 'admin'` (`server/middleware/auth.js`, función `requireAdmin`).
- **Endpoints** consultan `req.user.role === 'admin'` para decidir cross-user access (handlers de `portal-apex-results`, `portal-profile`, `portal-upload`, `portal-files` GET/DELETE/PATCH en `server/routes/portal.js`).
- **Frontend** muestra/oculta secciones admin con condiciones JS (`portal/index.html`, código de inicialización tras login).

### 8.2 Estrategia durante Sprint A

**No se cambia la auth efectiva.** Sigue siendo el `role` global del JWT.

- Se crea `client_memberships` en fase 2.
- Se sincroniza desde el estado legacy (sección 7) vía `domain-sync.js`.
- **No se consulta** desde código durante Sprint A. Es tabla derivada.

### 8.3 Estrategia para sprint posterior (fuera de Sprint A)

- Centralizar la lógica de autorización en una sola capa (`server/lib/authorization.js`).
- Reemplazar los `if (req.user.role === 'admin')` dispersos.
- Una vez todos los consumidores usen la capa, deprecar `role` global.

### 8.4 Implicación para EngagementAccess

Migración futura se beneficia de la capa centralizada. Sin ella sería compleja. Con ella probablemente acotada. **No se promete coste fijo.**

---

## 9. Serving de entregables publicados (REQUISITO REVISOR 3)

### 9.1 Problema

Hoy los entregables ARMC son HTMLs estáticos en `portal/analisis/armc/` servidos por `express.static(projectRoot, ...)` en `server/server.js`.

El frontend los cargaba originalmente vía 3 constantes hardcodeadas en `portal/index.html` (`ANALISIS_BASE_PATH`, `ANALISIS_DIAGNOSTICO_PATH`, `ANALISIS_BLUEPRINT_PATH`). En v3.2.46-47 esas constantes fueron **reemplazadas por la capa de registro de rutas** (`ANALISIS_REGISTRY` + función `getAnalysisPaths`); ver `REGISTRO-RUTAS.md`.

Cuando en fase 2 se mueva la web pública a `/web/` y se ajuste `express.static`, la raíz del repo deja de servirse.

### 9.2 Decisión: contrato canónico de publicados

**`/publicados/[cliente]/...` es el contrato canónico de los entregables publicados.** El registro de rutas del frontend apunta solo ahí. Cualquier otra forma de servir entregables (incluida la URL legacy) queda como compatibilidad temporal con redirect 301.

Los entregables:
- **Viven en el repo** `web-de-prisma`, en `prisma-apex/clientes-publicados/[cliente]/`.
- **Se sirven explícitamente** por Express bajo `/publicados/[cliente]/...`.
- **Son la única fuente** que el frontend consulta.

### 9.3 Configuración del servidor en fase 2

```javascript
// server.js (estado deseado tras fase 2)

// Web pública servida desde /web/
app.use(express.static(path.join(projectRoot, 'web'), {
  index: 'index.html',
  extensions: ['html']
}));

// Entregables publicados — contrato canónico /publicados/[cliente]/...
app.use('/publicados', express.static(path.join(projectRoot, 'prisma-apex', 'clientes-publicados'), {
  extensions: ['html']
}));

// SPA del Hub
app.get('/hub', (req, res) => {
  res.sendFile(path.join(projectRoot, 'prisma-apex', 'index.html'));
});

// SPA de discovery
app.get('/apex', (req, res) => {
  res.sendFile(path.join(projectRoot, 'prisma-apex', 'core', 'discovery-engine', 'index.html'));
});

// Redirects 301 desde URL antigua
app.get('/portal/analisis/:cliente/*', (req, res) => {
  const newPath = req.path.replace('/portal/analisis/', '/publicados/');
  res.redirect(301, newPath);
});
```

### 9.4 URLs públicas tras fase 2

| URL pública | Sirve | Estado |
|---|---|---|
| `prismaconsul.com/` | Landing (`web/index.html`) | Igual |
| `prismaconsul.com/aviso-legal.html` | Legal | Igual |
| `prismaconsul.com/apex` | Discovery SPA | Igual |
| `prismaconsul.com/hub` | Prisma APEX SPA | Igual |
| `prismaconsul.com/api/*` | API legacy | Igual |
| `prismaconsul.com/publicados/armc/diagramas/flujo-ceo.html` | Entregable ARMC | **Nueva URL canónica** |
| `prismaconsul.com/portal/analisis/armc/...` | Redirect 301 | Compatibilidad temporal |

### 9.5 Capa de registro de rutas en frontend

Las 3 constantes hardcodeadas en `portal/index.html` se reemplazan por consultas al registro central. Especificación detallada en el documento de diseño de la capa (entregable propio de fase 1, próximo).

**Forma esperada:**

```javascript
const paths = await getAnalysisRegistry({ cliente: 'armc' });
const diagramasBase   = paths.diagramas;
const diagnosticoBase = paths.diagnostico;
const blueprintBase   = paths.blueprint;
```

### 9.6 Decisiones cerradas

- **`/publicados/[cliente]/...` es el contrato canónico.**
- **Entregables viven en el repo** bajo `prisma-apex/clientes-publicados/[cliente]/`.
- **Express los sirve explícitamente.**
- **Redirect 301** desde URL legacy.
- **Frontend deja de hardcodear paths.**

---

## 10. Mapeo entidad ↔ estado actual

| Entidad del modelo | Hoy se llama | Dónde vive | Estado |
|---|---|---|---|
| Cliente | implícito en `portal_users.empresa` | columna BD | **Tabla `clientes`** introducida en fase 2; datos empresariales canónicos viven aquí |
| Usuario | `portal_users` | tabla BD | Existe; mantiene campos legacy durante Sprint A; pertenencia a clientes pasa a `ClientMembership` |
| ClientMembership | implícito en `portal_users.role` | columna BD | **Tabla `client_memberships`** en fase 2 |
| Engagement | implícito en `portal_users.{current_phase, profile_type, apex_submission_id}` | columnas BD | **Tabla `engagements`** en fase 2; sincronizada |
| Producto | implícito (todo es APEX) | n/a | enum |
| Vertical | implícito en `profile_type` | columna BD | enum dentro de Engagement |
| Fase | `current_phase` (INT) | columna BD | enum legacy mantenido verbatim |
| Submission | `apex_submissions` | tabla BD | Existe; FK desde Engagement |
| Entrevista | no modelada | dispersa | **Tabla `entrevistas`** en fase 2 |
| Archivo | `portal_files` | tabla BD | Existe; columna `engagement_id` añadida en fase 2 |
| Entregable | HTMLs estáticos en `portal/analisis/armc/` | filesystem | **Tabla `entregables`** en fase 2; archivos en `prisma-apex/clientes-publicados/[cliente]/` |
| Plantilla | no existe | n/a | **Introducida en fase 3** |

---

## 11. Migración aditiva de BD

**Principio:** ninguna columna ni tabla legacy se borra en Sprint A. Solo se añade.

### 11.1 Tablas y columnas nuevas

**Tablas nuevas en fase 2:**
- `clientes`
- `client_memberships`
- `engagements`
- `entrevistas`
- `entregables`

**Columnas nuevas (transitorias, no canónicas):**
- `portal_users.cliente_id` (nullable, FK → `clientes`) — **conveniencia de transición** que apunta al cliente principal de un `cliente_user`. **Para `prisma_admin` queda siempre NULL**: la pertenencia a clientes se resuelve exclusivamente vía `ClientMembership`. Se elimina cuando todos los consumidores leen `ClientMembership`.
- `portal_users.active_engagement_id` (nullable, FK → `engagements`) — **puntero transitorio de UI** que apunta al engagement activo de un `cliente_user`. **Para `prisma_admin` queda siempre NULL**: el contexto activo se resuelve por navegación de UI. Se elimina cuando se centralice la resolución de contexto activo.
- `portal_files.engagement_id` (nullable, FK → `engagements`) — **canónico** (los archivos sí pertenecen a un engagement).

### 11.2 Migración de datos en dos pasos (corrección revisor)

**Problema a evitar:** crear engagements "por fila de usuario" sobrecrea engagements cuando hay varios usuarios por cliente.

**Migración correcta:**

**Paso 1 — Crear Clientes (uno por empresa real):**

1. Agrupar `portal_users` por valores únicos no triviales de `empresa`. Hoy: una sola empresa real (ARMC), aunque puede haber 2-3 filas `portal_users` con valores `empresa` similares.
2. Por cada empresa real identificada, crear una fila en `clientes` copiando los datos empresariales del usuario representativo.
3. Asignar `cliente_id` a las filas `portal_users` que **son `cliente_user`** de esa empresa. Las filas `prisma_admin` quedan con `cliente_id=NULL`.

**Paso 2 — Crear Engagements (uno por cliente, regla incondicional):**

1. **Por cada Cliente identificado en el paso 1, crear exactamente UN Engagement.** La existencia de un Cliente en el sistema implica un engagement en curso, aunque esté en fase inicial sin formulario completado.
2. El engagement se deriva del **usuario representativo del cliente** (típicamente el `cliente_user`, no el `prisma_admin`):
   - `vertical` ← derivado de `profile_type` (sección 6.4).
   - `fase_legacy_id` ← `current_phase` del usuario representativo (default `1` si no hay otra señal).
   - `submission_id` ← `apex_submission_id` del usuario representativo (NULL si no completó formulario).
3. **Excepción:** cliente sin ningún `cliente_user` (solo registrado un `prisma_admin` sin contraparte cliente) — caso raro, se trata como excepción manual y no se crea engagement automático.

**Paso 3 — Asignar punteros y membresías:**

1. Crear `client_memberships` derivado de `role` legacy (sección 7).
2. Asignar `active_engagement_id` solo a usuarios `cliente_user`. Los `prisma_admin` quedan con `active_engagement_id = NULL`.

**Resultado para ARMC** (configuración esperada):
- 1 fila en `clientes` (ARMC).
- 2 filas `client_memberships` (admin info@: `prisma_admin`; user armc@: `cliente_user`).
- 1 fila en `engagements` (vertical `clinica-multi`, con `submission_id` y `fase_legacy_id` heredados de armc@).
- `portal_users.cliente_id` asignado **solo** a la fila armc@ (`cliente_user`). La fila info@ (`prisma_admin`) queda con `cliente_id=NULL`.
- `portal_users.active_engagement_id` asignado **solo** a la fila armc@. La fila info@ queda con `active_engagement_id=NULL`.

### 11.3 Sincronización bidireccional

Mediante `server/lib/domain-sync.js` (sección 6.6). Sin triggers de BD.

### 11.4 Cierre del legacy

Sprint posterior, fuera de Sprint A.

---

## 12. Lo que NO se modela hoy

| Entidad / concepto | Por qué no |
|---|---|
| **Modelo objetivo de fases (nombres definitivos)** | Pendiente. Algunas fases legacy se conservarán, otras se renombrarán; depende del desarrollo de procesos pendientes. Se cierra cuando el proceso correspondiente madure |
| EngagementAccess (rol por engagement) | Se evalúa cuando haya capa centralizada de auth |
| Productos distintos a APEX | Otros productos viven en otros repos |
| Versionado de Entregable | git da versionado natural |
| Auditoría detallada | `portal_activity_log` cubre lo básico |
| Permisos finos por entregable | Granularidad fina queda fuera |
| Capa centralizada de autorización | Sprint posterior |
| Cierre de campos legacy en `portal_users` | Sprint posterior |
| Eliminación de columnas transitorias `cliente_id`, `active_engagement_id` | Sprint posterior, cuando todos los consumidores lean del modelo canónico |

---

## 13. Glosario rápido (referencia cruzada)

Definiciones canónicas en `GLOSARIO.md`. Términos clave:

- **APEX** — producto.
- **Prisma APEX** — sistema interno de PRISMA.
- **Engagement** — instancia comercial-operativa.
- **Vertical** — variante del producto.
- **ClientMembership** — relación canónica usuario↔cliente con rol.
- **Migración aditiva** — solo añade.
- **Sprint A** — 4 semanas de reorganización.
- **Sprint B** — 1-1.5 semanas de migración del almacén, posterior.
- **Atributo canónico** — propio del modelo conceptual, parte de la entidad.
- **Conveniencia transitoria** — columna o puntero que existe solo durante la transición; no parte del modelo canónico.

---

## 14. Decisiones cerradas

| # | Decisión | Estado |
|---|---|---|
| MD-1 | Entidad `Cliente` introducida en fase 2. Cliente operativo confirmado a fecha de revisión: ARMC (sujeto a verificación al ejecutar migración) | aprobado |
| MD-2 | Datos empresariales viven canónicamente en `Cliente`. Cero regresión funcional: `PATCH /api/portal-profile` sigue aceptando los campos empresariales; `domain-sync` redirige la escritura a Cliente cuando hay `cliente_id`. Endpoint admin `PATCH /api/clientes/:id` añadido para casos sin usuario interlocutor | ajustado |
| MD-3 | Migración de Engagements en **dos pasos**: primero crear engagements únicos por cliente; después asignar punteros a usuarios. **No crear engagement por fila de usuario** | rehecho |
| MD-4 | `profile_type='clinica'` → `vertical='clinica-multi'` solo como asignación inicial para clientes existentes. **No es default permanente.** | aprobado |
| MD-5 | Mapping `current_phase` (INT) → fase legacy con nombre **verbatim**: 1=Formulario APEX, 2=Documentación, 3=Entrevistas, 4=Análisis de flujos y procesos. **No se introducen fases nuevas** como traducción del legacy | aprobado |
| MD-6 | Sincronización legacy ↔ nuevo mediante **una sola capa de aplicación** (`server/lib/domain-sync.js`). Sin triggers de BD | aprobado |
| MD-7 | `ClientMembership` es la **única verdad canónica** de pertenencia usuario↔cliente. Sincronizado desde `role` global. Granularidad por cliente | aprobado |
| MD-8 | Auth efectiva durante Sprint A sigue siendo `role` global del JWT | aprobado |
| MD-9 | Centralización de auth y `EngagementAccess` quedan fuera de Sprint A | aprobado |
| MD-10 | Entregables publicados viven en repo bajo `prisma-apex/clientes-publicados/[cliente]/` | aprobado |
| MD-11 | Express los sirve bajo URL pública `/publicados/[cliente]/...` (contrato canónico) | aprobado |
| MD-12 | Redirect 301 desde URL legacy para compatibilidad temporal | aprobado |
| MD-13 | Frontend reemplaza las 3 constantes hardcodeadas por registro de rutas | aprobado |
| MD-14 | Migración de BD es estrictamente aditiva en Sprint A | aprobado |
| MD-15 | Cierre de campos legacy queda fuera de Sprint A | aprobado |
| MD-16 | Endpoint `PATCH /api/clientes/:id` admin-only. **Cero regresión funcional**: el cliente_user sigue editando datos empresariales vía `PATCH /api/portal-profile`, escritura redirigida transparente a Cliente | ajustado |
| MD-17 | `active_engagement_id` es **puntero transitorio de UI** en `portal_users`, **no atributo canónico** del Usuario. Aplica solo a `cliente_user`; `prisma_admin` queda con NULL. Se elimina cuando se centralice la resolución de contexto activo | ajustado |
| MD-18 | Modelo objetivo de fases queda pendiente y abierto. Durante Sprint A se mantienen las 4 fases legacy con nombre verbatim | aprobado |
| MD-19 | **Sin regla de monotonía** de fases. El admin puede saltar libremente | aprobado |
| MD-20 | `cliente_id` y `active_engagement_id` en `portal_users` son **columnas transitorias**, no canónicas. **Aplican solo a `cliente_user`**: para `prisma_admin` ambas quedan en NULL. La pertenencia canónica del admin a múltiples clientes se modela vía `ClientMembership` (con role `prisma_admin` por cada cliente activo); el contexto activo del admin es navegación de UI. Se eliminan en sprint posterior cuando todos los consumidores lean del modelo canónico | ajustado |
| MD-21 | **Cada Cliente identificado tiene exactamente un Engagement creado en la migración.** Regla incondicional: incluso clientes en fase 1 sin formulario reciben un engagement con `submission_id=NULL`, `fase_legacy_id=1`. Excepción manual: cliente sin ningún `cliente_user` (raro). Resuelve la contradicción previa entre sección 6.7 y 11.2 | nuevo |

---

## 15. Lo que falta antes de pasar a fase 2

Este documento cierra el modelo de dominio con separación explícita entre canónico y transitorio. Para que fase 2 pueda arrancar con seguridad faltan:

1. ✅ Identidad canónica de Cliente (read + write path sin regresión) — secciones 5.3, 5.4.
2. ✅ Compatibilidad legacy de Engagement/Vertical sin invención — sección 6.
3. ✅ Serving explícito de clientes-publicados con contrato canónico — sección 9.
4. ✅ Migración de Engagements en dos pasos — sección 11.2.
5. ✅ Separación canónico ↔ transitorio en Usuario — secciones 3.2, 4, 11.1.

Y como entregables independientes de fase 1:

- `CONTRATOS.md` — inventario real (incluirá nota sobre las 4 fases derivando del fallback clínica del frontend).
- `GLOSARIO.md` — vocabulario completo.
- Diseño + implementación de la capa de registro de rutas.
- Clasificación archivo por archivo.
- Plan archivo a archivo de fase 2.
- Modo revisor permanente en `CLAUDE.md`.
- Replicación de sección Ecosistema en otros repos.

---

**Fin de MODELO-DOMINIO.md.**

Auditable como unidad. Tras revisión, se procede al siguiente entregable.
