# docs/ — Documentación del repo

Instrucciones locales para trabajar dentro de `docs/`. No describe el sistema de gobierno del proyecto — eso vive en `docs/OPERATIVA.md`. Aquí solo cómo tratar la carpeta.

## Qué vive aquí

Documentos canónicos vigentes del repo. Mapa completo, con ciclo de vida y condición de archivo de cada uno: `docs/OPERATIVA.md` §0.5. No replico la tabla aquí.

`docs/historico/` recoge documentación archivada: snapshots cuando concluye su utilidad, planes vigentes-con-caducidad tras cerrar su fase, y trabajo cerrado que ya no es vigente.

## Cabecera obligatoria

Todo documento canónico vigente lleva en cabecera **`Estado`** y **`Última verificación`** (regla de `docs/OPERATIVA.md` §0.4). Al editar, actualizar `Última verificación` cuando el cambio modifica el contenido material; no para cambios puramente cosméticos.

## Cuándo mover algo a `docs/historico/`

- Cuando un documento `vigente con caducidad` cumple su condición de archivo (declarada en su propia cabecera y en la tabla de OPERATIVA §0.5).
- Cuando un `snapshot` concluye su utilidad de referencia.
- Cuando un documento queda explícitamente como `histórico cerrado`.

El movimiento se hace con `git mv`, conservando historia. Nunca se borra contenido archivado sin pasar por el revisor.

## Límite frente a `docs/OPERATIVA.md`

Si lo que vas a escribir describe **cómo se trabaja** en el proyecto (roles, capas, escalado, handoff, validación, condiciones inviolables), **no va aquí**: va a `OPERATIVA.md` y requiere arbitraje del revisor para entrar. `docs/` recoge documentación del producto, del modelo, del plan y de procesos puntuales — no la operativa del trabajo.
