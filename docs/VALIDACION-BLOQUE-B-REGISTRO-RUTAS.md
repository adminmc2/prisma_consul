# Validación del bloque B — registro de rutas ARMC

**Destinatario:** ejecutor del bloque B  
**Remitente:** revisor  
**Fecha:** 2026-04-29  
**Propósito:** ejecutar la primera validación runtime del slice del registro de rutas cerrado en el bloque A.  
**Estado:** checklist ejecutado y cerrado en `PASS` por decisión de revisión en `v3.3.3`; el resultado vigente vive en `docs/REPORTE-BLOQUE-B-REGISTRO-RUTAS.md` (addendum con Opción A aceptada).

---

## 1. Alcance

Este bloque valida solo el slice introducido por la capa de registro de rutas:

- `ANALISIS_REGISTRY`
- `getAnalysisPaths(cliente)`
- `ANALISIS_SECTION_MAP`
- `analisisOpenItem(...)`
- `udAnalisisOpenItem(...)`

Queda fuera de alcance en este bloque:

- login como feature completa
- upload de archivos
- panel de actividad
- perfil de usuario
- APIs externas
- Neon, Drive, SMTP, Tavily, Groq o Whisper
- movimientos físicos de carpetas o cambios de serving

---

## 2. Definición de hecho

El bloque B se considera cumplido solo si se verifican estos puntos:

- El bloque local pasa completo.
- El bloque "externos con credenciales" queda marcado explícitamente como `N/A` con justificación.
- El bloque dev/VPS pasa completo.
- En cada entorno probado, la vista cliente y la vista admin cargan al menos un HTML de cada una de las 3 secciones.
- No aparecen errores en consola durante la navegación del slice.
- El `iframe` carga contenido real y no una URL rota o una pantalla vacía inesperada.
- El ejecutor entrega un reporte final con resultado `PASS`, `FAIL` o `BLOCKED` por comprobación.

---

## 3. Prerrequisitos

- Repo en el commit a validar, sin cambios funcionales adicionales en el slice.
- Dependencias del servidor instaladas.
- Entorno local levantable con `cd server && npm run dev` o `cd server && npm start`.
- Una credencial válida de usuario cliente ARMC y una credencial válida de admin ya existentes en `portal_users`.
- Despliegue en `dev.prismaconsul.com` actualizado al mismo estado que se valida localmente antes de ejecutar el bloque dev/VPS.
- Navegador con DevTools disponible para revisar consola y `iframe`.

**Aclaración importante:**
El bloque "externos con credenciales" es `N/A` porque este slice no toca servicios externos. Eso no elimina la necesidad de usar credenciales normales del portal para entrar al Hub en local y en dev.

---

## 4. Muestra mínima obligatoria

Para mantener el smoke test acotado y útil, la muestra mínima obligatoria es esta:

| Sección | Item mínimo a abrir | Path esperado |
|---|---|---|
| Roles | `flujo-cirujano.html` | `/portal/analisis/armc/diagramas/flujo-cirujano.html` |
| Diagnóstico | `resumen-ejecutivo.html` | `/portal/analisis/armc/diagnostico/resumen-ejecutivo.html` |
| Blueprint | `modelo-datos.html` | `/portal/analisis/armc/blueprint/modelo-datos.html` |

Esta misma muestra se ejecuta en:

- vista cliente
- vista admin
- entorno local
- entorno dev/VPS

---

## 5. Bloque local

### 5.1 Preparación

1. Levantar el servidor local.
2. Abrir `http://localhost:3000/hub`.
3. Abrir DevTools desde el inicio y mantener visible la consola.
4. Limpiar consola antes de empezar la prueba.

### 5.2 Vista cliente

1. Entrar con una cuenta cliente ARMC válida.
2. Abrir la sección `Análisis`.
3. Abrir `Análisis por roles`.
4. Abrir el item `Cirujano`.
5. Verificar que el `iframe` renderiza la página y que el contenido corresponde al flujo del cirujano.
6. Confirmar que la URL cargada por el `iframe` contiene `/portal/analisis/armc/diagramas/flujo-cirujano.html`.
7. Volver al selector de secciones.
8. Abrir `Diagnóstico integrado`.
9. Abrir `Resumen Ejecutivo`.
10. Verificar render correcto y path con `/portal/analisis/armc/diagnostico/resumen-ejecutivo.html`.
11. Volver al selector de secciones.
12. Abrir `Blueprint de Sistema`.
13. Abrir `Modelo de Datos`.
14. Verificar render correcto y path con `/portal/analisis/armc/blueprint/modelo-datos.html`.
15. Confirmar que la consola sigue limpia: sin `TypeError`, sin `404`, sin errores de `iframe`, sin errores Mermaid atribuibles al routing.

### 5.3 Vista admin

1. Cerrar sesión o abrir nueva sesión limpia.
2. Entrar con una cuenta admin válida.
3. Ir al detalle de un usuario ARMC en la vista admin.
4. Abrir la vista de análisis del detalle de usuario.
5. Repetir exactamente la misma muestra mínima:
   `Cirujano`, `Resumen Ejecutivo`, `Modelo de Datos`.
6. Verificar render correcto en el viewer admin.
7. Confirmar que la consola sigue limpia al terminar.

### 5.4 Resultado esperado del bloque local

- `PASS` si los 6 accesos mínimos cargan bien y sin errores de consola.
- `FAIL` si hay `404`, URL rota, `iframe` vacío, excepción JS o discrepancia clara entre sección e item cargado.
- `BLOCKED` si el entorno local no arranca o si no hay credenciales válidas del portal.

---

## 6. Bloque externos con credenciales

**Resultado esperado:** `N/A`

**Justificación obligatoria:**
Este slice no invoca Neon, Google Drive, SMTP, Tavily, Groq, Whisper ni ningún servicio equivalente. El test cubre solo resolución local de rutas estáticas dentro del Hub.

El reporte final debe incluir el bloque `N/A`; no se omite.

---

## 7. Bloque dev/VPS

### 7.1 Preparación

1. Confirmar que `dev.prismaconsul.com` ya sirve el estado exacto que se validó localmente.
2. Abrir `https://dev.prismaconsul.com/hub`.
3. Abrir DevTools y limpiar consola.

### 7.2 Vista cliente en dev

1. Entrar con una cuenta cliente ARMC válida.
2. Repetir la muestra mínima obligatoria:
   `Cirujano`, `Resumen Ejecutivo`, `Modelo de Datos`.
3. Confirmar render correcto y ausencia de errores en consola.

### 7.3 Vista admin en dev

1. Entrar con una cuenta admin válida.
2. Ir al detalle del usuario ARMC.
3. Repetir la muestra mínima obligatoria en el viewer admin.
4. Confirmar render correcto y ausencia de errores en consola.

### 7.4 Resultado esperado del bloque dev/VPS

- `PASS` si reproduce el mismo comportamiento que local.
- `FAIL` si local pasa y dev no.
- `BLOCKED` si el despliegue en dev no corresponde al estado validado o si el entorno no está accesible.

---

## 8. Probe técnica opcional del contrato `warn + null`

Esta comprobación es opcional. No sustituye la navegación mínima, pero sirve para dar evidencia adicional del contrato técnico.

En consola del navegador:

```javascript
getAnalysisPaths('cliente-inexistente')
```

Resultado esperado:

- devuelve `null`
- emite un `console.warn(...)`
- no lanza excepción

No hace falta forzar mutaciones del estado interno del Hub para este bloque. El objetivo de la smoke test es validar el slice visible sin introducir probes destructivas.

---

## 9. Formato de reporte del ejecutor

Usar esta matriz mínima en la entrega del bloque B:

| Bloque | Vista | Comprobación | Resultado | Evidencia |
|---|---|---|---|---|
| Local | Cliente | Roles → Cirujano | PASS/FAIL/BLOCKED | captura o nota |
| Local | Cliente | Diagnóstico → Resumen Ejecutivo | PASS/FAIL/BLOCKED | captura o nota |
| Local | Cliente | Blueprint → Modelo de Datos | PASS/FAIL/BLOCKED | captura o nota |
| Local | Admin | Roles → Cirujano | PASS/FAIL/BLOCKED | captura o nota |
| Local | Admin | Diagnóstico → Resumen Ejecutivo | PASS/FAIL/BLOCKED | captura o nota |
| Local | Admin | Blueprint → Modelo de Datos | PASS/FAIL/BLOCKED | captura o nota |
| Externos con credenciales | N/A | Slice sin servicios externos | N/A | justificación textual |
| Dev/VPS | Cliente | Roles → Cirujano | PASS/FAIL/BLOCKED | captura o nota |
| Dev/VPS | Cliente | Diagnóstico → Resumen Ejecutivo | PASS/FAIL/BLOCKED | captura o nota |
| Dev/VPS | Cliente | Blueprint → Modelo de Datos | PASS/FAIL/BLOCKED | captura o nota |
| Dev/VPS | Admin | Roles → Cirujano | PASS/FAIL/BLOCKED | captura o nota |
| Dev/VPS | Admin | Diagnóstico → Resumen Ejecutivo | PASS/FAIL/BLOCKED | captura o nota |
| Dev/VPS | Admin | Blueprint → Modelo de Datos | PASS/FAIL/BLOCKED | captura o nota |

Añadir al final:

- resumen global del bloque
- errores encontrados, si existen
- si el bloque B queda `PASS`, `FAIL` o `BLOCKED`
- si el review puede pasar al siguiente entregable interno o no

---

## 10. Criterio del revisor tras la ejecución

El revisor solo dará por completado el bloque B si:

- la matriz viene completa
- el bloque `N/A` está explícito
- no hay omisión de la vista admin
- no hay omisión del entorno dev/VPS
- el resultado está apoyado en evidencia verificable

Si el ejecutor reporta solo local o solo cliente, el bloque B queda incompleto.