# Guía de Diseño - Prisma Consul

## 1. Información del Proyecto

- **Nombre**: Prisma Consul (Consultoría / Consulting)
- **Sector**: Consultoría farmacéutica
- **Público objetivo**: Distribuidores y empresas (PyMEs) que desarrollan fármacos
- **Tipo de web**: Landing page
- **Idiomas**: Español e Inglés (bilingüe)
- **Hosting**: IONOS
- **CMS**: WordPress

### Concepto de marca: PRISMA

El nombre **PRISMA** es un acrónimo que representa las áreas de especialización:

| Letra | Área |
|-------|------|
| **P** | Pharma |
| **R** | Research |
| **I** | Innovation |
| **S** | Strategy |
| **M** | Marketing |
| **A** | Analytics |

**Metáfora visual**: Un prisma refracta la luz en múltiples colores → Prisma Consul descompone problemas complejos en soluciones claras y definidas.

**Ventajas del nombre**:
- Profesional y científico
- Funciona en español e inglés
- Memorable y con significado

### Estrategia Visual: "Radiancia Anclada"

La marca combina dos conceptos:
- **Ancla de estabilidad**: Colores oscuros (Navy, Gris) que representan el rigor y la experiencia de la consultoría
- **Haz de innovación**: Colores brillantes (Cyan, Púrpura) que representan la innovación biotecnológica y el insight estratégico

Este enfoque de alto contraste es ideal para interfaces digitales modernas y modo oscuro.

---

## 2. Paleta de Colores Corporativos

### 2.1 Colores Principales

| Nombre | Hex | RGB | Rol |
|--------|-----|-----|-----|
| **Prisma Navy** | `#101B2C` | 16, 27, 44 | Fondos principales, headers, máximo contraste |
| **Prisma Carbon** | `#36454F` | 54, 69, 79 | Textos principales, elementos estructurales |
| **Clinical White** | `#FAF9F6` | 250, 249, 246 | Fondos claros, lienzo principal |

### 2.2 Colores de Acento

| Nombre | Hex | RGB | Rol |
|--------|-----|-----|-----|
| **Soft Blue** | `#A1B8F2` | 161, 184, 242 | Acentos suaves, fondos secundarios, hover states |
| **Tech Cyan** | `#31BEEF` | 49, 190, 239 | Botones primarios, CTAs, enlaces activos |
| **Pure Cyan** | `#00FFFF` | 0, 255, 255 | Acentos vibrantes, destacados especiales, gráficos |
| **Visionary Violet** | `#994E95` | 153, 78, 149 | Estrategia, premium, diferenciación |

### 2.3 Combinaciones Recomendadas

**Modo Claro (Light Mode):**
- Fondo: Clinical White (`#FAF9F6`)
- Texto principal: Prisma Carbon (`#36454F`)
- Títulos: Prisma Navy (`#101B2C`)
- CTAs: Tech Cyan (`#31BEEF`)
- Acentos: Visionary Violet (`#994E95`)

**Modo Oscuro (Dark Mode):**
- Fondo: Prisma Navy (`#101B2C`)
- Texto principal: Clinical White (`#FAF9F6`)
- Acentos brillantes: Tech Cyan (`#31BEEF`), Pure Cyan (`#00FFFF`)
- Destacados: Visionary Violet (`#994E95`)

### 2.4 Reglas de Accesibilidad (WCAG 2.1)

**✅ Combinaciones PERMITIDAS para texto:**
| Combinación | Ratio | Cumple |
|-------------|-------|--------|
| Prisma Carbon (`#36454F`) sobre Clinical White (`#FAF9F6`) | >9:1 | ✅ AAA |
| Clinical White (`#FAF9F6`) sobre Prisma Navy (`#101B2C`) | >12:1 | ✅ AAA |
| Prisma Navy (`#101B2C`) sobre Clinical White (`#FAF9F6`) | >12:1 | ✅ AAA |

**❌ Combinaciones PROHIBIDAS para texto:**
- Tech Cyan (`#31BEEF`) sobre Clinical White → Ratio bajo, ilegible
- Pure Cyan (`#00FFFF`) sobre Clinical White → Ratio muy bajo
- Visionary Violet (`#994E95`) sobre Prisma Navy → Contraste insuficiente

**Regla de oro**: Los colores de acento (Cyan, Púrpura) se usan SOLO para:
- Elementos gráficos (iconos, líneas, formas)
- Botones con texto blanco/oscuro
- Fondos de badges con texto contrastante
- Visualización de datos

---

## 3. Logo

- **Ubicación del archivo**: `/images/logo.svg`
- **Formato**: SVG (vectorial)
- **Estilo**: Minimalista, geométrico, profesional
- **Texto incluido**: "consulting"

### Versiones del logo necesarias:
- [ ] Logo sobre fondo oscuro (colores claros)
- [ ] Logo sobre fondo claro (colores oscuros)
- [ ] Favicon (versión simplificada)

### Espacio de respeto:
El logo debe tener un margen mínimo equivalente a la altura de la "P" del isotipo en todos sus lados.

---

## 4. Tipografías

### Tipografías corporativas (Google Fonts - Gratuitas):

**Quicksand** (Títulos y encabezados)
- Variantes: Light (300), Regular (400), Medium (500), Bold (700)
- Uso: H1, H2, H3, navegación, botones
- Estilo: Redondeada, moderna, amigable pero profesional
- [Google Fonts](https://fonts.google.com/specimen/Quicksand)

**Source Sans 3** (Cuerpo de texto)
- Variantes: Light (300), Regular (400), SemiBold (600)
- Uso: Párrafos, descripciones, textos largos
- Estilo: Legible, versátil, optimizada para pantallas
- [Google Fonts](https://fonts.google.com/specimen/Source+Sans+3)

**Varela Round** (Elementos especiales)
- Uso: Badges, etiquetas, acentos tipográficos, datos destacados
- Estilo: Geométrica, redondeada, limpia
- [Google Fonts](https://fonts.google.com/specimen/Varela+Round)

### Jerarquía tipográfica:

| Elemento | Fuente | Peso | Tamaño (desktop) |
|----------|--------|------|------------------|
| H1 | Quicksand | Bold (700) | 48-56px |
| H2 | Quicksand | Medium (500) | 36-40px |
| H3 | Quicksand | Medium (500) | 24-28px |
| H4 | Quicksand | Regular (400) | 20-22px |
| Párrafo | Source Sans 3 | Regular (400) | 16-18px |
| Pequeño | Source Sans 3 | Light (300) | 14px |
| Badges | Varela Round | Regular | 12-14px |
| Botones | Quicksand | Medium (500) | 14-16px |

---

## 5. Estructura de la Landing Page

### Secciones:

1. **Header/Navegación**
   - Logo
   - Menú de navegación
   - Selector de idioma (ES/EN)
   - CTA principal

2. **Hero Section**
   - Título principal con propuesta de valor
   - Subtítulo descriptivo
   - CTA (Call to Action)
   - Imagen/ilustración representativa

3. **Servicios (PRISMA)**
   - 6 servicios basados en el acrónimo
   - Iconos representativos
   - Breve descripción de cada uno

4. **Sobre Nosotros / Propuesta de Valor**
   - Quiénes somos
   - Misión/Visión
   - Diferenciadores

5. **Por qué elegir Prisma Consul**
   - Beneficios clave
   - Estadísticas o logros (si los hay)

6. **Clientes / Casos de éxito** (opcional)
   - Logos de clientes
   - Testimonios

7. **Contacto**
   - Formulario de contacto
   - Información de contacto

8. **Footer**
   - Logo
   - Enlaces rápidos
   - Redes sociales
   - Información legal
   - Copyright

---

## 6. Servicios PRISMA

Basados en el acrónimo de la marca:

| Servicio | Descripción |
|----------|-------------|
| **P - Pharma** | Consultoría especializada en el sector farmacéutico |
| **R - Research** | Investigación de mercado y análisis competitivo |
| **I - Innovation** | Estrategias de innovación y desarrollo |
| **S - Strategy** | Planificación estratégica y business development |
| **M - Marketing** | Marketing farmacéutico y comunicación |
| **A - Analytics** | Análisis de datos y business intelligence |

*Pendiente: Desarrollar descripciones detalladas de cada servicio*

---

## 7. Implementación Digital

### 7.1 Variables CSS

```css
/* Variables de Color para PRISMA Consul */
:root {
  /* Colores principales */
  --prisma-navy: #101B2C;
  --prisma-carbon: #36454F;
  --clinical-white: #FAF9F6;

  /* Colores de acento */
  --soft-blue: #A1B8F2;
  --tech-cyan: #31BEEF;
  --pure-cyan: #00FFFF;
  --visionary-violet: #994E95;

  /* Modo claro (por defecto) */
  --bg-primary: var(--clinical-white);
  --bg-secondary: #F0F4F8;
  --text-primary: var(--prisma-carbon);
  --text-heading: var(--prisma-navy);
  --accent-primary: var(--tech-cyan);
  --accent-secondary: var(--visionary-violet);
}

/* Modo oscuro */
[data-theme="dark"] {
  --bg-primary: var(--prisma-navy);
  --bg-secondary: #1a2535;
  --text-primary: var(--clinical-white);
  --text-heading: var(--clinical-white);
  --accent-primary: var(--tech-cyan);
  --accent-secondary: var(--pure-cyan);
}
```

### 7.2 Tipografías (Google Fonts import)

```css
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&family=Source+Sans+3:wght@300;400;600&family=Varela+Round&display=swap');

:root {
  --font-heading: 'Quicksand', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;
  --font-accent: 'Varela Round', sans-serif;
}
```

---

## 8. Requisitos Técnicos

- **Responsive**: Adaptable a móvil, tablet y desktop
- **Velocidad**: Optimización de imágenes (WebP), lazy loading
- **SEO**: Meta tags, estructura semántica, schema markup
- **Accesibilidad**: WCAG 2.1 AA mínimo, contraste adecuado, textos alternativos
- **RGPD**: Aviso de cookies, política de privacidad
- **Multiidioma**: Plugin a definir (WPML, Polylang, etc.)
- **SSL**: Certificado HTTPS (incluido en IONOS)

---

## 9. Contenido Pendiente

- [ ] Textos para cada sección (ES/EN)
- [ ] Imágenes/fotografías profesionales
- [ ] Iconos para servicios PRISMA
- [ ] Información de contacto
- [ ] Textos legales (Política de privacidad, Aviso legal, Cookies)
- [ ] Descripción detallada de servicios

---

## 10. Referencias / Inspiración

*Añadir aquí URLs de páginas web que sirvan de inspiración*

---

## 11. Notas Adicionales

### Diferenciación competitiva:
- **Consultoras tradicionales** (McKinsey, BCG): Verdes profundos, azules marinos → "Establecimiento"
- **Servicios farmacéuticos** (IQVIA): Azules tecnológicos, grises fríos → "Datos fríos"
- **PRISMA Consul**: Navy + Cyan + Púrpura → "Rigor + Innovación + Visión estratégica"

### Mensaje visual:
> "Estamos fundamentados en el rigor de la consultoría (Navy/Carbon), pero somos nativos de la revolución biotecnológica (Cyan) y ofrecemos una visión estratégica creativa (Violet)."

---

**Documento creado**: Enero 2026
**Última actualización**: Enero 2026
