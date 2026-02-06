/**
 * APEX Discovery Form - JavaScript
 * Integración con Groq AI para preguntas adaptativas y detección de dolores
 *
 * Modelos usados:
 * - Llama 3.3 70B Versatile: Generación de preguntas y detección de pains
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

  // Modelos
  groqModel: 'llama-3.3-70b-versatile',
  whisperModel: 'whisper-large-v3-turbo',

  // Animaciones
  transitionDuration: 400,
  loadingMinDuration: 1500,

  // Audio
  maxAudioDuration: 180, // 3 minutos
  minAudioDuration: 10,  // 10 segundos mínimo
};

// ============================================================
// BASE DE CONOCIMIENTO DE DOLORES (Simplificada)
// ============================================================

const PAIN_DATABASE = {
  // Categoría A: Visibilidad del equipo
  'A-VISIBILIDAD': {
    title: 'No sé qué hace mi equipo',
    description: 'No tienes visibilidad de las actividades de tus representantes',
    codes: ['A01', 'A02', 'A08'],
    focus: 1
  },
  'A-UBICACION': {
    title: 'No sé dónde están mis reps',
    description: 'No puedes verificar la ubicación de tu equipo de campo',
    codes: ['A03', 'A05'],
    focus: 1
  },
  'A-REGISTRO': {
    title: 'Registran tarde o mal',
    description: 'Tu equipo no documenta las visitas en tiempo real',
    codes: ['A04', 'A11'],
    focus: 1
  },
  'A-COBERTURA': {
    title: 'No siguen el plan de visitas',
    description: 'Los reps visitan a quien quieren, no a quien deben',
    codes: ['A06', 'A07'],
    focus: 1
  },
  'A-CONOCIMIENTO': {
    title: 'La información se va con ellos',
    description: 'Cuando un rep se va, pierdes todo su conocimiento',
    codes: ['A09', 'A13'],
    focus: 1
  },
  'A-PRODUCTIVIDAD': {
    title: 'No puedo medir rendimiento',
    description: 'No tienes métricas objetivas para comparar productividad',
    codes: ['A10', 'A12'],
    focus: 1
  },

  // Categoría B: Contactos
  'B-DATOS': {
    title: 'Datos desactualizados',
    description: 'La información de contactos está vieja o duplicada',
    codes: ['B01', 'B07', 'B14'],
    focus: 2
  },
  'B-CENTRALIZACION': {
    title: 'Cada quien tiene su libreta',
    description: 'No hay una base de datos central de contactos',
    codes: ['B02'],
    focus: 2
  },
  'B-SEGMENTACION': {
    title: 'No sé cuáles son importantes',
    description: 'No tienes categorizados tus contactos por prioridad',
    codes: ['B04', 'B13'],
    focus: 2
  },
  'B-HISTORIAL': {
    title: 'Sin historial de relación',
    description: 'No sabes qué ha pasado con cada contacto anteriormente',
    codes: ['B09'],
    focus: 2
  },

  // Categoría C: Muestras
  'C-INVENTARIO': {
    title: 'No sé qué muestras hay',
    description: 'No tienes control del inventario de muestras',
    codes: ['C01', 'C13', 'C14'],
    focus: 3
  },
  'C-TRAZABILIDAD': {
    title: 'Muestras sin trazabilidad',
    description: 'No puedes rastrear a quién se entregó cada muestra',
    codes: ['C02', 'C03'],
    focus: 3
  },
  'C-CONTROL': {
    title: 'Sin límites de muestras',
    description: 'No hay control sobre cuántas muestras se entregan',
    codes: ['C04', 'C07'],
    focus: 3
  },
  'C-COMPLIANCE': {
    title: 'Auditoría de muestras',
    description: 'No puedes generar reportes regulatorios de muestras',
    codes: ['C11'],
    focus: 10
  },

  // Categoría D: Ventas
  'D-VISIBILIDAD': {
    title: 'Oportunidades en la cabeza',
    description: 'Las ventas no están registradas en ningún sistema',
    codes: ['D01'],
    focus: 4
  },
  'D-PIPELINE': {
    title: 'Sin pipeline visual',
    description: 'No tienes visibilidad del embudo de ventas',
    codes: ['D02', 'D03'],
    focus: 4
  },
  'D-FORECAST': {
    title: 'No puedo predecir ventas',
    description: 'No sabes cuánto vas a vender hasta fin de mes',
    codes: ['D04', 'D12'],
    focus: 4
  },
  'D-SEGUIMIENTO': {
    title: 'Oportunidades abandonadas',
    description: 'Pierdes ventas por falta de seguimiento',
    codes: ['D08', 'D10'],
    focus: 4
  },

  // Categoría E: Cobranza
  'E-SEGUIMIENTO': {
    title: 'Facturas sin cobrar',
    description: 'Hay facturas vencidas que nadie está gestionando',
    codes: ['E01', 'E08'],
    focus: 5
  },
  'E-VISIBILIDAD': {
    title: 'No veo lo que me deben',
    description: 'No tienes visibilidad consolidada de cuentas por cobrar',
    codes: ['E02', 'E07'],
    focus: 5
  },
  'E-PROCESO': {
    title: 'Sin proceso de cobranza',
    description: 'No hay un proceso escalonado de gestión de cobros',
    codes: ['E06'],
    focus: 5
  },

  // Categoría F: Reportes
  'F-TIEMPO': {
    title: 'Reportes tardan días',
    description: 'Armar información para dirección toma demasiado tiempo',
    codes: ['F01'],
    focus: 9
  },
  'F-DASHBOARDS': {
    title: 'Sin dashboards',
    description: 'No tienes visualizaciones en tiempo real del negocio',
    codes: ['F06'],
    focus: 9
  },
  'F-AUTOMATIZACION': {
    title: 'Reportes manuales',
    description: 'Los reportes se hacen a mano cada semana',
    codes: ['F13'],
    focus: 9
  },

  // Categoría G: Tecnología
  'G-EXCEL': {
    title: 'Todo está en Excel',
    description: 'La información vive en hojas de cálculo dispersas',
    codes: ['G01'],
    focus: 9
  },
  'G-ADOPCION': {
    title: 'CRM que nadie usa',
    description: 'Tienes un sistema pero el equipo no lo adopta',
    codes: ['G03', 'G08'],
    focus: 9
  },

  // Categoría H: Comunicación
  'H-CANALES': {
    title: 'Todo por WhatsApp',
    description: 'Las comunicaciones oficiales se pierden en WhatsApp',
    codes: ['H01', 'H02'],
    focus: 6
  },
  'H-APROBACIONES': {
    title: 'Aprobaciones informales',
    description: 'No hay flujo formal para aprobar descuentos o solicitudes',
    codes: ['H04'],
    focus: 6
  },

  // Categoría L: Compliance
  'L-TRAZABILIDAD': {
    title: 'Sin trazabilidad regulatoria',
    description: 'No puedes demostrar a reguladores quién recibió qué',
    codes: ['L01', 'L02'],
    focus: 10
  },
  'L-REPORTES': {
    title: 'Auditoría = pánico',
    description: 'Generar reportes de compliance toma días',
    codes: ['L05'],
    focus: 10
  },

  // Categoría P: IA
  'P-TIEMPO': {
    title: 'Mucho tiempo registrando',
    description: 'Los formularios del CRM quitan demasiado tiempo',
    codes: ['P01'],
    focus: 9
  },
  'P-VOZ': {
    title: 'Prefiero dictar',
    description: 'Quisieras poder registrar información hablando',
    codes: ['P05'],
    focus: 9
  },
};

// ============================================================
// ESTADO DEL FORMULARIO
// ============================================================

const FormState = {
  currentScreen: 'welcome',
  currentPhase: 0,

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
  totalQuestions: 5,
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
  const totalScreens = 12; // Aproximado
  const currentIndex = FormState.screenHistory.length;
  const progress = Math.min((currentIndex / totalScreens) * 100, 100);
  DOM.progressFill.style.width = `${progress}%`;
}

function showNav(show = true) {
  DOM.formNav.classList.toggle('hidden', !show);
}

function showKeyboardHints(show = true) {
  if (DOM.keyboardHints) {
    DOM.keyboardHints.classList.toggle('hidden', !show);
  }
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
  const hideNavScreens = ['welcome', 'thank-you', 'transition-phase2', 'transition-phase3', 'processing-audio'];
  showNav(!hideNavScreens.includes(screen));

  // Actualizar contador
  DOM.navCurrent.textContent = FormState.answeredQuestions;
  DOM.navTotal.textContent = FormState.totalQuestions;

  // Botón anterior
  DOM.btnPrev.disabled = FormState.screenHistory.length <= 2;

  // Keyboard hints solo en preguntas
  const questionScreens = screen.startsWith('q1-') || screen === 'phase2-questions';
  showKeyboardHints(questionScreens && window.innerWidth > 768);
}

async function goBack() {
  if (FormState.screenHistory.length > 1) {
    FormState.screenHistory.pop(); // Quitar actual
    const previousScreen = FormState.screenHistory[FormState.screenHistory.length - 1];
    await goToScreen(previousScreen, false);
  }
}

// ============================================================
// HOOKS DE PANTALLA
// ============================================================

async function onScreenEnter(screenName) {
  switch (screenName) {
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

    // Actualizar respuesta
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
        return; // No avanzar automáticamente
      }
    }

    // Avanzar después de pequeña pausa
    setTimeout(() => advanceFromCurrentQuestion(), 300);
  }
}

function advanceFromCurrentQuestion() {
  const screen = FormState.currentScreen;
  FormState.answeredQuestions++;

  const screenMap = {
    'q1-1': 'q1-2',
    'q1-2': 'q1-3',
    'q1-3': 'q1-4',
    'q1-4': 'q1-5',
    'q1-5': 'transition-phase2'
  };

  const nextScreen = screenMap[screen];
  if (nextScreen) {
    goToScreen(nextScreen);
  }
}

// ============================================================
// FASE 2: PREGUNTAS ADAPTATIVAS (GROQ AI)
// ============================================================

async function handleTransitionToPhase2() {
  // Mostrar loading mínimo
  await sleep(CONFIG.loadingMinDuration);

  // Generar preguntas adaptativas con IA
  try {
    const questions = await generateAdaptiveQuestions();
    FormState.responses.adaptiveQuestions = questions;
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + questions.length;
  } catch (error) {
    console.error('Error generating adaptive questions:', error);
    // Usar preguntas de respaldo
    FormState.responses.adaptiveQuestions = getFallbackQuestions();
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 5 + FormState.responses.adaptiveQuestions.length;
  }

  await goToScreen('phase2-questions');
}

async function generateAdaptiveQuestions() {
  const { phase1 } = FormState.responses;

  const systemPrompt = `Eres un experto en CRM y ventas para el sector farmacéutico y PYME.
Tu tarea es generar 3-4 preguntas de opción múltiple para entender los dolores principales del usuario.

Las preguntas deben:
1. Ser específicas para su sector y situación
2. Usar lenguaje simple y directo (tutear)
3. Tener 3-4 opciones cada una
4. Ayudar a detectar dolores en estas categorías:
   - Visibilidad del equipo (A)
   - Gestión de contactos (B)
   - Muestras médicas (C) - solo si es farmacéutico
   - Ventas y pipeline (D)
   - Cobranza (E)
   - Reportes (F)
   - Comunicación interna (H)
   - Compliance/Regulación (L) - solo si es farmacéutico

Responde SOLO con JSON válido, sin texto adicional.`;

  const userPrompt = `Contexto del usuario:
- Sector: ${phase1.sector || 'no especificado'}
- Tamaño equipo: ${phase1.team_size || 'no especificado'}
- Tiene equipo de campo: ${phase1.has_field_team || 'no especificado'}
- Tecnología actual: ${JSON.stringify(phase1.current_tech || [])}
- Motivación principal: ${phase1.motivation || 'no especificado'}

Genera las preguntas en este formato JSON:
{
  "preguntas": [
    {
      "texto": "¿Pregunta aquí?",
      "hint": "Aclaración breve opcional",
      "opciones": [
        {"texto": "Opción A", "detecta": ["A-VISIBILIDAD"]},
        {"texto": "Opción B", "detecta": ["A-REGISTRO"]},
        {"texto": "Opción C", "detecta": []}
      ]
    }
  ]
}`;

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
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parsear JSON de la respuesta
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON in response');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.preguntas;
}

function getFallbackQuestions() {
  const { phase1 } = FormState.responses;
  const questions = [];

  // Pregunta sobre visibilidad (si tiene equipo de campo)
  if (phase1.has_field_team === 'yes' || phase1.has_field_team === 'both') {
    questions.push({
      texto: '¿Cómo sabes lo que hizo tu equipo hoy?',
      hint: 'Piensa en cómo te enteras de las visitas realizadas',
      opciones: [
        { texto: 'Reviso un sistema/app donde registran', detecta: [] },
        { texto: 'Me mandan un reporte por WhatsApp/email', detecta: ['H-CANALES'] },
        { texto: 'Les pregunto en la junta semanal', detecta: ['A-VISIBILIDAD'] },
        { texto: 'Confío en que están trabajando', detecta: ['A-VISIBILIDAD', 'A-REGISTRO'] }
      ]
    });
  }

  // Pregunta sobre datos/contactos
  questions.push({
    texto: '¿Dónde está la información de tus clientes o contactos?',
    hint: '',
    opciones: [
      { texto: 'En un CRM centralizado', detecta: [] },
      { texto: 'En Excel, pero actualizado', detecta: ['G-EXCEL'] },
      { texto: 'Cada quien tiene sus contactos', detecta: ['B-CENTRALIZACION'] },
      { texto: 'Dispersa en varios lugares', detecta: ['B-CENTRALIZACION', 'G-EXCEL'] }
    ]
  });

  // Pregunta sobre muestras (solo farmacéutico)
  if (phase1.sector === 'pharma') {
    questions.push({
      texto: '¿Cómo controlas las muestras médicas que entrega tu equipo?',
      hint: '',
      opciones: [
        { texto: 'Sistema con trazabilidad completa', detecta: [] },
        { texto: 'Excel actualizado regularmente', detecta: ['C-INVENTARIO'] },
        { texto: 'Cada rep lleva su propio control', detecta: ['C-INVENTARIO', 'C-TRAZABILIDAD'] },
        { texto: 'Honestamente, no tenemos control real', detecta: ['C-TRAZABILIDAD', 'C-CONTROL', 'C-COMPLIANCE'] }
      ]
    });
  }

  // Pregunta sobre reportes
  questions.push({
    texto: '¿Cuánto tardas en generar un reporte para dirección?',
    hint: '',
    opciones: [
      { texto: 'Minutos, tengo dashboards', detecta: [] },
      { texto: 'Un par de horas buscando datos', detecta: ['F-TIEMPO'] },
      { texto: 'Días, tengo que armar todo en Excel', detecta: ['F-TIEMPO', 'F-AUTOMATIZACION'] },
      { texto: 'No genero reportes formales', detecta: ['F-DASHBOARDS', 'F-AUTOMATIZACION'] }
    ]
  });

  return questions;
}

async function renderAdaptiveQuestion() {
  const questions = FormState.responses.adaptiveQuestions;
  const index = FormState.responses.currentAdaptiveIndex;

  if (index >= questions.length) {
    // Terminamos las preguntas adaptativas
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
    const key = String.fromCharCode(65 + i); // A, B, C, D
    return `
      <button class="option-btn" data-value="${i}" data-detects='${JSON.stringify(opt.detecta || [])}'>
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

  // Marcar seleccionado
  DOM.adaptiveOptions.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Guardar respuesta y detecciones
  const index = FormState.responses.currentAdaptiveIndex;
  const detects = JSON.parse(btn.dataset.detects || '[]');

  FormState.responses.phase2[`q2-${index}`] = {
    value: btn.dataset.value,
    detects: detects
  };

  FormState.answeredQuestions++;

  // Avanzar
  setTimeout(async () => {
    FormState.responses.currentAdaptiveIndex++;
    await renderAdaptiveQuestion();
  }, 300);
}

// ============================================================
// FASE 3: DETECCIÓN DE PAINS (GROQ AI)
// ============================================================

async function handleTransitionToPhase3() {
  await sleep(CONFIG.loadingMinDuration);

  try {
    const pains = await detectPains();
    FormState.detectedPains = pains;
  } catch (error) {
    console.error('Error detecting pains:', error);
    FormState.detectedPains = detectPainsFallback();
  }

  await goToScreen('pains-detected');
}

async function detectPains() {
  // Recopilar todas las detecciones
  const allDetections = [];

  // De fase 1
  const { phase1 } = FormState.responses;

  // Mapear respuestas fase 1 a detecciones
  if (phase1.motivation === 'no_visibility') allDetections.push('A-VISIBILIDAD', 'F-DASHBOARDS');
  if (phase1.motivation === 'no_adoption') allDetections.push('G-ADOPCION', 'A-REGISTRO');
  if (phase1.motivation === 'losing_sales') allDetections.push('D-SEGUIMIENTO', 'D-PIPELINE');
  if (phase1.motivation === 'compliance') allDetections.push('L-TRAZABILIDAD', 'C-COMPLIANCE');
  if (phase1.motivation === 'system_fails') allDetections.push('G-ADOPCION');

  if (phase1.current_tech?.includes('excel')) allDetections.push('G-EXCEL');
  if (phase1.current_tech?.includes('informal')) allDetections.push('H-CANALES', 'B-CENTRALIZACION');
  if (phase1.current_tech?.includes('nothing')) allDetections.push('B-CENTRALIZACION', 'D-VISIBILIDAD');

  // De fase 2
  Object.values(FormState.responses.phase2).forEach(response => {
    if (response.detects) {
      allDetections.push(...response.detects);
    }
  });

  // Contar frecuencias
  const frequency = {};
  allDetections.forEach(d => {
    frequency[d] = (frequency[d] || 0) + 1;
  });

  // Ordenar por frecuencia y tomar top 4
  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key]) => key);

  // Si no hay suficientes, agregar defaults según contexto
  if (sorted.length < 4) {
    const defaults = ['A-VISIBILIDAD', 'F-AUTOMATIZACION', 'D-PIPELINE', 'B-CENTRALIZACION'];
    defaults.forEach(d => {
      if (sorted.length < 4 && !sorted.includes(d)) {
        sorted.push(d);
      }
    });
  }

  // Convertir a objetos de pain
  return sorted.map((key, index) => {
    const painData = PAIN_DATABASE[key] || {
      title: 'Dolor detectado',
      description: 'Hemos identificado un área de mejora',
      codes: [],
      focus: 9
    };

    return {
      order: index + 1,
      key: key,
      title: painData.title,
      description: painData.description,
      codes: painData.codes,
      focus: painData.focus,
      confidence: 0.8 + (0.15 * (4 - index) / 4)
    };
  });
}

function detectPainsFallback() {
  const { phase1 } = FormState.responses;
  const pains = [];

  // Pain 1: Visibilidad (si tiene equipo de campo)
  if (phase1.has_field_team !== 'no') {
    pains.push({
      order: 1,
      key: 'A-VISIBILIDAD',
      title: 'No sé qué hace mi equipo',
      description: 'No tienes visibilidad de las actividades de tus representantes',
      codes: ['A01', 'A02'],
      focus: 1,
      confidence: 0.85
    });
  }

  // Pain 2: Datos
  pains.push({
    order: pains.length + 1,
    key: 'B-CENTRALIZACION',
    title: 'Datos dispersos',
    description: 'La información de contactos no está centralizada',
    codes: ['B02'],
    focus: 2,
    confidence: 0.80
  });

  // Pain 3: Muestras (si es pharma)
  if (phase1.sector === 'pharma') {
    pains.push({
      order: pains.length + 1,
      key: 'C-TRAZABILIDAD',
      title: 'Muestras sin trazabilidad',
      description: 'No puedes rastrear a quién se entregó cada muestra',
      codes: ['C02', 'C03'],
      focus: 3,
      confidence: 0.85
    });
  }

  // Pain 4: Reportes
  pains.push({
    order: pains.length + 1,
    key: 'F-AUTOMATIZACION',
    title: 'Reportes manuales',
    description: 'Los reportes se hacen a mano y toman mucho tiempo',
    codes: ['F01', 'F13'],
    focus: 9,
    confidence: 0.75
  });

  // Completar hasta 4 si es necesario
  while (pains.length < 4) {
    pains.push({
      order: pains.length + 1,
      key: 'D-SEGUIMIENTO',
      title: 'Oportunidades sin seguimiento',
      description: 'Pierdes ventas por falta de seguimiento estructurado',
      codes: ['D08', 'D10'],
      focus: 4,
      confidence: 0.70
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

      // Animación de entrada escalonada
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
      <li>¿Cuál de estos 4 dolores te afecta MÁS?</li>
      <li>¿Qué has intentado hacer para resolverlo?</li>
      <li>¿Hay algo más que debamos saber?</li>
    `;
  } else {
    DOM.audioTitle.textContent = 'Cuéntanos qué ajustar';
    DOM.audioSubtitle.textContent = 'Graba un audio explicándonos:';
    DOM.audioPrompts.innerHTML = `
      <li>¿Qué dolor detectamos que NO es prioritario?</li>
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

      // Mostrar preview
      DOM.audioPlayer.src = FormState.audioUrl;
      DOM.audioRecorder.classList.add('hidden');
      DOM.audioPreview.classList.remove('hidden');

      // Parar tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start(1000);

    // UI
    DOM.recorderBtn.classList.add('recording');
    DOM.recorderBtn.querySelector('.recorder-btn__record').classList.add('hidden');
    DOM.recorderBtn.querySelector('.recorder-btn__stop').classList.remove('hidden');
    DOM.recorderStatus.textContent = 'Grabando...';
    DOM.recorderVisualizer.classList.add('active');

    // Timer
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
  if (!FormState.audioBlob) {
    return;
  }

  await goToScreen('processing-audio');
}

// ============================================================
// PROCESAMIENTO DE AUDIO (WHISPER)
// ============================================================

async function handleProcessingAudio() {
  await sleep(1000);

  try {
    // Transcribir audio
    const transcription = await transcribeAudio(FormState.audioBlob);
    FormState.audioTranscription = transcription;

    // Si el usuario quiso ajustar, analizar y actualizar pains
    if (!FormState.painsConfirmed) {
      const adjustedPains = await adjustPainsFromAudio(transcription);
      FormState.finalPains = adjustedPains;
    } else {
      // Enriquecer contexto de los pains existentes
      FormState.finalPains = await enrichPainsFromAudio(FormState.detectedPains, transcription);
    }

  } catch (error) {
    console.error('Error processing audio:', error);
    // Usar los pains detectados sin modificar
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
  const systemPrompt = `Eres un experto analizando necesidades empresariales.
El usuario NO estuvo de acuerdo con los dolores que detectamos y grabó un audio explicando sus dolores reales.

Analiza la transcripción y determina los 4 dolores principales.
Usa esta base de conocimiento para mapear:
${Object.entries(PAIN_DATABASE).map(([key, val]) => `- ${key}: ${val.title}`).join('\n')}

Responde SOLO con JSON válido.`;

  const userPrompt = `Dolores que habíamos detectado:
${FormState.detectedPains.map((p, i) => `${i+1}. ${p.title}: ${p.description}`).join('\n')}

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
      headers: {
        'Content-Type': 'application/json'
      },
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

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.pains.slice(0, 4).map((p, index) => ({
      order: index + 1,
      key: p.key,
      title: p.title,
      description: p.description,
      audioContext: p.audioContext,
      codes: PAIN_DATABASE[p.key]?.codes || [],
      focus: PAIN_DATABASE[p.key]?.focus || 9,
      confidence: 0.9
    }));

  } catch (error) {
    console.error('Error adjusting pains:', error);
    return FormState.detectedPains;
  }
}

async function enrichPainsFromAudio(pains, transcription) {
  // Simplemente agregar contexto del audio
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
      ${pain.audioContext ? `<p class="final-pain-context">${pain.audioContext}</p>` : ''}
    </div>
  `).join('');

  // Auto-avanzar a contacto después de un momento
  setTimeout(() => {
    goToScreen('contact-info');
  }, 3000);
}

function focusContactForm() {
  DOM.contactName.focus();
}

async function handleContactSubmit(e) {
  e.preventDefault();

  // Recopilar datos
  FormState.contact = {
    name: DOM.contactName.value.trim(),
    company: DOM.contactCompany.value.trim(),
    email: DOM.contactEmail.value.trim(),
    whatsapp: DOM.contactWhatsapp.value.trim()
  };

  // Preparar datos finales
  const formData = prepareFormData();

  // Enviar al backend
  try {
    const response = await fetch(CONFIG.submitApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      console.error('Error submitting form:', await response.text());
    } else {
      console.log('Form submitted successfully');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }

  // Mostrar gracias
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
      case 1: // Visibilidad
        experiencias.add('Representante');
        experiencias.add('Supervisor');
        break;
      case 2: // Contactos
        experiencias.add('Representante');
        break;
      case 3: // Muestras
        experiencias.add('Representante');
        experiencias.add('Admin');
        break;
      case 4: // Pipeline
        experiencias.add('Comercial');
        break;
      case 5: // Cobranza
        experiencias.add('Comercial');
        break;
      case 10: // Compliance
        experiencias.add('Admin');
        break;
      default:
        experiencias.add('Supervisor');
    }
  });

  return Array.from(experiencias);
}

function getPlanRecomendado() {
  // Si necesita IA (dictado, briefings, etc.)
  const needsAI = FormState.finalPains.some(p =>
    ['P-VOZ', 'P-CONTEXTO', 'P-ALERTAS', 'P-AUTOMATICO'].includes(p.key)
  );

  if (needsAI) {
    return 'Pro';
  }

  // Si tiene equipo de campo, al menos Esencial
  if (FormState.responses.phase1.has_field_team !== 'no') {
    return 'Esencial';
  }

  return 'Base';
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

function handleKeyboardShortcuts(e) {
  // Enter para continuar
  if (e.key === 'Enter') {
    const activeOption = document.querySelector('.option-btn.selected');
    if (activeOption) {
      advanceFromCurrentQuestion();
    }
    return;
  }

  // A-F para seleccionar opciones
  const key = e.key.toUpperCase();
  if (key >= 'A' && key <= 'F') {
    const index = key.charCodeAt(0) - 65;
    const currentOptions = document.querySelectorAll('.form-screen.active .option-btn');
    if (currentOptions[index]) {
      currentOptions[index].click();
    }
  }

  // Escape para volver
  if (e.key === 'Escape') {
    goBack();
  }
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

function init() {
  initDOM();

  // Event Listeners - Botón Start
  DOM.btnStart.addEventListener('click', () => goToScreen('q1-1'));

  // Event Listeners - Opciones
  document.addEventListener('click', handleOptionClick);

  // Event Listeners - Navegación
  DOM.btnPrev.addEventListener('click', goBack);

  // Event Listeners - Multi-select continue
  if (DOM.btnContinueQ4) {
    DOM.btnContinueQ4.addEventListener('click', advanceFromCurrentQuestion);
  }

  // Event Listeners - Pains
  DOM.btnConfirmPains.addEventListener('click', handleConfirmPains);
  DOM.btnAdjustPains.addEventListener('click', handleAdjustPains);

  // Event Listeners - Audio
  DOM.recorderBtn.addEventListener('click', toggleRecording);
  DOM.btnRerecord.addEventListener('click', handleRerecord);
  DOM.btnUseAudio.addEventListener('click', handleUseAudio);

  // Event Listeners - Contact Form
  DOM.contactForm.addEventListener('submit', handleContactSubmit);

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Responsive - ocultar hints en móvil
  window.addEventListener('resize', () => {
    const questionScreens = FormState.currentScreen.startsWith('q1-') ||
                           FormState.currentScreen === 'phase2-questions';
    showKeyboardHints(questionScreens && window.innerWidth > 768);
  });

  console.log('APEX Discovery Form initialized');
  console.log('API Key configured:', !!CONFIG.apiKey);
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
