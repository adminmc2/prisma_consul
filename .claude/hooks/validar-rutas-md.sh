#!/bin/sh
# Hook PreToolUse (Bash) — validador de rutas en archivos .md staged.
#
# Es un hook de Claude Code, NO un git hook nativo del repo. Solo se dispara
# cuando Claude ejecuta `git commit`; commits del usuario en terminal o de
# otros agentes no pasan por aquí.
#
# Avisa cuando un .md staged mencione una ruta resoluble dentro de ESTE repo
# que no exista en el árbol. NUNCA bloquea: exit 0 siempre.
#
# Lee el JSON del evento por stdin. Decide solo con la rama de salida JSON.

input=$(cat)

case "$input" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0

md_files=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep '\.md$')
[ -z "$md_files" ] && exit 0

# Docs por naturaleza históricos: referencian rutas legacy a propósito.
# No se barren para no convertir el hook en sirena constante.
md_files=$(printf '%s\n' "$md_files" | grep -v -x -E 'CHANGELOG\.md|REVIEW-PRISMA-APEX\.md')
[ -z "$md_files" ] && exit 0

# Allowlist: carpetas top-level válidas y archivos raíz canónicos.
top_dirs=" web prisma-apex server shared docs .claude .github images "
root_files=" CLAUDE.md CHANGELOG.md CONTRATOS.md ECOSISTEMA.md GLOSARIO.md MODELO-DOMINIO.md README.md REGISTRO-RUTAS.md REVIEW-PRISMA-APEX.md "

# Prefijos de otros repos del ecosistema: fuera de alcance, silencio.
ecosystem_prefixes="prisma-trabajo-clientes/ prisma-consulting/ apex-agents/ above-pharma/ prisma-server-ops/"

tmp=$(mktemp 2>/dev/null) || exit 0
trap 'rm -f "$tmp"' EXIT

# Extrae candidatos (archivo<TAB>línea<TAB>candidato) de cada .md staged.
for md in $md_files; do
  [ -f "$md" ] || continue
  awk -v md="$md" '
    {
      s = $0
      # Path-shaped tokens: al menos un "/". Excluye delimitadores típicos de
      # prosa/markdown (espacio, <>, paréntesis, comillas, corchetes, backtick,
      # pipe, llaves). Acepta bytes no-ASCII (UTF-8) dentro de los segmentos.
      while (match(s, /(\.\.\/|\.\/)?[^][[:space:]<>()"`|{}:]+(\/[^][[:space:]<>()"`|{}:]+)+\/?/)) {
        cand = substr(s, RSTART, RLENGTH)
        pre = (RSTART > 1) ? substr(s, RSTART-1, 1) : ""
        if (pre != ":" && pre != "/") print md "\t" NR "\t" cand
        s = substr(s, RSTART + RLENGTH)
      }
      s = $0
      # Archivos raíz canónicos (siempre ASCII): CLAUDE.md, CHANGELOG.md, etc.
      while (match(s, /[A-Z][A-Za-z0-9_-]+\.md/)) {
        cand = substr(s, RSTART, RLENGTH)
        print md "\t" NR "\t" cand
        s = substr(s, RSTART + RLENGTH)
      }
    }
  ' "$md" >> "$tmp"
done

warnings=""
TAB=$(printf '\t')

while IFS="$TAB" read -r md lineno cand; do
  [ -z "$cand" ] && continue

  # Quita puntuación final de prosa (no parte del path real).
  while :; do
    case "$cand" in
      *.|*,|*\;|*:) cand="${cand%?}" ;;
      *) break ;;
    esac
  done
  [ -z "$cand" ] && continue

  # Filtros de exclusión (placeholders, globs, paths absolutos, URLs).
  case "$cand" in
    *"..."*|*"["*|*"]"*|*"*"*) continue ;;
    "~/"*|"/home/"*|"/Users/"*|"/etc/"*|"/var/"*) continue ;;
    "http"*|"https"*) continue ;;
  esac

  # Prefijos de otros repos: fuera de alcance, silencio.
  skip=""
  for prefix in $ecosystem_prefixes; do
    case "$cand" in
      "$prefix"*) skip="yes" ; break ;;
    esac
  done
  [ -n "$skip" ] && continue

  # URL pública (empieza por "/"): fuera de alcance del hook de filesystem.
  case "$cand" in
    /*) continue ;;
  esac

  # Normalización.
  norm="$cand"
  md_dir=$(dirname "$md")
  case "$norm" in
    "./"*)            norm="${norm#./}" ;;
    "../"*)
      norm="${md_dir}/${norm}"
      while echo "$norm" | grep -q '/[^/][^/]*/\.\./'; do
        norm=$(echo "$norm" | sed 's|/[^/][^/]*/\.\./|/|')
      done
      norm="${norm#./}"
      ;;
    "web-de-prisma/"*) norm="${norm#web-de-prisma/}" ;;
  esac

  # ¿Encaja en allowlist? (top-dir o root file canónico)
  first_seg="${norm%%/*}"
  case " $top_dirs " in
    *" $first_seg "*) ;;
    *)
      case " $root_files " in
        *" $first_seg "*) ;;
        *) continue ;;
      esac
      ;;
  esac

  # ¿Existe en el árbol?
  if [ ! -e "$norm" ]; then
    warnings="${warnings}\\n  ${md}:${lineno}\\n    ⚠ ruta no existe en el árbol: ${cand}"
  fi
done < "$tmp"

if [ -n "$warnings" ]; then
  msg="[validar-rutas-md] avisos detectados:${warnings}\\n\\nEl commit continúa (modo aviso)."
  esc=$(printf '%s' "$msg" | sed 's/\\/\\\\/g; s/"/\\"/g')
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"%s"}}' "$esc"
fi

exit 0