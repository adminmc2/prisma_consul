#!/bin/sh
# Hook PreToolUse (Bash). Cuando un `git commit` incluye cambios estructurales
# (código de serving, movimientos/renombrados, carpetas de app), recuerda correr
# /revisar-docs para detectar documentación desactualizada. NUNCA bloquea.
#
# Lee el JSON del evento por stdin. Decide solo con la rama de salida JSON.

input=$(cat)

# Solo actúa si el comando es un git commit.
case "$input" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

# Cambios en stage, con estado (A/M/D/R...).
changed=$(git diff --cached --name-status 2>/dev/null)
[ -z "$changed" ] && exit 0

# ¿Hay renombrados o ficheros estructurales no-documentales?
structural=$(printf '%s\n' "$changed" | grep -E '^R|server/server\.js|prisma-apex/.*\.(html|js|css)|server/routes/|web/.*\.(html|js|css)|shared/')

if [ -n "$structural" ]; then
  printf '%s' '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"Recordatorio anti-deriva: este commit toca archivos estructurales (serving, rutas o movimientos). Considera correr /revisar-docs antes de cerrar el slice para verificar que la documentación sigue coherente con el repo."}}'
fi

exit 0