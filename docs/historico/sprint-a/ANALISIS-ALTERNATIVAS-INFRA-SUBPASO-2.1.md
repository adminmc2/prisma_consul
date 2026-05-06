# Analisis de alternativas para destrabar el subpaso 2.1

> **Documento histórico — Sprint A.** Trabajo ya ejecutado o decisión ya cerrada. Cierre formal de Sprint A: 2026-05-05. Movido a `docs/historico/sprint-a/` en el slice de consolidación post-Sprint A. Las referencias internas reflejan el estado en el momento de redacción y no se actualizan al nuevo path.

**Fecha:** 2026-05-02
**Estado:** analisis comparativo cerrado a nivel de decision. La **Variante B** fue seleccionada por el revisor/usuario como camino operativo para retomar 2.1.
**Contexto:** el intento del subpaso 2.1 (`077c56f`) fue correcto en Git y en Express, pero fallo en `dev.prismaconsul.com` porque nginx sirve los estaticos antes de que la peticion llegue a Express.

**Nota de decision posterior:** este documento conserva la comparativa original de alternativas. La decision operativa vigente ya no es la recomendacion tactica inicial de este analisis, sino la **Variante B**. La ejecucion paso a paso queda desarrollada en `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md` y sincronizada con `docs/PLAN-FASE2.md`.

---

## 1. Problema explicado en simple

El plan del subpaso 2.1 asumia esto:

1. mover la landing y los legales a `/web/`
2. cambiar `express.static(...)` para que Express los sirva desde `/web/`
3. desplegar en `dev.prismaconsul.com`
4. comprobar que todo sigue funcionando

Eso habria sido suficiente si Express fuera quien entrega las paginas publicas.

Pero hoy el sistema real funciona asi:

1. **nginx** sirve `/`, `/css`, `/js`, `/images`, `/apex`, `/hub` y en la practica cualquier archivo estatico que encuentre en disco.
2. **Express** recibe principalmente `/api/*`.
3. Cloudflare esta delante y puede esconder errores reales con cache si no se fuerza cache buster.

Por eso el movimiento fisico a `/web/` rompio la landing en dev: nginx siguio buscando `index.html`, `js/`, `css/` e `images/` en la raiz vieja del repo, no en `/web/`.

**Conclusion simple:** el problema no es el commit de Fase 2 en si. El problema es que el plan actual de 2.1 no modela correctamente la infraestructura real de serving.

---

## 2. Hechos tecnicos confirmados

1. En el repo, `server/server.js` hoy sirve estaticos desde `projectRoot`.
2. En el VPS, nginx sirve los estaticos publicos y solo `/api/*` va seguro a Express.
3. El commit `077c56f` funciona si se prueba contra Express directamente.
4. Ese mismo commit falla en `dev.prismaconsul.com` porque nginx intercepta antes.
5. `/hub` y `/apex` no cayeron por el cambio porque el paquete los preservo y porque nginx siguio resolviendo rutas desde el arbol viejo.
6. Los `200` de algunos assets tras el fallo no son fiables por la cache de Cloudflare.

---

## 3. Criterios para elegir alternativa

La decision no debe tomarse solo por "que funciona", sino por estos 6 criterios:

1. **Tiempo de ejecucion**
2. **Riesgo de romper produccion**
3. **Cantidad de infraestructura a tocar**
4. **Mejora arquitectonica real**
5. **Compatibilidad con los siguientes subpasos de Fase 2**
6. **Facilidad de rollback**

---

## 4. Resumen ejecutivo de las 4 variantes

| Variante | Idea central | Tiempo estimado | Riesgo operativo | Mejora arquitectonica | Recomendacion |
|---|---|---:|---:|---:|---|
| A | Mantener nginx sirviendo estaticos, pero anadir una capa de compatibilidad para `/web/` | 0.5 a 1 dia | Bajo-medio | Media | Preferencia tactica original del analisis |
| B | Cambiar el `root` de nginx a `/web/` y crear excepciones explicitas para `/apex`, `/hub`, `/portal` | 0.5 a 1 dia | Medio | Media-alta | **Seleccionada por decision del revisor/usuario** |
| C | Convertir nginx en proxy fino y delegar todo el serving web a Express | 1 a 2 dias | Medio-alto | Alta | Buena a largo plazo, no recomendada como primer destrabe |
| D | No tocar infraestructura aun; introducir un pre-subpaso 2.0 y posponer 2.1 | 0.25 a 0.5 dia de decision, mas retraso de ejecucion | Bajo | Baja-media | Correcta si se prioriza seguridad extrema sobre velocidad |

---

## 5. Variante A — Capa de compatibilidad en nginx (recomendada)

### 5.1 Que significa

No cambiar la arquitectura base de golpe.

Se mantiene este modelo:

1. nginx sigue entregando estaticos publicos
2. Express sigue sirviendo `/api/*` y sus handlers actuales
3. se agrega una capa de compatibilidad para que nginx sepa que la web publica ahora vive en `/web/`

La idea tecnica seria:

1. mantener el `root` general del proyecto o tocarlo lo minimo posible
2. crear reglas explicitas para `/`, legales, `/css/`, `/js/`, `/images/` hacia `/web/`
3. dejar `/apex`, `/hub` y `/portal` apuntando a sus ubicaciones actuales
4. desplegar primero solo en `dev`

### 5.2 Fortalezas

1. Es la opcion con menor radio de impacto.
2. No obliga a redisenar toda la arquitectura de serving.
3. Permite reutilizar casi intacto el commit `077c56f`.
4. Facilita rollback rapido solo revirtiendo config nginx en dev.
5. Compatible con que el ejecutor 2 siga en paralelo en contenido.

### 5.3 Debilidades

1. La logica de routing queda repartida entre nginx y Express.
2. Añade configuracion transitoria que luego habra que mantener o limpiar.
3. Obliga a documentar muy bien que rutas sirve nginx y cuales Express.

### 5.4 Oportunidades

1. Permite desbloquear Fase 2 con el menor cambio posible.
2. Fuerza a documentar por fin el contrato real nginx/Express.
3. Reduce el riesgo de descubrir el mismo problema otra vez en 2.3 o 2.4.

### 5.5 Amenazas

1. Si se implementa "a medias", podrian romperse rutas directas como `/portal/...`.
2. Si no se prueba con cache buster, Cloudflare puede dar una falsa sensacion de exito.
3. Si no se replica bien despues en produccion, dev y prod podrian divergir.

### 5.6 Impacto en el proyecto

1. **Tiempo:** bueno
2. **Riesgo:** controlable
3. **Arquitectura:** mejora incremental, no definitiva
4. **Velocidad de Fase 2:** alta

### 5.7 Mi juicio

Es la mejor opcion para **destrabar ahora** sin convertir este incidente en un rediseño completo de plataforma.

---

## 6. Variante B — Cambiar `root` de nginx a `/web/` con excepciones

### 6.1 Que significa

Mover el punto de entrada principal de nginx para que la web publica salga naturalmente desde `/web/`.

Eso exige declarar excepciones claras para:

1. `/apex`
2. `/hub`
3. `/portal`
4. `/api`

### 6.2 Fortalezas

1. La web publica queda conceptualmente mas limpia.
2. Se parece mas al destino final que quiere el subpaso 2.1.
3. Hace evidente que lo publico ya no vive en la raiz del repo.

### 6.3 Debilidades

1. Toca el comportamiento por defecto de nginx para casi todo.
2. Si falta una sola excepcion, rompes rutas que hoy viven fuera de `/web/`.
3. Aumenta la probabilidad de errores sutiles en `/portal` o `/apex`.

### 6.4 Oportunidades

1. Puede dejar el serving publico mas ordenado que la opcion A.
2. Reduce la tentacion de seguir usando la raiz antigua para nuevas paginas publicas.

### 6.5 Amenazas

1. Mayor superficie de regresion en un solo cambio.
2. Riesgo de romper direct URLs no contempladas.
3. Riesgo de replicar mal la configuracion en produccion.

### 6.6 Impacto en el proyecto

1. **Tiempo:** bueno
2. **Riesgo:** medio
3. **Arquitectura:** mejora mas visible que A
4. **Velocidad de Fase 2:** buena, pero con mas probabilidad de retrabajo

### 6.7 Mi juicio

Es viable, pero solo la elegiria si quien ejecuta domina muy bien nginx y puede garantizar que ninguna ruta legacy queda colgando.

---

## 7. Variante C — Delegar todo el serving web a Express

### 7.1 Que significa

Dejar nginx como proxy fino y hacer que Express sea la unica fuente de verdad para:

1. landing
2. legales
3. `/hub`
4. `/apex`
5. posiblemente `/portal` y `/publicados`

### 7.2 Fortalezas

1. Arquitectonicamente es la opcion mas coherente.
2. El plan de Fase 2 pasaria a depender de un solo sistema de routing.
3. Reduce ambiguedad entre "lo que dice el repo" y "lo que hace el VPS".

### 7.3 Debilidades

1. Cambia una parte importante de infraestructura de golpe.
2. Introduce incertidumbre de rendimiento, cache, encabezados y comportamiento SSL/proxy.
3. Exige una bateria de validacion mucho mas amplia.

### 7.4 Oportunidades

1. Deja la base mas limpia para los subpasos 2.2, 2.3 y 2.4.
2. Reduce deuda tecnica de largo plazo.
3. Facilita reproducir localmente el mismo comportamiento que en remoto.

### 7.5 Amenazas

1. Conversion demasiado grande para un simple desbloqueo.
2. Puede abrir incidentes nuevos no relacionados con Fase 2.
3. Si falla, el rollback tambien es mas delicado.

### 7.6 Impacto en el proyecto

1. **Tiempo:** medio-alto
2. **Riesgo:** medio-alto
3. **Arquitectura:** la mejor de las 4
4. **Velocidad de Fase 2:** peor en el corto plazo, mejor en el largo plazo

### 7.7 Mi juicio

Buena opcion de arquitectura, mala opcion como primer movimiento tactico si el objetivo inmediato es desbloquear 2.1 con seguridad.

---

## 8. Variante D — Introducir un pre-subpaso 2.0 y pausar movimientos fisicos

### 8.1 Que significa

Aceptar que 2.1, tal como esta, no es ejecutable sin antes resolver la capa de infraestructura.

En vez de tocar nginx de inmediato, se hace esto:

1. se congela 2.1
2. se crea un pre-subpaso 2.0 de normalizacion de serving
3. se decide con calma la estrategia A, B o C
4. mientras tanto, el carril contenido puede seguir avanzando en paralelo

### 8.2 Fortalezas

1. Es la opcion mas segura.
2. Evita meter un cambio de infraestructura mal decidido por presion de avance.
3. Protege dev y produccion de un corte evitable.

### 8.3 Debilidades

1. No resuelve el problema; solo lo reordena.
2. Retrasa Fase 2 fisica.
3. Puede generar sensacion de estancamiento.

### 8.4 Oportunidades

1. Permite decidir mejor.
2. Permite que ejecutor 2 siga generando valor sin bloquearse.
3. Puede mejorar la documentacion del serving antes de tocar nada.

### 8.5 Amenazas

1. Si no se cierra pronto, la Fase 2 se fragmenta y pierde impulso.
2. Puede introducir una falsa sensacion de progreso sin destrabar el cuello real.

### 8.6 Impacto en el proyecto

1. **Tiempo:** bajo al inicio, alto si se prolonga
2. **Riesgo:** muy bajo
3. **Arquitectura:** no mejora por si sola
4. **Velocidad de Fase 2:** baja

### 8.7 Mi juicio

Es valida si el equipo quiere maximizar seguridad y minimizar decisiones apresuradas. No es la mejor si el objetivo es destrabar rapido con un cambio razonable.

---

## 9. Comparativa SWOT condensada

| Variante | Fortalezas | Debilidades | Oportunidades | Amenazas |
|---|---|---|---|---|
| A | menor radio de impacto, reaprovecha trabajo ya hecho, rollback simple | logica repartida nginx/Express | desbloquea ya, documenta la realidad del stack | olvidar rutas legacy, falsos positivos por cache |
| B | serving publico mas limpio, mas cercano al destino final | mas excepciones y mayor fragilidad | ordena mejor la web publica | romper `/apex`, `/portal` o legacy sin verlo |
| C | fuente unica de verdad, mejor arquitectura futura | cambio grande de infraestructura | simplifica fases futuras | abre incidentes nuevos innecesarios |
| D | riesgo minimo, protege entorno | no soluciona aun | deja seguir contenido y pensar bien | retrasar Fase 2 demasiado |

---

## 10. Decision operativa vigente

### Decision tomada

**Se ejecutara la Variante B** como movimiento inmediato.

Eso significa:

1. cambio del `root` global del site de `dev` para que la web publica salga desde `/web/`
2. excepciones explicitas para `/apex`, `/hub`, `/portal/` y `/api/`
3. validacion en `dev` con cache buster y smoke tests completos
4. solo si todo pasa, considerar el paquete como mergeable y luego preparar replica controlada en produccion

### Reserva tecnica que sigue vigente

Aunque la decision del revisor es B, la advertencia tecnica original sigue aplicando: si el cambio de `root` global obliga a demasiadas excepciones o rompe rutas legacy no inventariadas, el paquete debe abortarse y reclasificarse como pre-subpaso de infraestructura antes de insistir.

### Documento operativo aplicable

La ejecucion ya no debe derivarse de esta comparativa por si sola. El ejecutor debe seguir el runbook operativo en `docs/RUNBOOK-EJECUTOR-VARIANTE-B-SUBPASO-2.1.md`.

---

## 11. Decision registrada para el usuario

Queda registrada esta decision:

**Variante B — cambio del `root` global a `/web/` con excepciones explicitas, primero en `dev`.**

Condiciones de la decision:

1. No tocar produccion en esta iteracion.
2. No fusionar el slice a `main` ni a `dev` hasta terminar la validacion runtime en `dev.prismaconsul.com`.
3. Mantener rollback inmediato de la configuracion nginx de `dev`.
4. Documentar evidencia de la prueba antes de declarar 2.1 como ejecutable.

---

## 12. Preguntas que deben quedar respondidas antes de ejecutar

1. ¿Se autoriza tocar `/etc/nginx/sites-enabled/prisma-dev`?
2. ¿La primera ejecucion sera solo en `dev` y sin tocar produccion? (recomendado: si)
3. ¿Se quiere una solucion tactica para destrabar ya, o una mejora arquitectonica mas profunda?
4. ¿Se quiere preservar al maximo el comportamiento actual de `/apex`, `/hub` y `/portal/...`?
5. ¿Se acepta introducir un subpaso 2.0 de infraestructura si la Variante A resulta mas compleja de lo esperado?
