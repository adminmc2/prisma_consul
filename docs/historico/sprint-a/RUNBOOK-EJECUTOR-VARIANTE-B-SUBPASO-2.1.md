# Runbook del ejecutor para Variante B del subpaso 2.1

> **Documento histórico — Sprint A.** Trabajo ya ejecutado o decisión ya cerrada. Cierre formal de Sprint A: 2026-05-05. Movido a `docs/historico/sprint-a/` en el slice de consolidación post-Sprint A. Las referencias internas reflejan el estado en el momento de redacción y no se actualizan al nuevo path.

**Fecha:** 2026-05-02
**Estado:** vigente
**Objetivo:** ejecutar el subpaso 2.1 usando la **Variante B**: cambiar el `root` global del site de `dev` para que la web publica salga desde `/web/`, manteniendo excepciones explicitas para las superficies que no se han movido.

---

## 1. Regla base

Este paquete se ejecuta **solo en `dev`**. No se toca produccion mientras este paquete no haya pasado validacion completa.

El objetivo no es "hacer que responda algo". El objetivo es que el contrato publico siga estable en todas estas superficies:

1. `/`
2. `/aviso-legal.html`
3. `/cookies.html`
4. `/privacidad.html`
5. `/css/*`
6. `/js/*`
7. `/images/*`
8. `/apex`
9. `/hub`
10. `/portal/...` legacy
11. `/api/*`

---

## 2. Precondiciones obligatorias

### Paso 0 — Confirmar base de trabajo

**Que debe hacer el ejecutor**

1. Trabajar en la rama `chore/fase2-repo-base-v3.3.24`.
2. Tomar como candidato de repo el slice ya preparado para 2.1 (`077c56f`) sin mezclar otros cambios.
3. Confirmar que la primera ejecucion sera solo contra `dev.prismaconsul.com`.

**Por que**

Evita contaminar la prueba con otros cambios y mantiene rollback simple.

**Verificacion**

1. `git status --short` limpio en el worktree del carril repo.
2. `git log --oneline --decorate -n 5` mostrando la rama correcta.
3. Confirmacion escrita de que no se tocara `main` ni produccion.

---

### Paso 0 bis — Confirmar inventario real de rutas antes de tocar nginx

**Que debe hacer el ejecutor**

1. Identificar el `access_log` real que usa hoy el site `prisma-dev`.
2. Extraer una muestra reciente de URIs pedidas a `dev.prismaconsul.com`, normalizando query strings.
3. Contrastar esa muestra con las 11 superficies obligatorias de este paquete antes de tocar la config.

**Por que**

Evita que la Variante B falle por una ruta olvidada. La regla ya no es solo reaccionar si aparece una ruta no contemplada; ahora hay verificacion proactiva previa.

**Verificacion**

1. Existe una lista corta de rutas reales observadas en logs.
2. Si aparece una ruta publica fuera del inventario minimo, el ejecutor la eleva antes del paso 3.

**Comandos orientativos**

```bash
sudo nginx -T | grep access_log
sudo awk '{print $7}' /ruta/real/al/access.log | cut -d'?' -f1 | sort -u | head -100
```

---

## 3. Ejecucion paso a paso

### Paso 1 — Preparar el arbol del repo para que la web viva en `/web/`

**Que debe hacer el ejecutor**

1. Aplicar o verificar el movimiento fisico ya definido en 2.1:
   - `index.html` y legales dentro de `web/`
   - `css/`, `js/`, `images/` dentro de `web/`
2. Verificar que `server/server.js` queda preparado para local y coherencia de runtime:
   - `express.static(path.join(projectRoot, 'web'))`
   - mount explicito para `/apex`
   - mount explicito para `/portal`
   - `/hub` manteniendo `portal/index.html`

**Por que**

Aunque nginx vaya a ser la capa principal de serving en `dev`, el repo debe quedar coherente tambien para entorno local y para no dejar paths ambiguos.

**Verificacion**

1. `git diff --stat` limitado al slice esperado de 2.1.
2. Validacion local minima de que el arbol contiene `web/index.html`, `web/css/`, `web/js/`, `web/images/`.

**Si falla**

No pasar al VPS. Primero corregir el slice del repo.

---

### Paso 2 — Respaldar la configuracion real de nginx en `dev`

**Que debe hacer el ejecutor**

1. Entrar al VPS de desarrollo.
2. Respaldar el site activo de `dev` antes de editarlo.
3. Registrar la ruta exacta del archivo respaldado.

**Por que**

La Variante B toca el comportamiento por defecto del site. Sin backup inmediato no hay rollback serio.

**Verificacion**

1. Existe un backup con timestamp del site de `prisma-dev`.
2. `nginx -T` o inspeccion equivalente permite ver la configuracion actual antes de modificarla.

**Comando orientativo**

```bash
ssh prisma@212.227.251.125
sudo cp /etc/nginx/sites-enabled/prisma-dev /etc/nginx/sites-enabled/prisma-dev.bak-20260502-variant-b
```

---

### Paso 3 — Preparar la nueva config nginx sin activarla aun

**Que debe hacer el ejecutor**

1. Preparar una copia nueva de la config del site de `dev`, dejando intacta la config activa.
2. En esa copia nueva, ajustar el `root` global para que apunte a `/home/prisma/web-de-prisma-dev/web/`.
3. Declarar ahi mismo las excepciones explicitas para `/apex`, `/portal/`, `/api/` y `/hub`.
4. Cerrar explicitamente el mecanismo de `/hub`: en esta Variante B, `/hub` debe preservarse por **serving directo desde nginx** hacia `portal/index.html` mientras 2.3 no lo mueva. El handler de Express queda como respaldo de entorno local o sin nginx, no como mecanismo principal del remoto.
5. Dejar la config nueva preparada pero aun no activa.

**Por que**

Esta es la esencia de la Variante B, pero ejecutada con orden estricto: primero se prepara la config nueva fuera de linea; solo despues se actualiza repo y app. Asi se reduce al minimo la ventana de inconsistencia visible.

**Verificacion**

1. Existe una config nueva preparada y separada de la activa.
2. La config nueva ya deja explicitos el `root` en `/web/` y las excepciones para `/apex`, `/portal/`, `/api/` y `/hub`.
3. `/hub` ya no queda ambiguo: la regla nueva indica que lo sirve nginx directamente.

**Efecto esperado**

1. Nada cambia aun para usuarios mientras la nueva config no se active.
2. El sitio actual de `dev` sigue estable mientras se prepara el cambio.

---

### Paso 4 — Actualizar el repo desplegado y reiniciar la app

**Que debe hacer el ejecutor**

1. En `~/web-de-prisma-dev`, dejar el repo desplegado en el slice 2.1 aprobado para esta prueba.
2. Reiniciar la app con `pm2 restart prisma-dev` para que Express cargue los cambios de `server/server.js`.
3. Ejecutar este paso y el siguiente como un bloque continuo, sin pausas intermedias evitables.

**Por que**

Si el repo cambia pero nginx sigue con el contrato viejo, o viceversa, aparece una ventana de `403` o `404`. El orden remoto para `dev` queda cerrado asi: **config nueva preparada fuera de linea → repo actualizado → `pm2 restart prisma-dev` → activacion de la config nueva → `nginx -t` → reload**.

**Verificacion**

1. El repo desplegado ya esta en el slice correcto.
2. `pm2 restart prisma-dev` se ejecuto sin error.
3. El ejecutor pasa inmediatamente al paso 5.

**Comandos orientativos**

```bash
cd ~/web-de-prisma-dev
git status --short
pm2 restart prisma-dev
```

---

### Paso 5 — Activar la config preparada, validar sintaxis y recargar nginx

**Que debe hacer el ejecutor**

1. Activar la config nueva ya preparada en el paso 3.
2. Ejecutar validacion de sintaxis antes de cualquier recarga.
3. Recargar nginx solo si la sintaxis pasa.

**Por que**

La activacion debe ocurrir solo cuando repo y app ya estan listos. Asi la ventana de inconsistencia queda limitada a segundos. El `nginx -t` sigue siendo obligatorio para no tirar `dev` por un typo.

**Verificacion**

1. La config activa ya es la nueva.
2. `sudo nginx -t` devuelve exito.
3. La recarga no arroja error.

**Comandos orientativos**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### Paso 6 — Validacion tecnica con cache buster

**Que debe hacer el ejecutor**

Probar, con cache buster y sin confiar en respuestas cacheadas, estas rutas minimas:

1. `/`
2. `/aviso-legal.html`
3. `/cookies.html`
4. `/privacidad.html`
5. `/css/styles.css?v=20260502b`
6. `/js/main.js?v=20260502b`
7. una imagen real bajo `/images/...`
8. `/apex`
9. `/apex/form.css`
10. `/hub`
11. `/portal/analisis/armc/index.html`
12. una ruta `/api/*` segura que ya exista y no altere datos

**Por que**

La Variante B puede parecer estable en `/` y aun asi romper rutas laterales o legacy.

**Verificacion**

1. No hay `403`, `404` ni `500` en las rutas del paquete.
2. El contenido servido corresponde a la ubicacion nueva o a la excepcion declarada, no a un falso positivo de cache.
3. `/hub` y `/portal/...` siguen vivos.

**Nota Cloudflare**

1. Para `dev`, los cache busters bastan para validar.
2. Si este patron se replica luego a produccion, debe incluir purge explicito de cache en Cloudflare o, como minimo, una nota operativa sobre respuestas antiguas retenidas hasta TTL.

**Comandos orientativos**

```bash
curl -I "https://dev.prismaconsul.com/?v=20260502b"
curl -I "https://dev.prismaconsul.com/css/styles.css?v=20260502b"
curl -I "https://dev.prismaconsul.com/js/main.js?v=20260502b"
curl -I "https://dev.prismaconsul.com/apex"
curl -I "https://dev.prismaconsul.com/hub"
curl -I "https://dev.prismaconsul.com/portal/analisis/armc/index.html?v=20260502b"
```

---

### Paso 7 — Validacion humana minima en navegador

**Que debe hacer el ejecutor**

1. Abrir `dev.prismaconsul.com`.
2. Confirmar que la landing carga completa.
3. Entrar a legales.
4. Abrir `/apex`.
5. Abrir `/hub`.
6. Abrir una URL legacy bajo `/portal/analisis/armc/...`.

**Por que**

Los `200` no bastan. Hace falta comprobar rendering real y ausencia de assets rotos.

**Verificacion**

1. No hay estilos faltantes ni JS roto en consola.
2. Las superficies minimas siguen visualmente estables.

---

### Paso 8 — Criterio de aprobacion o aborto

**Aprobar temporalmente el paquete** solo si se cumplen todas estas condiciones:

1. el `root` de `dev` apunta a `/web/`
2. las excepciones para `/apex`, `/hub`, `/portal/` y `/api/` estan explicitas y probadas
3. smoke tests tecnicos PASS
4. validacion humana minima PASS
5. rollback probado o inmediatamente disponible

**Abortar y volver a revision** si ocurre cualquiera de estas condiciones:

1. aparece una ruta publica adicional no contemplada
2. `/hub` queda ambiguo o inestable
3. `/portal/...` legacy deja de funcionar de forma consistente
4. la config exige demasiadas excepciones nuevas no previstas
5. Cloudflare impide verificar con confianza lo que realmente se sirve

---

## 4. Rollback obligatorio si falla

### Paso 9 — Volver al estado previo de `dev`

**Que debe hacer el ejecutor**

1. Restaurar el backup del site `prisma-dev`.
2. Restaurar el repo desplegado a `dev` y sincronizarlo con `origin/dev`.
3. Reiniciar `pm2 restart prisma-dev`.
4. Validar sintaxis.
5. Recargar nginx.
6. Repetir pruebas basicas con cache buster.

**Regla de ejecucion**

Igual que la activacion, el rollback debe ejecutarse como un bloque continuo. En `dev` se tolera una ventana minima de inconsistencia durante la reversa; este patron no debe extrapolarse a produccion sin una estrategia de release mas atomica.

**Comandos orientativos**

```bash
sudo cp /etc/nginx/sites-enabled/prisma-dev.bak-20260502-variant-b /etc/nginx/sites-enabled/prisma-dev
cd ~/web-de-prisma-dev && git checkout dev && git pull origin dev
pm2 restart prisma-dev
sudo nginx -t
sudo systemctl reload nginx
```

**Verificacion**

1. `/`, `/apex`, `/hub` y `/portal/...` vuelven a responder como antes.

---

## 5. Evidencia que debe dejar el ejecutor

Antes de declarar el paso como completado, el ejecutor debe dejar por escrito:

1. que archivo nginx se modifico
2. donde quedo el backup
3. que rutas se validaron
4. que resultado dio cada una
5. si `/hub` quedo servido por nginx o por Express
6. si el paquete queda listo para merge o si debe volver a revision

---

## 6. Regla final

Hasta que este runbook no pase en `dev`, la decision C12 sigue abierta y el subpaso 2.1 no debe considerarse cerrado.