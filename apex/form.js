/**
 * APEX Discovery Form - JavaScript
 * Integración con Groq AI para preguntas adaptativas y detección de dolores
 *
 * NUEVO: Investigación profunda de empresa antes de preguntas
 *
 * Modelos usados:
 * - Llama 3.3 70B Versatile: Investigación, generación de preguntas y detección de pains
 * - Whisper Large v3 Turbo: Transcripción de audio
 */

// ============================================================
// CONFIGURACIÓN
// ============================================================

const CONFIG = {
  // Netlify Functions (proxy seguro para Groq API)
  chatApiUrl: '/.netlify/functions/groq-chat',
  whisperApiUrl: '/.netlify/functions/groq-whisper',
  submitApiUrl: '/.netlify/functions/submit-form',
  researchApiUrl: '/.netlify/functions/research-company',

  // Modelos
  groqModel: 'llama-3.3-70b-versatile',
  whisperModel: 'whisper-large-v3-turbo',

  // Animaciones
  transitionDuration: 400,
  loadingMinDuration: 2000,

  // Audio
  maxAudioDuration: 180, // 3 minutos
  minAudioDuration: 10,  // 10 segundos mínimo
};

// ============================================================
// BASE DE CONOCIMIENTO DE DOLORES (500+ dolores)
// Cargada desde pain-knowledge-base.js
// ============================================================

// La base de conocimientos se carga desde pain-knowledge-base.js
// Las variables PAIN_CATALOG, PAIN_CLUSTERS y CLUSTER_QUESTIONS ya están disponibles globalmente

// Log de carga
if (typeof PAIN_CATALOG !== 'undefined' && Object.keys(PAIN_CATALOG).length > 0) {
  console.log(`APEX: Base de conocimientos cargada (${Object.keys(PAIN_CATALOG).length} dolores, ${Object.keys(PAIN_CLUSTERS).length} clusters)`);
} else {
  console.warn('APEX: Base de conocimientos no encontrada o vacía');
}

// Prioridades de exploración por contexto
const EXPLORATION_PRIORITY = {
  // Nivel 1: Siempre explorar (90%+ de prospectos)
  level1: ['A', 'D', 'F'],  // Visibilidad, Ventas, Reportes
  // Nivel 2: Explorar si aplica
  level2: ['E', 'B', 'G'],  // Cobranza (si vende a crédito), Contactos, Tecnología
  // Nivel 3: Explorar si menciona o aplica al sector
  level3_pharma: ['C', 'L'],  // Muestras, Compliance
  level3_general: ['H', 'K', 'M', 'P'],  // Comunicación, Planificación, RRHH, Automatización
};

// ============================================================
// ESTADO DEL FORMULARIO
// ============================================================

const FormState = {
  currentScreen: 'welcome',
  currentPhase: 0,

  // Información de la empresa (NUEVO)
  company: {
    name: '',
    website: '',
    profile: null,  // Perfil investigado por IA
    researchComplete: false
  },

  // Respuestas
  responses: {
    phase1: {},
    phase2: {},
    adaptiveQuestions: [],
    currentAdaptiveIndex: 0
  },

  // Pains detectados
  detectedPains: [],
  finalPains: [],
  painsConfirmed: null,

  // Audio
  audioBlob: null,
  audioUrl: null,
  audioTranscription: '',

  // Contacto
  contact: {
    name: '',
    company: '',
    email: '',
    whatsapp: ''
  },

  // Navegación
  screenHistory: ['welcome'],
  totalQuestions: 7,
  answeredQuestions: 0
};

// ============================================================
// ELEMENTOS DEL DOM
// ============================================================

let DOM = {};

function initDOM() {
  DOM = {
    // Contenedores
    formContainer: document.getElementById('formContainer'),
    progressFill: document.getElementById('progressFill'),
    formNav: document.getElementById('formNav'),
    keyboardHints: document.getElementById('keyboardHints'),

    // Navegación
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    navCurrent: document.getElementById('navCurrent'),
    navTotal: document.getElementById('navTotal'),

    // Pantallas
    screens: document.querySelectorAll('.form-screen'),

    // Empresa (NUEVO)
    companyInput: document.getElementById('companyInput'),
    btnResearchCompany: document.getElementById('btnResearchCompany'),
    companyResearchStatus: document.getElementById('companyResearchStatus'),

    // Fase 2 - Adaptativo
    adaptiveQuestionNumber: document.getElementById('adaptiveQuestionNumber'),
    adaptiveQuestionTitle: document.getElementById('adaptiveQuestionTitle'),
    adaptiveQuestionHint: document.getElementById('adaptiveQuestionHint'),
    adaptiveOptions: document.getElementById('adaptiveOptions'),

    // Fase 3 - Pains
    painsList: document.getElementById('painsList'),
    btnConfirmPains: document.getElementById('btnConfirmPains'),
    btnAdjustPains: document.getElementById('btnAdjustPains'),

    // Fase 4 - Audio
    audioTitle: document.getElementById('audioTitle'),
    audioSubtitle: document.getElementById('audioSubtitle'),
    audioPrompts: document.getElementById('audioPrompts'),
    audioRecorder: document.getElementById('audioRecorder'),
    recorderVisualizer: document.getElementById('recorderVisualizer'),
    recorderTimer: document.getElementById('recorderTimer'),
    recorderBtn: document.getElementById('recorderBtn'),
    recorderStatus: document.getElementById('recorderStatus'),
    audioPreview: document.getElementById('audioPreview'),
    audioPlayer: document.getElementById('audioPlayer'),
    btnRerecord: document.getElementById('btnRerecord'),
    btnUseAudio: document.getElementById('btnUseAudio'),

    // Fase 5 - Final
    finalPainsList: document.getElementById('finalPainsList'),
    contactForm: document.getElementById('contactForm'),
    contactName: document.getElementById('contactName'),
    contactCompany: document.getElementById('contactCompany'),
    contactEmail: document.getElementById('contactEmail'),
    contactWhatsapp: document.getElementById('contactWhatsapp'),

    // Thank you
    thanksName: document.getElementById('thanksName'),

    // Botones especiales
    btnStart: document.getElementById('btnStart'),
    btnContinueQ4: document.getElementById('btnContinueQ4'),
    btnContinueQ5: document.getElementById('btnContinueQ5'),
    btnContinueResearch: document.getElementById('btnContinueResearch'),
  };
}

// ============================================================
// UTILIDADES
// ============================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getScreen(screenName) {
  return document.querySelector(`[data-screen="${screenName}"]`);
}

function updateProgress() {
  const totalScreens = 14;
  const currentIndex = FormState.screenHistory.length;
  const progress = Math.min((currentIndex / totalScreens) * 100, 100);
  DOM.progressFill.style.width = `${progress}%`;
}

function showNav(show = true) {
  DOM.formNav.classList.toggle('hidden', !show);
}


// ============================================================
// NAVEGACIÓN DE PANTALLAS
// ============================================================

async function goToScreen(screenName, addToHistory = true) {
  const currentScreenEl = getScreen(FormState.currentScreen);
  const nextScreenEl = getScreen(screenName);

  if (!nextScreenEl) {
    console.error(`Screen not found: ${screenName}`);
    return;
  }

  // Animación de salida
  if (currentScreenEl) {
    currentScreenEl.classList.remove('active');
    currentScreenEl.classList.add('exit');
  }

  await sleep(CONFIG.transitionDuration);

  // Limpiar estado anterior
  if (currentScreenEl) {
    currentScreenEl.classList.remove('exit');
  }

  // Activar nueva pantalla
  nextScreenEl.classList.add('active');

  // Actualizar estado
  FormState.currentScreen = screenName;
  if (addToHistory) {
    FormState.screenHistory.push(screenName);
  }

  // Actualizar UI
  updateProgress();
  updateNavigationState();

  // Ejecutar hooks de pantalla
  await onScreenEnter(screenName);
}

function updateNavigationState() {
  const screen = FormState.currentScreen;

  // Mostrar/ocultar navegación según pantalla
  const hideNavScreens = ['welcome', 'thank-you', 'transition-phase2', 'transition-phase3', 'processing-audio', 'researching-company'];
  showNav(!hideNavScreens.includes(screen));

  // Actualizar contador
  DOM.navCurrent.textContent = FormState.answeredQuestions;
  DOM.navTotal.textContent = FormState.totalQuestions;

  // Botón anterior
  DOM.btnPrev.disabled = FormState.screenHistory.length <= 2;
}

async function goBack() {
  if (FormState.screenHistory.length > 1) {
    FormState.screenHistory.pop();
    const previousScreen = FormState.screenHistory[FormState.screenHistory.length - 1];
    await goToScreen(previousScreen, false);
  }
}

// ============================================================
// HOOKS DE PANTALLA
// ============================================================

async function onScreenEnter(screenName) {
  switch (screenName) {
    case 'researching-company':
      await handleResearchCompany();
      break;
    case 'transition-phase2':
      await handleTransitionToPhase2();
      break;
    case 'phase2-questions':
      await renderAdaptiveQuestion();
      break;
    case 'transition-phase3':
      await handleTransitionToPhase3();
      break;
    case 'pains-detected':
      renderDetectedPains();
      break;
    case 'audio-record':
      setupAudioRecorder();
      break;
    case 'processing-audio':
      await handleProcessingAudio();
      break;
    case 'final-pains':
      renderFinalPains();
      break;
    case 'contact-info':
      focusContactForm();
      break;
  }
}

// ============================================================
// NUEVA FASE 0: INVESTIGACIÓN DE EMPRESA
// ============================================================

async function handleCompanySubmit() {
  const input = DOM.companyInput.value.trim();

  if (!input) {
    DOM.companyInput.focus();
    return;
  }

  // Determinar si es nombre o URL
  const isUrl = input.includes('.') && (input.includes('http') || input.includes('www') || /\.[a-z]{2,}$/i.test(input));

  FormState.company.name = isUrl ? '' : input;
  FormState.company.website = isUrl ? (input.startsWith('http') ? input : `https://${input}`) : '';

  // Ir a pantalla de investigación
  await goToScreen('researching-company');
}

async function handleResearchCompany() {
  const btnContinue = DOM.btnContinueResearch;

  // Deshabilitar botón mientras investiga
  if (btnContinue) {
    btnContinue.disabled = true;
    btnContinue.querySelector('span').textContent = 'Buscando...';
  }

  try {
    const response = await fetch(CONFIG.researchApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: FormState.company.name,
        website: FormState.company.website
      })
    });

    const data = await response.json();
    console.log('Research results:', data);

    if (data.success && data.profile) {
      FormState.company.profile = data.profile;
      FormState.company.researchComplete = true;

      // Pre-rellenar sector si lo detectamos
      if (data.profile.empresa?.sector) {
        FormState.responses.phase1.sector = data.profile.empresa.sector;
      }
      if (data.profile.empresa?.tiene_equipo_campo !== undefined) {
        FormState.responses.phase1.has_field_team = data.profile.empresa.tiene_equipo_campo ? 'yes' : 'no';
      }

      // Mostrar resultados
      showResearchResults(data.profile, data.hadWebSearch);
    } else {
      FormState.company.profile = data.profile;
      showResearchResults(null, false);
    }

  } catch (error) {
    console.error('Error researching company:', error);
    showResearchResults(null, false);
  }

  // Habilitar botón
  if (btnContinue) {
    btnContinue.disabled = false;
    btnContinue.querySelector('span').textContent = 'Continuar';
  }
}

// Mostrar los resultados de la investigación en la UI
function showResearchResults(profile, hadWebSearch) {
  const searchingSection = document.getElementById('researchSearching');
  const resultsSection = document.getElementById('researchResults');

  const sectorNames = {
    'pharma': 'Farmacéutico / Dispositivos médicos',
    'distribution': 'Distribución / Mayorista',
    'manufacturing': 'Manufactura / Producción',
    'services': 'Servicios profesionales',
    'retail': 'Retail / Comercio',
    'other': 'Otro sector'
  };

  // Ocultar búsqueda, mostrar resultados
  if (searchingSection) searchingSection.style.display = 'none';
  if (resultsSection) resultsSection.style.display = 'block';

  const nameEl = document.getElementById('findingName');
  const sectorEl = document.getElementById('findingSector');
  const descEl = document.getElementById('findingDescription');
  const fieldTeamCard = document.getElementById('findingFieldTeamCard');
  const fieldTeamEl = document.getElementById('findingFieldTeam');
  const samplesCard = document.getElementById('findingSamplesCard');
  const samplesEl = document.getElementById('findingSamples');
  const confidenceEl = document.getElementById('researchConfidence');

  if (profile && profile.empresa) {
    if (nameEl) nameEl.textContent = profile.empresa.nombre || FormState.company.name || 'Tu empresa';
    if (sectorEl) sectorEl.textContent = sectorNames[profile.empresa.sector] || profile.empresa.sector || 'No identificado';
    if (descEl) descEl.textContent = profile.empresa.descripcion || 'Sin descripción disponible';

    // Mostrar equipo de campo si aplica
    if (profile.empresa.tiene_equipo_campo !== undefined && fieldTeamCard) {
      fieldTeamCard.style.display = 'block';
      if (fieldTeamEl) fieldTeamEl.textContent = profile.empresa.tiene_equipo_campo ? 'Sí, cuenta con equipo en campo' : 'No detectado';
    }

    // Mostrar muestras si es pharma
    if (profile.empresa.sector === 'pharma' && samplesCard) {
      samplesCard.style.display = 'block';
      if (samplesEl) samplesEl.textContent = profile.empresa.tiene_muestras_medicas ? 'Sí, maneja muestras médicas' : 'No detectado';
    }

    if (confidenceEl) {
      confidenceEl.textContent = hadWebSearch
        ? 'Información obtenida de búsqueda web en tiempo real'
        : 'Información inferida del nombre de la empresa';
    }
  } else {
    // Sin resultados
    if (nameEl) nameEl.textContent = FormState.company.name || 'Tu empresa';
    if (sectorEl) sectorEl.textContent = 'Te preguntaremos en el siguiente paso';
    if (descEl) descEl.textContent = 'No encontramos información pública, pero las siguientes preguntas nos ayudarán a entender tu contexto.';
    if (confidenceEl) confidenceEl.textContent = 'Continuaremos con preguntas personalizadas';
  }
}

async function handleContinueFromResearch() {
  // Siempre empezamos por tamaño del equipo (q1-1)
  // Las demás se saltan automáticamente si ya las conocemos
  await goToScreen('q1-1');
}

// Determinar siguiente pantalla saltando las que ya conocemos
function getNextScreen(currentScreen) {
  const profile = FormState.company.profile;
  const hasFieldTeamInfo = profile?.empresa?.tiene_equipo_campo !== undefined;
  const hasSectorInfo = profile?.empresa?.sector && profile.empresa.sector !== 'other';

  const fullFlow = ['q1-1', 'q1-2', 'q1-3', 'q1-4', 'q1-5', 'transition-phase2'];

  // Preguntas que podemos saltar si ya tenemos la info
  const skipIfKnown = {
    'q1-2': hasFieldTeamInfo,  // Equipo de campo
    'q1-3': hasSectorInfo      // Sector
  };

  const currentIndex = fullFlow.indexOf(currentScreen);
  if (currentIndex === -1) return null;

  // Buscar siguiente pantalla que no debamos saltar
  for (let i = currentIndex + 1; i < fullFlow.length; i++) {
    const nextScreen = fullFlow[i];
    if (!skipIfKnown[nextScreen]) {
      return nextScreen;
    }
    // Si saltamos, igual contamos como respondida
    FormState.answeredQuestions++;
  }

  return 'transition-phase2';
}

// ============================================================
// FASE 1: PREGUNTAS FIJAS
// ============================================================

function handleOptionClick(e) {
  const optionBtn = e.target.closest('.option-btn');
  if (!optionBtn) return;

  const optionsList = optionBtn.closest('.options-list');
  const questionKey = optionsList.dataset.question;
  const isMulti = optionsList.dataset.multi === 'true';
  const value = optionBtn.dataset.value;

  if (isMulti) {
    // Multi-select: toggle
    optionBtn.classList.toggle('selected');

    if (!FormState.responses.phase1[questionKey]) {
      FormState.responses.phase1[questionKey] = [];
    }

    const index = FormState.responses.phase1[questionKey].indexOf(value);
    if (index > -1) {
      FormState.responses.phase1[questionKey].splice(index, 1);
    } else {
      FormState.responses.phase1[questionKey].push(value);
    }

    // Mostrar botón continuar si hay selección
    const btnContinue = optionsList.parentElement.querySelector('.btn-continue');
    if (btnContinue) {
      btnContinue.classList.toggle('hidden', FormState.responses.phase1[questionKey].length === 0);
    }
  } else {
    // Single select: seleccionar y avanzar
    optionsList.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    optionBtn.classList.add('selected');

    // Guardar respuesta
    FormState.responses.phase1[questionKey] = value;

    // Manejar input "Otro"
    if (optionBtn.dataset.hasInput === 'true') {
      const container = document.getElementById(`${questionKey}OtherContainer`);
      if (container) {
        container.classList.remove('hidden');
        container.querySelector('input').focus();
        return;
      }
    }

    // Avanzar después de pequeña pausa
    setTimeout(() => advanceFromCurrentQuestion(), 300);
  }
}

function advanceFromCurrentQuestion() {
  const screen = FormState.currentScreen;
  FormState.answeredQuestions++;

  // Usar lógica inteligente que salta preguntas ya conocidas
  const nextScreen = getNextScreen(screen);
  if (nextScreen) {
    goToScreen(nextScreen);
  }
}

// ============================================================
// FASE 2: PREGUNTAS ADAPTATIVAS (GROQ AI) - MEJORADO
// ============================================================

async function handleTransitionToPhase2() {
  await sleep(CONFIG.loadingMinDuration);

  try {
    console.log('Generating adaptive questions with context:', {
      company: FormState.company.name,
      profile: FormState.company.profile?.empresa?.nombre,
      sector: FormState.company.profile?.empresa?.sector,
      hadWebSearch: FormState.company.profile?.fuente_informacion
    });

    const questions = await generateAdaptiveQuestions();

    if (!questions || questions.length === 0) {
      throw new Error('No questions generated');
    }

    console.log('Generated', questions.length, 'adaptive questions:', questions.map(q => q.texto));
    FormState.responses.adaptiveQuestions = questions;
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + questions.length;
  } catch (error) {
    console.error('Error generating adaptive questions, using fallback:', error);
    console.log('Fallback reason:', error.message);
    FormState.responses.adaptiveQuestions = getFallbackQuestions();
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + FormState.responses.adaptiveQuestions.length;
  }

  await goToScreen('phase2-questions');
}

async function generateAdaptiveQuestions() {
  const { phase1 } = FormState.responses;
  const companyProfile = FormState.company.profile;

  console.log('=== GENERATING ADAPTIVE QUESTIONS ===');
  console.log('Company profile:', companyProfile ? {
    nombre: companyProfile.empresa?.nombre,
    sector: companyProfile.empresa?.sector,
    tiene_equipo_campo: companyProfile.empresa?.tiene_equipo_campo,
    fuente: companyProfile.fuente_informacion,
    preguntas_sugeridas: companyProfile.preguntas_sugeridas?.length || 0
  } : 'NO PROFILE');
  console.log('Phase1 responses:', phase1);

  // Construir contexto completo con la base de conocimiento
  const relevantClusters = getRelevantClusters(phase1, companyProfile);

  const systemPrompt = `Eres un consultor experto en detectar dolores operativos. Generas preguntas ÚNICAS y ESPECÍFICAS para cada empresa.

REGLAS OBLIGATORIAS:
1. NUNCA uses preguntas genéricas. Cada pregunta debe mencionar algo específico de ESTA empresa (nombre, sector, productos, etc.)
2. Si hay "preguntas sugeridas por investigación", DEBES usarlas como base (puedes adaptarlas)
3. Las opciones van de "no me pasa" (gravedad 0) a "es un caos" (gravedad 3)
4. Tutea al usuario, sé conversacional
5. Usa los códigos de dolor exactos del catálogo

CATÁLOGO DE DOLORES RELEVANTES:
${Object.entries(relevantClusters).map(([key, cluster]) =>
  `${key}: "${cluster.title}" - ${cluster.description}`
).join('\n')}

SEÑALES QUE INDICAN CADA DOLOR:
${Object.entries(PAIN_CATALOG).filter(([, pain]) =>
  relevantClusters[pain.cluster]
).slice(0, 25).map(([, pain]) =>
  `${pain.cluster}: "${pain.signals.slice(0, 3).join('", "')}"`
).join('\n')}

Responde SOLO con JSON válido.`;

  const userPrompt = `INFORMACIÓN DE LA EMPRESA (de investigación web):
${companyProfile ? `
- Nombre: ${companyProfile.empresa?.nombre || FormState.company.name || 'No especificado'}
- Sector: ${companyProfile.empresa?.sector || phase1.sector}
- Descripción: ${companyProfile.empresa?.descripcion || 'No disponible'}
- Productos/Servicios: ${JSON.stringify(companyProfile.empresa?.productos_servicios || [])}
- Clientes objetivo: ${companyProfile.empresa?.clientes_objetivo || 'No especificado'}
- Modelo de negocio: ${companyProfile.empresa?.modelo_negocio || 'B2B'}
- Tiene equipo de campo: ${companyProfile.empresa?.tiene_equipo_campo ? 'SÍ - importante preguntar sobre visibilidad' : 'No'}
- Maneja muestras médicas: ${companyProfile.empresa?.tiene_muestras_medicas ? 'SÍ - importante preguntar sobre control de muestras' : 'No'}
- Regulado: ${companyProfile.empresa?.regulado ? 'SÍ - importante preguntar sobre compliance' : 'No'}
- Actividades principales: ${JSON.stringify(companyProfile.contexto?.actividades_principales || [])}
- Retos del sector: ${JSON.stringify(companyProfile.contexto?.retos_sector || [])}
- Dolores probables (prioridad alta): ${JSON.stringify(companyProfile.dolores_probables?.prioridad_alta || [])}
- Dolores probables (prioridad media): ${JSON.stringify(companyProfile.dolores_probables?.prioridad_media || [])}
- Señales detectadas: ${JSON.stringify(companyProfile.dolores_probables?.señales_detectadas || [])}
- Confianza de la investigación: ${companyProfile.confianza || 0.5}
- Fuente: ${companyProfile.fuente_informacion || 'inferencia'}
` : 'No hay información de investigación disponible'}

RESPUESTAS DEL USUARIO EN FORMULARIO:
- Tamaño equipo: ${phase1.team_size || 'no especificado'}
- Tiene equipo de campo: ${phase1.has_field_team || 'no especificado'}
- Sector seleccionado: ${phase1.sector || 'no especificado'}
- Tecnología actual: ${JSON.stringify(phase1.current_tech || [])}
- Motivaciones para buscar solución: ${JSON.stringify(phase1.motivation || [])}

${companyProfile?.preguntas_sugeridas?.length > 0 ? `
PREGUNTAS SUGERIDAS POR LA INVESTIGACIÓN (DEBES USAR ESTAS O SIMILARES):
${companyProfile.preguntas_sugeridas.map(q => `- "${q.pregunta}" → objetivo: ${q.objetivo}, detecta: ${q.categoria_dolor}`).join('\n')}
` : ''}

Genera 4-5 preguntas en este formato JSON:
{
  "preguntas": [
    {
      "texto": "¿Pregunta específica para esta empresa?",
      "hint": "Contexto o aclaración breve",
      "profundiza_en": "Nombre del dolor que profundiza",
      "opciones": [
        {
          "texto": "Opción que indica NO tener el problema",
          "detecta": [],
          "gravedad": 0
        },
        {
          "texto": "Opción que indica problema LEVE",
          "detecta": ["A-VISIBILIDAD"],
          "gravedad": 1
        },
        {
          "texto": "Opción que indica problema MODERADO",
          "detecta": ["A-VISIBILIDAD", "A-REGISTRO"],
          "gravedad": 2
        },
        {
          "texto": "Opción que indica problema GRAVE",
          "detecta": ["A-VISIBILIDAD", "A-REGISTRO", "A-CONOCIMIENTO"],
          "gravedad": 3
        }
      ]
    }
  ]
}

INSTRUCCIONES FINALES:
- Si hay preguntas sugeridas por investigación, ÚSALAS como base
- Menciona el nombre de la empresa o su sector en al menos 2 preguntas
- Si es pharma/dispositivos médicos: OBLIGATORIO preguntar sobre muestras y compliance
- Si tiene equipo de campo: OBLIGATORIO preguntar sobre visibilidad y registro
- Las preguntas deben sentirse personalizadas, como si conocieras la empresa
- NO repitas la misma estructura en todas las preguntas, varía el enfoque`;

  const response = await fetch(CONFIG.chatApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: CONFIG.groqModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Groq API error:', response.status, errorText);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.choices?.[0]?.message?.content) {
    console.error('Invalid Groq response structure:', data);
    throw new Error('Invalid response from Groq');
  }

  let content = data.choices[0].message.content;
  console.log('Raw Groq response (first 300 chars):', content.substring(0, 300));

  // Limpiar markdown code blocks si existen
  content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

  // Parsear JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('No JSON found in cleaned response:', content.substring(0, 500));
    throw new Error('No valid JSON in response');
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.preguntas || !Array.isArray(parsed.preguntas) || parsed.preguntas.length === 0) {
      console.error('No preguntas array in response:', parsed);
      throw new Error('Response missing preguntas array');
    }

    console.log('Successfully generated', parsed.preguntas.length, 'adaptive questions');
    return parsed.preguntas;
  } catch (parseError) {
    console.error('JSON parse error:', parseError.message, 'Content:', jsonMatch[0].substring(0, 300));
    throw new Error('Failed to parse questions JSON');
  }
}

function getRelevantClusters(phase1, companyProfile) {
  const relevant = {};

  // Siempre incluir nivel 1
  Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
    if (EXPLORATION_PRIORITY.level1.includes(cluster.category)) {
      relevant[key] = cluster;
    }
  });

  // Incluir nivel 2 basado en contexto
  const motivations = Array.isArray(phase1.motivation) ? phase1.motivation : [];
  if (motivations.includes('losing_sales') || phase1.current_tech?.includes('nothing')) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (cluster.category === 'E') relevant[key] = cluster;
    });
  }

  // Incluir pharma si aplica
  const isPharma = phase1.sector === 'pharma' || companyProfile?.empresa?.tiene_muestras_medicas;
  if (isPharma) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (EXPLORATION_PRIORITY.level3_pharma.includes(cluster.category)) {
        relevant[key] = cluster;
      }
    });
  }

  // Incluir visibilidad de equipo si tiene campo
  if (phase1.has_field_team === 'yes' || phase1.has_field_team === 'both' || companyProfile?.empresa?.tiene_equipo_campo) {
    Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
      if (cluster.category === 'A') relevant[key] = cluster;
    });
  }

  // Siempre incluir tecnología y automatización
  Object.entries(PAIN_CLUSTERS).forEach(([key, cluster]) => {
    if (['G', 'P'].includes(cluster.category)) {
      relevant[key] = cluster;
    }
  });

  return relevant;
}

function getFallbackQuestions() {
  const { phase1 } = FormState.responses;
  const questions = [];

  // Pregunta 1: Visibilidad (si tiene equipo)
  if (phase1.has_field_team !== 'no') {
    questions.push({
      texto: '¿Cómo te enteras de lo que hizo tu equipo hoy?',
      hint: 'Piensa en cómo obtienes información de las actividades diarias',
      profundiza_en: 'Visibilidad del equipo',
      opciones: [
        { texto: 'Tengo un dashboard que actualiza en tiempo real', detecta: [], gravedad: 0 },
        { texto: 'Me mandan un resumen por WhatsApp o email', detecta: ['H-CANALES'], gravedad: 1 },
        { texto: 'Les pregunto en la junta semanal', detecta: ['A-VISIBILIDAD', 'H-VISIBILIDAD'], gravedad: 2 },
        { texto: 'Básicamente confío en que están trabajando', detecta: ['A-VISIBILIDAD', 'A-REGISTRO', 'A-COBERTURA'], gravedad: 3 }
      ]
    });
  }

  // Pregunta 2: Datos de clientes/contactos
  questions.push({
    texto: '¿Dónde vive la información de tus clientes o contactos?',
    hint: '',
    profundiza_en: 'Centralización de datos',
    opciones: [
      { texto: 'En un sistema centralizado que todos usan', detecta: [], gravedad: 0 },
      { texto: 'En Excel, pero hay una versión "oficial"', detecta: ['G-EXCEL'], gravedad: 1 },
      { texto: 'Cada vendedor tiene su propia lista', detecta: ['B-CENTRALIZACION', 'G-FRAGMENTACION'], gravedad: 2 },
      { texto: 'Honestamente, dispersa en varios lugares', detecta: ['B-CENTRALIZACION', 'B-DATOS', 'G-FRAGMENTACION'], gravedad: 3 }
    ]
  });

  // Pregunta 3: Muestras (solo pharma)
  if (phase1.sector === 'pharma') {
    questions.push({
      texto: '¿Cómo controlas las muestras médicas que entrega tu equipo?',
      hint: 'Incluye muestras, material promocional, dispositivos de demostración',
      profundiza_en: 'Control de muestras',
      opciones: [
        { texto: 'Sistema completo con trazabilidad de lotes', detecta: [], gravedad: 0 },
        { texto: 'Excel que actualizamos regularmente', detecta: ['C-INVENTARIO'], gravedad: 1 },
        { texto: 'Cada rep lleva su propio control', detecta: ['C-INVENTARIO', 'C-TRAZABILIDAD'], gravedad: 2 },
        { texto: 'No tenemos control real, confiamos en ellos', detecta: ['C-TRAZABILIDAD', 'C-CONTROL', 'C-COMPLIANCE'], gravedad: 3 }
      ]
    });
  }

  // Pregunta 4: Pipeline de ventas
  questions.push({
    texto: '¿Cómo sabes cuánto vas a vender este mes?',
    hint: '',
    profundiza_en: 'Visibilidad de ventas',
    opciones: [
      { texto: 'Tengo un pipeline actualizado con probabilidades', detecta: [], gravedad: 0 },
      { texto: 'Sumo las cotizaciones pendientes manualmente', detecta: ['D-FORECAST'], gravedad: 1 },
      { texto: 'Les pregunto a los vendedores y sumo', detecta: ['D-VISIBILIDAD', 'D-PIPELINE'], gravedad: 2 },
      { texto: 'Es sorpresa hasta que llega fin de mes', detecta: ['D-VISIBILIDAD', 'D-PIPELINE', 'D-FORECAST'], gravedad: 3 }
    ]
  });

  // Pregunta 5: Reportes
  questions.push({
    texto: '¿Cuánto te tardas en generar un reporte para dirección?',
    hint: '',
    profundiza_en: 'Automatización de reportes',
    opciones: [
      { texto: 'Minutos, está automatizado', detecta: [], gravedad: 0 },
      { texto: 'Un par de horas consolidando datos', detecta: ['F-TIEMPO'], gravedad: 1 },
      { texto: 'Días, tengo que buscar en varios lugares', detecta: ['F-TIEMPO', 'F-INTEGRACION'], gravedad: 2 },
      { texto: 'Semanas o directamente no los hacemos', detecta: ['F-TIEMPO', 'F-AUTOMATIZACION', 'F-DASHBOARDS'], gravedad: 3 }
    ]
  });

  return questions;
}

async function renderAdaptiveQuestion() {
  const questions = FormState.responses.adaptiveQuestions;
  const index = FormState.responses.currentAdaptiveIndex;

  if (index >= questions.length) {
    await goToScreen('transition-phase3');
    return;
  }

  const question = questions[index];
  const questionNum = 6 + index;
  const totalQuestions = 5 + questions.length;

  // Actualizar UI
  DOM.adaptiveQuestionNumber.innerHTML = `${questionNum} <span class="question-total">/ ${totalQuestions}</span>`;
  DOM.adaptiveQuestionTitle.textContent = question.texto;
  DOM.adaptiveQuestionHint.textContent = question.hint || '';

  // Renderizar opciones
  DOM.adaptiveOptions.innerHTML = question.opciones.map((opt, i) => {
    const key = String.fromCharCode(65 + i);
    return `
      <button class="option-btn" data-value="${i}" data-detects='${JSON.stringify(opt.detecta || [])}' data-gravedad="${opt.gravedad || 0}">
        <span class="option-key">${key}</span>
        <span class="option-text">${opt.texto}</span>
      </button>
    `;
  }).join('');

  // Agregar event listeners
  DOM.adaptiveOptions.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', handleAdaptiveOptionClick);
  });
}

function handleAdaptiveOptionClick(e) {
  const btn = e.target.closest('.option-btn');
  if (!btn) return;

  DOM.adaptiveOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const index = FormState.responses.currentAdaptiveIndex;
  const detects = JSON.parse(btn.dataset.detects || '[]');
  const gravedad = parseInt(btn.dataset.gravedad || '0');

  FormState.responses.phase2[`q2-${index}`] = {
    value: btn.dataset.value,
    detects: detects,
    gravedad: gravedad
  };

  FormState.answeredQuestions++;

  setTimeout(async () => {
    FormState.responses.currentAdaptiveIndex++;
    await renderAdaptiveQuestion();
  }, 300);
}

// ============================================================
// FASE 3: DETECCIÓN DE PAINS - MEJORADA
// ============================================================

async function handleTransitionToPhase3() {
  await sleep(CONFIG.loadingMinDuration);

  try {
    const pains = await detectPainsWithAI();
    FormState.detectedPains = pains;
  } catch (error) {
    console.error('Error detecting pains:', error);
    FormState.detectedPains = detectPainsFallback();
  }

  await goToScreen('pains-detected');
}

async function detectPainsWithAI() {
  // Recopilar todas las respuestas y detecciones
  const allDetections = [];
  const detectionWeights = {};

  // De fase 1 (motivación)
  const { phase1 } = FormState.responses;
  const motivationMapping = {
    'no_visibility': ['A-VISIBILIDAD', 'F-DASHBOARDS', 'A-REGISTRO'],
    'no_adoption': ['G-ADOPCION', 'A-REGISTRO', 'P-TIEMPO'],
    'losing_sales': ['D-SEGUIMIENTO', 'D-PIPELINE', 'D-FORECAST'],
    'compliance': ['L-TRAZABILIDAD', 'C-COMPLIANCE', 'L-REPORTES'],
    'system_fails': ['G-ADOPCION', 'G-OBSOLESCENCIA', 'G-INTEGRACION'],
    'growth': ['K-PLANIFICACION', 'D-PIPELINE', 'F-DASHBOARDS']
  };

  // Motivación ahora es un array (multi-select)
  const motivations = Array.isArray(phase1.motivation) ? phase1.motivation : (phase1.motivation ? [phase1.motivation] : []);
  motivations.forEach(motivation => {
    if (motivationMapping[motivation]) {
      motivationMapping[motivation].forEach((cluster, i) => {
        allDetections.push(cluster);
        detectionWeights[cluster] = (detectionWeights[cluster] || 0) + (3 - i) * 2;
      });
    }
  });

  // De tecnología actual
  const techMapping = {
    'excel': ['G-EXCEL', 'F-AUTOMATIZACION', 'B-CENTRALIZACION'],
    'informal': ['H-CANALES', 'B-CENTRALIZACION', 'A-REGISTRO'],
    'nothing': ['B-CENTRALIZACION', 'D-VISIBILIDAD', 'G-FRAGMENTACION']
  };

  (phase1.current_tech || []).forEach(tech => {
    if (techMapping[tech]) {
      techMapping[tech].forEach((cluster, i) => {
        allDetections.push(cluster);
        detectionWeights[cluster] = (detectionWeights[cluster] || 0) + (3 - i);
      });
    }
  });

  // De fase 2 (con gravedad)
  Object.values(FormState.responses.phase2).forEach(response => {
    if (response.detects) {
      response.detects.forEach((cluster, i) => {
        allDetections.push(cluster);
        // Peso basado en gravedad y posición
        const weight = (response.gravedad || 1) * (3 - i);
        detectionWeights[cluster] = (detectionWeights[cluster] || 0) + weight;
      });
    }
  });

  // De investigación de empresa (si existe)
  if (FormState.company.profile?.dolores_probables) {
    const { prioridad_alta = [], prioridad_media = [] } = FormState.company.profile.dolores_probables;
    prioridad_alta.forEach(cluster => {
      allDetections.push(cluster);
      detectionWeights[cluster] = (detectionWeights[cluster] || 0) + 3;
    });
    prioridad_media.forEach(cluster => {
      allDetections.push(cluster);
      detectionWeights[cluster] = (detectionWeights[cluster] || 0) + 1;
    });
  }

  // Ordenar por peso
  const sortedClusters = Object.entries(detectionWeights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([cluster]) => cluster);

  // Usar IA para refinar y personalizar los dolores
  const systemPrompt = `Eres un experto analista que genera res��menes personalizados de dolores empresariales.

Dado un contexto de empresa y los dolores detectados, genera 4 dolores principales con descripciones PERSONALIZADAS para esta empresa específica.

La descripción debe:
1. Ser específica para su industria/contexto
2. Usar "tú" y lenguaje directo
3. Reflejar el impacto real en SU negocio
4. Ser concisa (1-2 oraciones)

Responde SOLO con JSON válido.`;

  const userPrompt = `EMPRESA: ${FormState.company.profile?.empresa?.nombre || FormState.company.name || 'No especificado'}
SECTOR: ${phase1.sector}
TAMAÑO: ${phase1.team_size}
TIENE CAMPO: ${phase1.has_field_team}

CLUSTERS DETECTADOS (ordenados por prioridad):
${sortedClusters.map((cluster, i) => {
  const clusterData = PAIN_CLUSTERS[cluster] || { title: cluster, description: '' };
  return `${i + 1}. ${cluster}: "${clusterData.title}" - ${clusterData.description}`;
}).join('\n')}

Genera los 4 dolores principales en este formato:
{
  "dolores": [
    {
      "cluster": "A-VISIBILIDAD",
      "titulo": "Título corto y directo",
      "descripcion": "Descripción personalizada para esta empresa",
      "impacto": "Consecuencia concreta de este dolor"
    }
  ]
}`;

  try {
    const response = await fetch(CONFIG.chatApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.dolores.slice(0, 4).map((dolor, index) => {
      const clusterData = PAIN_CLUSTERS[dolor.cluster] || {};
      return {
        order: index + 1,
        key: dolor.cluster,
        title: dolor.titulo,
        description: dolor.descripcion,
        impacto: dolor.impacto,
        codes: clusterData.codes || [],
        focus: clusterData.focus || 9,
        confidence: 0.9 - (index * 0.05)
      };
    });

  } catch (error) {
    console.error('Error in AI pain detection:', error);
    return detectPainsFallback();
  }
}

function detectPainsFallback() {
  const { phase1 } = FormState.responses;
  const pains = [];

  // Construir basado en respuestas
  if (phase1.has_field_team !== 'no') {
    pains.push({
      order: 1,
      key: 'A-VISIBILIDAD',
      title: 'Sin visibilidad de tu equipo',
      description: 'No sabes qué está haciendo tu equipo de campo en tiempo real',
      codes: ['A01', 'A02', 'A08'],
      focus: 1,
      confidence: 0.85
    });
  }

  if (phase1.current_tech?.includes('excel') || phase1.current_tech?.includes('informal')) {
    pains.push({
      order: pains.length + 1,
      key: 'B-CENTRALIZACION',
      title: 'Información fragmentada',
      description: 'Cada quien tiene su propia versión de los datos',
      codes: ['B02', 'G01'],
      focus: 2,
      confidence: 0.80
    });
  }

  if (phase1.sector === 'pharma') {
    pains.push({
      order: pains.length + 1,
      key: 'C-TRAZABILIDAD',
      title: 'Muestras sin control',
      description: 'No puedes rastrear qué muestras se entregaron a quién',
      codes: ['C02', 'C03'],
      focus: 3,
      confidence: 0.85
    });
  }

  // Siempre incluir pipeline/ventas
  pains.push({
    order: pains.length + 1,
    key: 'D-PIPELINE',
    title: 'Pipeline invisible',
    description: 'Las oportunidades de venta viven en la cabeza de cada vendedor',
    codes: ['D01', 'D02', 'D03'],
    focus: 4,
    confidence: 0.80
  });

  // Completar hasta 4
  if (pains.length < 4) {
    pains.push({
      order: pains.length + 1,
      key: 'F-AUTOMATIZACION',
      title: 'Reportes manuales',
      description: 'Armar un reporte para dirección te toma días',
      codes: ['F01', 'F13'],
      focus: 9,
      confidence: 0.75
    });
  }

  return pains.slice(0, 4);
}

function renderDetectedPains() {
  const pains = FormState.detectedPains;

  const cards = DOM.painsList.querySelectorAll('.pain-card');
  cards.forEach((card, index) => {
    const pain = pains[index];
    if (pain) {
      card.querySelector('.pain-title').textContent = pain.title;
      card.querySelector('.pain-description').textContent = pain.description;
      card.style.animationDelay = `${index * 0.1}s`;
    }
  });
}

function handleConfirmPains() {
  FormState.painsConfirmed = true;
  FormState.finalPains = [...FormState.detectedPains];
  updateAudioScreenContent(true);
  goToScreen('audio-record');
}

function handleAdjustPains() {
  FormState.painsConfirmed = false;
  updateAudioScreenContent(false);
  goToScreen('audio-record');
}

function updateAudioScreenContent(confirmed) {
  if (confirmed) {
    DOM.audioTitle.textContent = 'Ahora cuéntanos más con tus palabras';
    DOM.audioSubtitle.textContent = 'Graba un audio de 1-2 minutos explicando:';
    DOM.audioPrompts.innerHTML = `
      <li>¿Cuál de estos 4 dolores te quita más el sueño?</li>
      <li>¿Qué has intentado hacer para resolverlo?</li>
      <li>¿Hay algo específico de tu operación que debamos saber?</li>
    `;
  } else {
    DOM.audioTitle.textContent = 'Cuéntanos qué ajustar';
    DOM.audioSubtitle.textContent = 'Graba un audio explicándonos:';
    DOM.audioPrompts.innerHTML = `
      <li>¿Qué dolor detectamos que NO es tu prioridad?</li>
      <li>¿Cuál es tu dolor REAL que no capturamos?</li>
      <li>Cuéntanos con tus palabras qué te quita el sueño</li>
    `;
  }
}

// ============================================================
// FASE 4: GRABACIÓN DE AUDIO
// ============================================================

let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;

function setupAudioRecorder() {
  FormState.audioBlob = null;
  FormState.audioUrl = null;
  audioChunks = [];
  recordingSeconds = 0;

  DOM.recorderTimer.textContent = '0:00';
  DOM.recorderStatus.textContent = 'Toca para grabar';
  DOM.audioRecorder.classList.remove('hidden');
  DOM.audioPreview.classList.add('hidden');

  DOM.recorderBtn.querySelector('.recorder-btn__record').classList.remove('hidden');
  DOM.recorderBtn.querySelector('.recorder-btn__stop').classList.add('hidden');
  DOM.recorderBtn.classList.remove('recording');
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    });

    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
      FormState.audioBlob = blob;
      FormState.audioUrl = URL.createObjectURL(blob);

      DOM.audioPlayer.src = FormState.audioUrl;
      DOM.audioRecorder.classList.add('hidden');
      DOM.audioPreview.classList.remove('hidden');

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start(1000);

    DOM.recorderBtn.classList.add('recording');
    DOM.recorderBtn.querySelector('.recorder-btn__record').classList.add('hidden');
    DOM.recorderBtn.querySelector('.recorder-btn__stop').classList.remove('hidden');
    DOM.recorderStatus.textContent = 'Grabando...';
    DOM.recorderVisualizer.classList.add('active');

    recordingSeconds = 0;
    recordingTimer = setInterval(() => {
      recordingSeconds++;
      const mins = Math.floor(recordingSeconds / 60);
      const secs = recordingSeconds % 60;
      DOM.recorderTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

      if (recordingSeconds >= CONFIG.maxAudioDuration) {
        stopRecording();
      }
    }, 1000);

  } catch (error) {
    console.error('Error accessing microphone:', error);
    DOM.recorderStatus.textContent = 'Error: No se pudo acceder al micrófono';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    clearInterval(recordingTimer);
    DOM.recorderVisualizer.classList.remove('active');
  }
}

function toggleRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    stopRecording();
  } else {
    startRecording();
  }
}

function handleRerecord() {
  if (FormState.audioUrl) {
    URL.revokeObjectURL(FormState.audioUrl);
  }
  setupAudioRecorder();
}

async function handleUseAudio() {
  if (!FormState.audioBlob) return;
  await goToScreen('processing-audio');
}

// ============================================================
// PROCESAMIENTO DE AUDIO (WHISPER)
// ============================================================

async function handleProcessingAudio() {
  await sleep(1000);

  try {
    const transcription = await transcribeAudio(FormState.audioBlob);
    FormState.audioTranscription = transcription;

    if (!FormState.painsConfirmed) {
      const adjustedPains = await adjustPainsFromAudio(transcription);
      FormState.finalPains = adjustedPains;
    } else {
      FormState.finalPains = await enrichPainsFromAudio(FormState.detectedPains, transcription);
    }

  } catch (error) {
    console.error('Error processing audio:', error);
    FormState.finalPains = [...FormState.detectedPains];
  }

  await goToScreen('final-pains');
}

async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', CONFIG.whisperModel);
  formData.append('language', 'es');

  const response = await fetch(CONFIG.whisperApiUrl, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text;
}

async function adjustPainsFromAudio(transcription) {
  const clustersList = Object.entries(PAIN_CLUSTERS)
    .map(([key, val]) => `${key}: ${val.title}`)
    .join('\n');

  const systemPrompt = `Eres un experto analizando necesidades empresariales.
El usuario NO estuvo de acuerdo con los dolores detectados y grabó un audio explicando sus dolores reales.

Analiza la transcripción y determina los 4 dolores principales.

BASE DE CLUSTERS DISPONIBLES:
${clustersList}

Responde SOLO con JSON válido.`;

  const userPrompt = `Dolores que habíamos detectado:
${FormState.detectedPains.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n')}

Transcripción del audio del usuario:
"${transcription}"

Genera los 4 dolores corregidos en este formato:
{
  "pains": [
    {
      "key": "A-VISIBILIDAD",
      "title": "Título corto",
      "description": "Descripción personalizada según lo que dijo",
      "audioContext": "Lo que el usuario enfatizó"
    }
  ]
}`;

  try {
    const response = await fetch(CONFIG.chatApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CONFIG.groqModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error('No valid JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.pains.slice(0, 4).map((p, index) => ({
      order: index + 1,
      key: p.key,
      title: p.title,
      description: p.description,
      audioContext: p.audioContext,
      codes: PAIN_CLUSTERS[p.key]?.codes || [],
      focus: PAIN_CLUSTERS[p.key]?.focus || 9,
      confidence: 0.9
    }));

  } catch (error) {
    console.error('Error adjusting pains:', error);
    return FormState.detectedPains;
  }
}

async function enrichPainsFromAudio(pains, transcription) {
  return pains.map(pain => ({
    ...pain,
    audioContext: transcription ? 'Contexto adicional del audio disponible' : null
  }));
}

// ============================================================
// FASE 5: CONFIRMACIÓN FINAL
// ============================================================

function renderFinalPains() {
  const pains = FormState.finalPains;

  DOM.finalPainsList.innerHTML = pains.map((pain, index) => `
    <div class="final-pain-card">
      <div class="final-pain-number">DOLOR ${index + 1}</div>
      <h3 class="final-pain-title">${pain.title.toUpperCase()}</h3>
      <p class="final-pain-description">"${pain.description}"</p>
      ${pain.audioContext && pain.audioContext !== 'Contexto adicional del audio disponible' ? `<p class="final-pain-context">${pain.audioContext}</p>` : ''}
    </div>
  `).join('');

  setTimeout(() => {
    goToScreen('contact-info');
  }, 3000);
}

function focusContactForm() {
  // Pre-rellenar empresa si tenemos el dato
  if (FormState.company.name && DOM.contactCompany) {
    DOM.contactCompany.value = FormState.company.name;
  } else if (FormState.company.profile?.empresa?.nombre && DOM.contactCompany) {
    DOM.contactCompany.value = FormState.company.profile.empresa.nombre;
  }
  DOM.contactName.focus();
}

async function handleContactSubmit(e) {
  e.preventDefault();

  FormState.contact = {
    name: DOM.contactName.value.trim(),
    company: DOM.contactCompany.value.trim(),
    email: DOM.contactEmail.value.trim(),
    whatsapp: DOM.contactWhatsapp.value.trim()
  };

  const formData = prepareFormData();

  try {
    const response = await fetch(CONFIG.submitApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      console.error('Error submitting form:', await response.text());
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }

  DOM.thanksName.textContent = FormState.contact.name.split(' ')[0] || 'amigo';
  await goToScreen('thank-you');
}

function prepareFormData() {
  return {
    id: `form_${Date.now()}`,
    timestamp: new Date().toISOString(),

    empresa: {
      nombre: FormState.contact.company,
      contacto: FormState.contact.name,
      email: FormState.contact.email,
      whatsapp: FormState.contact.whatsapp,
      tamaño: FormState.responses.phase1.team_size,
      sector: FormState.responses.phase1.sector,
      tiene_campo: FormState.responses.phase1.has_field_team,
      tecnologia_actual: FormState.responses.phase1.current_tech,
      motivacion: FormState.responses.phase1.motivation
    },

    investigacion_empresa: FormState.company.profile,

    respuestas_fase1: FormState.responses.phase1,
    respuestas_fase2: FormState.responses.phase2,

    pains_detectados_inicial: FormState.detectedPains,
    confirmacion_pains: FormState.painsConfirmed ? 'si' : 'no',

    audio: {
      transcripcion: FormState.audioTranscription,
      duracion_segundos: recordingSeconds
    },

    pains_finales: FormState.finalPains,

    experiencias_sugeridas: getExperienciasSugeridas(),
    plan_recomendado: getPlanRecomendado()
  };
}

function getExperienciasSugeridas() {
  const experiencias = new Set();

  FormState.finalPains.forEach(pain => {
    switch (pain.focus) {
      case 1: experiencias.add('Representante'); experiencias.add('Supervisor'); break;
      case 2: experiencias.add('Representante'); break;
      case 3: experiencias.add('Representante'); experiencias.add('Admin'); break;
      case 4: experiencias.add('Comercial'); break;
      case 5: experiencias.add('Comercial'); break;
      case 10: experiencias.add('Admin'); break;
      default: experiencias.add('Supervisor');
    }
  });

  return Array.from(experiencias);
}

function getPlanRecomendado() {
  const needsAI = FormState.finalPains.some(p =>
    ['P-VOZ', 'P-CONTEXTO', 'P-ALERTAS', 'P-AUTOMATICO'].includes(p.key)
  );

  if (needsAI) return 'Pro';
  if (FormState.responses.phase1.has_field_team !== 'no') return 'Esencial';
  return 'Base';
}


// ============================================================
// INICIALIZACIÓN
// ============================================================

function init() {
  try {
    initDOM();

    // Event Listeners - Botón Start (ahora va a pregunta de empresa)
    if (DOM.btnStart) {
      DOM.btnStart.addEventListener('click', () => goToScreen('q0-company'));
    }

    // Event Listeners - Empresa
    if (DOM.btnResearchCompany) {
      DOM.btnResearchCompany.addEventListener('click', handleCompanySubmit);
    }
    if (DOM.companyInput) {
      DOM.companyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCompanySubmit();
      });
    }

    // Event Listeners - Opciones (delegación de eventos - siempre funciona)
    document.addEventListener('click', handleOptionClick);

    // Event Listeners - Navegación
    if (DOM.btnPrev) {
      DOM.btnPrev.addEventListener('click', goBack);
    }

  // Event Listeners - Multi-select continue
  if (DOM.btnContinueQ4) {
    DOM.btnContinueQ4.addEventListener('click', advanceFromCurrentQuestion);
  }
  if (DOM.btnContinueQ5) {
    DOM.btnContinueQ5.addEventListener('click', advanceFromCurrentQuestion);
  }

  // Event Listeners - Research continue
  if (DOM.btnContinueResearch) {
    DOM.btnContinueResearch.addEventListener('click', handleContinueFromResearch);
  }

  // Event Listeners - Pains
  if (DOM.btnConfirmPains) {
    DOM.btnConfirmPains.addEventListener('click', handleConfirmPains);
  }
  if (DOM.btnAdjustPains) {
    DOM.btnAdjustPains.addEventListener('click', handleAdjustPains);
  }

  // Event Listeners - Audio
  if (DOM.recorderBtn) {
    DOM.recorderBtn.addEventListener('click', toggleRecording);
  }
  if (DOM.btnRerecord) {
    DOM.btnRerecord.addEventListener('click', handleRerecord);
  }
  if (DOM.btnUseAudio) {
    DOM.btnUseAudio.addEventListener('click', handleUseAudio);
  }

  // Event Listeners - Contact Form
  if (DOM.contactForm) {
    DOM.contactForm.addEventListener('submit', handleContactSubmit);
  }


  console.log(`APEX Discovery Form initialized (${Object.keys(PAIN_CATALOG).length} pains, ${Object.keys(PAIN_CLUSTERS).length} clusters)`);

  } catch (error) {
    console.error('Error initializing form:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
