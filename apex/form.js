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
  generateQuestionsApiUrl: '/.netlify/functions/generate-questions',

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
// BASE DE CONOCIMIENTO DE DOLORES
// Movida al servidor (netlify/functions/pain-knowledge-base.js)
// Las preguntas se generan server-side via generate-questions API
// ============================================================

// Stubs vacíos para compatibilidad con código legacy que referencia estas variables
const PAIN_CATALOG = typeof window !== 'undefined' && window.PAIN_CATALOG || {};
const PAIN_CLUSTERS = typeof window !== 'undefined' && window.PAIN_CLUSTERS || {};
const CLUSTER_QUESTIONS = typeof window !== 'undefined' && window.CLUSTER_QUESTIONS || {};

// ============================================================
// 16 SITUACIONES PROBLEMÁTICAS (Categorías A-P)
// El cliente las califica directamente
// ============================================================

// Tipos de negocio soportados
const TIPOS_NEGOCIO = {
  distribuidor: {
    label: 'Distribuidor',
    descripcion: 'Distribuidora farmacéutica o de dispositivos médicos con equipo de campo'
  },
  clinica: {
    label: 'Clínica',
    descripcion: 'Clínica médica, estética, dental u otro centro de salud'
  }
};

// ---- SITUACIONES PARA DISTRIBUIDORES ----
const SITUACIONES_DISTRIBUIDOR = [
  {
    id: 'A',
    categoria: 'A',
    titulo: 'No sé qué hace mi equipo de campo',
    descripcion: 'Tus representantes salen a la calle pero no tienes visibilidad de sus actividades, rutas ni resultados del día.',
    icono: 'ph-gps-slash',
    clusters: ['A-VISIBILIDAD', 'A-UBICACION', 'A-REGISTRO', 'A-COBERTURA']
  },
  {
    id: 'B',
    categoria: 'B',
    titulo: 'Mi base de clientes está desordenada',
    descripcion: 'Los datos de contactos y clientes están dispersos, desactualizados o cada vendedor tiene su propia lista.',
    icono: 'ph-users-three',
    clusters: ['B-CENTRALIZACION', 'B-DATOS', 'B-HISTORIAL']
  },
  {
    id: 'C',
    categoria: 'C',
    titulo: 'Las muestras médicas no tienen control',
    descripcion: 'No sabes cuántas muestras tiene cada rep, a quién las entregaron, ni puedes rastrear lotes para auditorías.',
    icono: 'ph-pill',
    clusters: ['C-TRAZABILIDAD', 'C-INVENTARIO', 'C-COMPLIANCE']
  },
  {
    id: 'D',
    categoria: 'D',
    titulo: 'Las oportunidades de venta se pierden',
    descripcion: 'No hay un pipeline visible, las cotizaciones no se registran y no sabes en qué etapa está cada negociación.',
    icono: 'ph-trend-down',
    clusters: ['D-PIPELINE', 'D-SEGUIMIENTO', 'D-VISIBILIDAD']
  },
  {
    id: 'E',
    categoria: 'E',
    titulo: 'La cobranza es un dolor de cabeza',
    descripcion: 'Hay facturas vencidas que nadie sigue, no tienes alertas automáticas y los morosos siguen comprando.',
    icono: 'ph-money',
    clusters: ['E-SEGUIMIENTO', 'E-ALERTAS', 'E-VISIBILIDAD']
  },
  {
    id: 'F',
    categoria: 'F',
    titulo: 'Los reportes me quitan el día',
    descripcion: 'Generar un reporte para dirección toma horas o días porque tienes que buscar y consolidar datos de varios lugares.',
    icono: 'ph-file-x',
    clusters: ['F-TIEMPO', 'F-AUTOMATIZACION', 'F-DASHBOARDS']
  },
  {
    id: 'G',
    categoria: 'G',
    titulo: 'La tecnología actual no funciona',
    descripcion: 'Usas Excel, WhatsApp o un CRM que nadie adopta. La información está fragmentada en múltiples herramientas.',
    icono: 'ph-laptop',
    clusters: ['G-EXCEL', 'G-ADOPCION', 'G-FRAGMENTACION']
  },
  {
    id: 'H',
    categoria: 'H',
    titulo: 'La comunicación interna falla',
    descripcion: 'Los mensajes importantes se pierden, no hay un canal oficial, y coordinar al equipo es complicado.',
    icono: 'ph-chat-slash',
    clusters: ['H-CANALES', 'H-VISIBILIDAD', 'H-ALINEACION']
  },
  {
    id: 'I',
    categoria: 'I',
    titulo: 'Los clientes se quejan del servicio',
    descripcion: 'No das seguimiento a lo que prometes, tardas en responder, y los clientes sienten que no les prestas atención.',
    icono: 'ph-user-minus',
    clusters: ['I-SEGUIMIENTO', 'I-RESPUESTA', 'I-SATISFACCION']
  },
  {
    id: 'J',
    categoria: 'J',
    titulo: 'El marketing no se mide',
    descripcion: 'Haces campañas o eventos pero no sabes qué funciona. No tienes ROI ni puedes atribuir resultados.',
    icono: 'ph-megaphone-simple',
    clusters: ['J-ROI', 'J-ATRIBUCION', 'J-MATERIALES']
  },
  {
    id: 'K',
    categoria: 'K',
    titulo: 'Planeamos a ciegas',
    descripcion: 'No tienes datos para tomar decisiones estratégicas. Los planes se hacen por intuición, no por evidencia.',
    icono: 'ph-compass',
    clusters: ['K-DATOS', 'K-OBJETIVOS', 'K-TERRITORIOS']
  },
  {
    id: 'L',
    categoria: 'L',
    titulo: 'Las auditorías me asustan',
    descripcion: 'No estás preparado para una auditoría de regulación. Documentos dispersos, firmas sin digitalizar, trazabilidad incompleta.',
    icono: 'ph-shield-warning',
    clusters: ['L-DOCUMENTACION', 'L-FIRMAS', 'L-TRAZABILIDAD']
  },
  {
    id: 'M',
    categoria: 'M',
    titulo: 'Capacitar al equipo es difícil',
    descripcion: 'Los nuevos tardan mucho en aprender, no hay material de capacitación, y la rotación te obliga a empezar de cero.',
    icono: 'ph-graduation-cap',
    clusters: ['M-ONBOARDING', 'M-ROTACION', 'M-CONOCIMIENTO']
  },
  {
    id: 'N',
    categoria: 'N',
    titulo: 'Los eventos no dan resultados',
    descripcion: 'Organizas congresos, webinars o reuniones pero no capturas leads ni mides el impacto real.',
    icono: 'ph-calendar-x',
    clusters: ['N-CAPTURA', 'N-SEGUIMIENTO', 'N-ROI']
  },
  {
    id: 'O',
    categoria: 'O',
    titulo: 'No sé qué hace la competencia',
    descripcion: 'Desconoces qué productos promueven, a qué médicos visitan, o qué estrategias usan tus competidores.',
    icono: 'ph-eye-slash',
    clusters: ['O-INTELIGENCIA', 'O-COMPARATIVO', 'O-ESTRATEGIA']
  },
  {
    id: 'P',
    categoria: 'P',
    titulo: 'Trabajo manual que debería ser automático',
    descripcion: 'Hay tareas repetitivas que podrían automatizarse: recordatorios, reportes, asignaciones, seguimientos.',
    icono: 'ph-robot',
    clusters: ['P-TAREAS', 'P-RECORDATORIOS', 'P-AUTOMATICO']
  }
];

// ---- SITUACIONES PARA CLÍNICAS ----
const SITUACIONES_CLINICA = [
  {
    id: 'CA',
    categoria: 'CA',
    titulo: 'No controlo las citas',
    descripcion: 'Las citas llegan por WhatsApp, teléfono o redes. Hay cancelaciones sin aviso y huecos en la agenda que nadie llena.',
    icono: 'ph-calendar-x',
    clusters: ['CA-AGENDA', 'CA-CANCELACIONES', 'CA-CANALES']
  },
  {
    id: 'CB',
    categoria: 'CB',
    titulo: 'Los pacientes no vuelven',
    descripcion: 'No hay seguimiento post-tratamiento, no recuerdas cuándo toca revisión y pierdes pacientes por falta de contacto.',
    icono: 'ph-user-minus',
    clusters: ['CB-SEGUIMIENTO', 'CB-RETENCION', 'CB-REACTIVACION']
  },
  {
    id: 'CC',
    categoria: 'CC',
    titulo: 'Los historiales son un caos',
    descripcion: 'Expedientes en papel, fotos en el móvil del doctor, información clínica dispersa en varios lugares.',
    icono: 'ph-folder-simple-dashed',
    clusters: ['CC-EXPEDIENTES', 'CC-FOTOS', 'CC-CENTRALIZACION']
  },
  {
    id: 'CD',
    categoria: 'CD',
    titulo: 'No sé qué tratamientos son rentables',
    descripcion: 'No mides qué servicios dan margen, cuáles no se venden, ni cuánto cuesta realmente cada procedimiento.',
    icono: 'ph-chart-pie-slice',
    clusters: ['CD-RENTABILIDAD', 'CD-COSTOS', 'CD-SERVICIOS']
  },
  {
    id: 'CE',
    categoria: 'CE',
    titulo: 'La facturación me quita tiempo',
    descripcion: 'Facturas manuales, errores de cobro, pagos pendientes sin seguimiento y cierres de caja complicados.',
    icono: 'ph-receipt-x',
    clusters: ['CE-FACTURACION', 'CE-COBROS', 'CE-PENDIENTES']
  },
  {
    id: 'CF',
    categoria: 'CF',
    titulo: 'El stock de insumos falla',
    descripcion: 'Te enteras que falta material el día del procedimiento. No hay alertas de inventario bajo ni control de caducidades.',
    icono: 'ph-package',
    clusters: ['CF-INVENTARIO', 'CF-ALERTAS', 'CF-CADUCIDAD']
  },
  {
    id: 'CG',
    categoria: 'CG',
    titulo: 'No tengo presencia digital',
    descripcion: 'Sin web profesional, redes sociales descuidadas y no atraes pacientes nuevos por canales digitales.',
    icono: 'ph-globe-simple-x',
    clusters: ['CG-WEB', 'CG-REDES', 'CG-CAPTACION']
  },
  {
    id: 'CH',
    categoria: 'CH',
    titulo: 'La comunicación con el paciente falla',
    descripcion: 'No confirmas citas automáticamente, no envías preparación pre-consulta ni seguimiento post-tratamiento.',
    icono: 'ph-chat-slash',
    clusters: ['CH-CONFIRMACIONES', 'CH-PREPARACION', 'CH-POSTRATA']
  },
  {
    id: 'CI',
    categoria: 'CI',
    titulo: 'Las quejas me sorprenden',
    descripcion: 'No mides satisfacción del paciente, te enteras de las quejas por Google Reviews o redes sociales.',
    icono: 'ph-star-half',
    clusters: ['CI-SATISFACCION', 'CI-REVIEWS', 'CI-NPS']
  },
  {
    id: 'CJ',
    categoria: 'CJ',
    titulo: 'El equipo no sigue protocolos',
    descripcion: 'Cada profesional hace las cosas diferente. No hay checklists ni estándares documentados para procedimientos.',
    icono: 'ph-clipboard-text',
    clusters: ['CJ-PROTOCOLOS', 'CJ-CHECKLISTS', 'CJ-ESTANDARES']
  },
  {
    id: 'CK',
    categoria: 'CK',
    titulo: 'No cumplo con normativa',
    descripcion: 'Consentimientos informados sin firmar, datos de pacientes sin proteger, documentación incompleta para inspecciones.',
    icono: 'ph-shield-warning',
    clusters: ['CK-CONSENTIMIENTOS', 'CK-DATOS', 'CK-INSPECCION']
  },
  {
    id: 'CL',
    categoria: 'CL',
    titulo: 'Capacitar al personal es difícil',
    descripcion: 'Rotación alta, no hay manual de procedimientos, cada nuevo empleado empieza de cero.',
    icono: 'ph-student',
    clusters: ['CL-ONBOARDING', 'CL-ROTACION', 'CL-MANUALES']
  },
  {
    id: 'CM',
    categoria: 'CM',
    titulo: 'Los reportes me cuestan horas',
    descripcion: 'Consolidar datos de ocupación, facturación y pacientes es un trabajo manual interminable.',
    icono: 'ph-chart-bar',
    clusters: ['CM-REPORTES', 'CM-METRICAS', 'CM-DASHBOARDS']
  },
  {
    id: 'CN',
    categoria: 'CN',
    titulo: 'No aprovecho los datos de pacientes',
    descripcion: 'No segmentas por tipo de tratamiento, no haces campañas de reactivación, no personalizas la comunicación.',
    icono: 'ph-user-list',
    clusters: ['CN-SEGMENTACION', 'CN-CAMPANAS', 'CN-PERSONALIZACION']
  },
  {
    id: 'CO',
    categoria: 'CO',
    titulo: 'La tecnología no me ayuda',
    descripcion: 'Software viejo o genérico, hojas de Excel para todo, WhatsApp como único canal de comunicación.',
    icono: 'ph-laptop',
    clusters: ['CO-SOFTWARE', 'CO-ADOPCION', 'CO-FRAGMENTACION']
  },
  {
    id: 'CP',
    categoria: 'CP',
    titulo: 'Hago todo manual pudiendo automatizar',
    descripcion: 'Recordatorios de citas, confirmaciones, seguimientos post-tratamiento... todo a mano o no se hace.',
    icono: 'ph-robot',
    clusters: ['CP-RECORDATORIOS', 'CP-CONFIRMACIONES', 'CP-AUTOMATICO']
  }
];

// Función para obtener las situaciones según el tipo de negocio seleccionado
function getSituaciones() {
  const tipo = FormState.tipoNegocio;
  if (tipo === 'clinica') return SITUACIONES_CLINICA;
  return SITUACIONES_DISTRIBUIDOR;
}

// Log: base de conocimiento ahora en servidor
console.log('APEX: Base de conocimiento en servidor (generate-questions API)');

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

  // Tipo de negocio (distribuidor / clinica)
  tipoNegocio: null,

  // Información de la empresa
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

  // NUEVO: Sistema de Swipe + MaxDiff
  situaciones: {
    // Fase Swipe: situaciones que el usuario marcó como "me afecta"
    seleccionadas: [],       // IDs de situaciones seleccionadas (swipe right)
    descartadas: [],         // IDs descartadas (swipe left)
    currentSwipeIndex: 0,    // Índice actual en el swipe

    // Fase priorización por toque
    rankOrder: [],           // TODAS las seleccionadas en orden de importancia

    // Resultado final
    top4: []                 // Las 4 situaciones más importantes
  },

  // Pains detectados
  detectedPains: [],
  finalPains: [],
  painsConfirmed: null,

  // Sistema de detección de FOCOS (signal-detector.js)
  clusterAccumulator: null,  // Se inicializa al empezar Phase 2
  focosDetectados: [],       // FOCOS calculados

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
  totalQuestions: 0,  // Se actualiza cuando Claude genera las preguntas
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
    adaptiveProgressPills: document.getElementById('adaptiveProgressPills'),
    adaptiveQuestionTitle: document.getElementById('adaptiveQuestionTitle'),
    adaptiveQuestionHint: document.getElementById('adaptiveQuestionHint'),
    adaptiveOptions: document.getElementById('adaptiveOptions'),

    // Fase 3 - Pains (con confirmación individual)
    painsList: document.getElementById('painsList'),
    btnContinuePains: document.getElementById('btnContinuePains'),
    painsContinueHint: document.getElementById('painsContinueHint'),

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
    btnContinueQ7: document.getElementById('btnContinueQ7'),
    btnContinueResearch: document.getElementById('btnContinueResearch'),
    btnContinueTop4: document.getElementById('btnContinueTop4'),

    // Swipe elements
    swipeCard: document.getElementById('swipeCard'),
    swipeCardIcon: document.getElementById('swipeCardIcon'),
    swipeCardTitle: document.getElementById('swipeCardTitle'),
    swipeCardDescription: document.getElementById('swipeCardDescription'),
    swipeCounter: document.getElementById('swipeCounter'),
    swipeTotal: document.getElementById('swipeTotal'),
    btnSwipeNo: document.getElementById('btnSwipeNo'),
    btnSwipeYes: document.getElementById('btnSwipeYes'),
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
  const hideNavScreens = ['welcome', 'thank-you', 'transition-phase2', 'transition-phase3', 'processing-audio', 'researching-company', 'swipe-situaciones', 'transition-maxdiff', 'maxdiff-priorizar', 'top4-resultado', 'transition-phase2-questions'];
  showNav(!hideNavScreens.includes(screen));

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
    case 'tipo-negocio':
      setupTipoNegocioListeners();
      break;
    case 'researching-company':
      await handleResearchCompany();
      break;
    case 'transition-phase2':
      await handleTransitionToPhase2();
      break;
    case 'swipe-situaciones':
      initSwipeScreen();
      break;
    case 'transition-maxdiff':
      // Esperar y luego ir a priorización por toque
      await sleep(2000);
      await goToScreen('maxdiff-priorizar');
      break;
    case 'maxdiff-priorizar':
      initRankByTap();
      break;
    case 'top4-resultado':
      renderTop4Resultado();
      break;
    case 'transition-phase2-questions':
      await sleep(CONFIG.loadingMinDuration);
      await handleTransitionToPhase2Questions();
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
// SELECCIÓN DE TIPO DE NEGOCIO
// ============================================================

function setupTipoNegocioListeners() {
  const buttons = document.querySelectorAll('.tipo-negocio-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Visual feedback
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      // Guardar tipo
      FormState.tipoNegocio = btn.dataset.tipo;
      console.log('Tipo de negocio seleccionado:', FormState.tipoNegocio);

      // Avanzar al swipe después de breve pausa
      setTimeout(() => goToScreen('swipe-situaciones'), 400);
    });
  });
}

// ============================================================
// INVESTIGACIÓN DE EMPRESA
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
    // Timeout de 30 segundos (Extract + Search en paralelo + Groq)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(CONFIG.researchApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: FormState.company.name,
        website: FormState.company.website
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();
    console.log('Research results:', data);

    if (data.success && data.profile) {
      FormState.company.profile = data.profile;
      FormState.company.researchComplete = true;

      // Pre-rellenar respuestas con lo detectado (para saltar preguntas)
      prefillFromDetected(data.profile);

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

// Pre-rellenar FormState con información detectada
// Esto permite saltar preguntas que ya conocemos
function prefillFromDetected(profile) {
  if (!profile) return;

  const detectado = profile.detectado || {};
  const porPreguntar = profile.por_preguntar || {};

  console.log('Prefilling from detected:', { detectado, porPreguntar });

  // Detectar tipo de negocio para las situaciones del swipe
  if (detectado.sector) {
    FormState.responses.phase1.sector = detectado.sector;
  }

  // Determinar tipo de negocio desde el sector
  if (detectado.sector === 'clinica') {
    FormState.tipoNegocio = 'clinica';
  } else if (detectado.sector) {
    FormState.tipoNegocio = 'distribuidor';
  }
  console.log('Tipo de negocio detectado:', FormState.tipoNegocio, '(sector:', detectado.sector, ')');

  // Equipo de campo: pre-rellenar si NO vamos a preguntar
  if (!porPreguntar.tiene_equipo_campo && detectado.tiene_equipo_campo !== null) {
    FormState.responses.phase1.has_field_team = detectado.tiene_equipo_campo ? 'yes' : 'no';
    console.log('Prefilled has_field_team:', detectado.tiene_equipo_campo);
  }

  // Tamaño del equipo: pre-rellenar si NO vamos a preguntar
  if (!porPreguntar.tamaño_equipo && detectado.tamaño_estimado) {
    FormState.responses.phase1.team_size = detectado.tamaño_estimado;
    console.log('Prefilled team_size:', detectado.tamaño_estimado);
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
    'clinica': 'Clínica médica, estética o dental',
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
  const processesCard = document.getElementById('findingProcessesCard');
  const processesEl = document.getElementById('findingProcesses');
  const sourcesCard = document.getElementById('findingSourcesCard');
  const sourcesEl = document.getElementById('findingSources');
  const confidenceEl = document.getElementById('researchConfidence');

  if (profile && profile.empresa) {
    const porPreguntar = profile.por_preguntar || {};
    const detectado = profile.detectado || {};

    // Nombre - siempre mostrar
    if (nameEl) nameEl.textContent = profile.empresa.nombre || FormState.company.name || 'Tu empresa';

    // Sector - solo mostrar si NO vamos a preguntar (ya lo detectamos)
    if (sectorEl) {
      if (!porPreguntar.sector && detectado.sector) {
        sectorEl.textContent = sectorNames[detectado.sector] || detectado.sector;
      } else {
        sectorEl.textContent = 'Te preguntaremos en el siguiente paso';
      }
    }

    // Descripción de procesos - OBLIGATORIA siempre
    const descripcion = profile.empresa.descripcion_procesos || profile.tavily_answer || '';
    if (descEl) {
      descEl.textContent = descripcion || 'No se encontró información sobre cómo opera esta empresa. Te haremos algunas preguntas para entender mejor.';
    }

    // Equipo de campo - solo mostrar si NO vamos a preguntar
    if (fieldTeamCard) {
      if (!porPreguntar.tiene_equipo_campo && detectado.tiene_equipo_campo !== null && detectado.tiene_equipo_campo !== undefined) {
        fieldTeamCard.style.display = 'block';
        if (fieldTeamEl) fieldTeamEl.textContent = detectado.tiene_equipo_campo ? 'Sí, cuenta con equipo en campo' : 'No, operan desde oficina';
      } else {
        fieldTeamCard.style.display = 'none';
      }
    }

    // Muestras médicas - solo mostrar si es pharma y NO vamos a preguntar muestras
    if (samplesCard) {
      if (detectado.sector === 'pharma' && detectado.maneja_muestras !== null && detectado.maneja_muestras !== undefined) {
        samplesCard.style.display = 'block';
        if (samplesEl) samplesEl.textContent = detectado.maneja_muestras ? 'Sí, maneja muestras médicas' : 'No maneja muestras';
      } else {
        samplesCard.style.display = 'none';
      }
    }

    // Mostrar procesos detectados
    if (profile.procesos_detectados && profile.procesos_detectados.length > 0 && processesCard) {
      processesCard.style.display = 'block';
      if (processesEl) {
        const listItems = profile.procesos_detectados.map(p => `<li>${p}</li>`).join('');
        processesEl.innerHTML = `<ul>${listItems}</ul>`;
      }
    }

    // Mostrar fuentes de Tavily
    if (profile.sources && profile.sources.length > 0 && sourcesCard) {
      sourcesCard.style.display = 'block';
      if (sourcesEl) {
        const sourceLinks = profile.sources
          .slice(0, 3) // máximo 3 fuentes
          .map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.title || s.url}</a>`)
          .join('');
        sourcesEl.innerHTML = sourceLinks;
      }
    }

    if (confidenceEl) {
      const confianza = profile.detectado?.confianza || 0;
      if (hadWebSearch && confianza >= 0.6) {
        confidenceEl.textContent = 'Información verificada de búsqueda web en tiempo real';
      } else if (hadWebSearch) {
        confidenceEl.textContent = 'Información parcial de búsqueda web - te haremos algunas preguntas adicionales';
      } else {
        confidenceEl.textContent = 'Sin información web disponible - te haremos preguntas para conocerte mejor';
      }
    }
  } else {
    // Sin resultados
    if (nameEl) nameEl.textContent = FormState.company.name || 'Tu empresa';
    if (sectorEl) sectorEl.textContent = 'Te preguntaremos en el siguiente paso';
    if (descEl) descEl.textContent = 'No encontramos información pública sobre esta empresa. Las siguientes preguntas nos ayudarán a entender tu contexto y detectar oportunidades de mejora.';
    if (confidenceEl) confidenceEl.textContent = 'Continuaremos con preguntas personalizadas';
  }
}

async function handleContinueFromResearch() {
  // Si detectamos tipo de negocio, ir directo al swipe
  if (FormState.tipoNegocio) {
    console.log('Tipo detectado:', FormState.tipoNegocio, '→ ir al swipe');
    await goToScreen('swipe-situaciones');
  } else {
    // No se detectó tipo → pedir que elija manualmente
    console.log('Tipo no detectado → pedir selección manual');
    await goToScreen('tipo-negocio');
  }
}

// Obtener primera pregunta que debemos mostrar
function getFirstQuestionToShow() {
  const profile = FormState.company.profile;
  const porPreguntar = profile?.por_preguntar || {};

  // Orden de preguntas (9 preguntas en Fase 1)
  const questions = [
    { screen: 'q1-1', field: 'tamaño_equipo' },
    { screen: 'q1-2', field: 'tiene_equipo_campo' },
    { screen: 'q1-3', field: 'sector' },
    { screen: 'q1-4', field: 'tecnologia_actual' },
    { screen: 'q1-5', field: 'motivacion' },
    { screen: 'q1-6', field: 'client_info' },
    { screen: 'q1-7', field: 'sales_pipeline' },
    { screen: 'q1-8', field: 'sells_credit' },
    { screen: 'q1-9', field: 'report_time' }
  ];

  for (const q of questions) {
    // Si debemos preguntar (por_preguntar.X es true o undefined)
    if (porPreguntar[q.field] !== false) {
      return q.screen;
    }
  }

  // Si todo ya está respondido, ir a fase 2
  return 'transition-phase2';
}

// Determinar siguiente pantalla saltando las que ya conocemos
function getNextScreen(currentScreen) {
  const profile = FormState.company.profile;
  const porPreguntar = profile?.por_preguntar || {};
  const detectado = profile?.detectado || {};

  const fullFlow = ['q1-1', 'q1-2', 'q1-3', 'q1-4', 'q1-5', 'q1-6', 'q1-7', 'q1-8', 'q1-9', 'transition-phase2'];

  // Mapeo de pantallas a campos de por_preguntar
  const screenToField = {
    'q1-1': 'tamaño_equipo',
    'q1-2': 'tiene_equipo_campo',
    'q1-3': 'sector',
    'q1-4': 'tecnologia_actual',
    'q1-5': 'motivacion',
    'q1-6': 'data_quality',
    'q1-7': 'sales_pipeline',
    'q1-8': 'sells_credit',
    'q1-9': 'report_time'
  };

  const currentIndex = fullFlow.indexOf(currentScreen);
  if (currentIndex === -1) return null;

  // Buscar siguiente pantalla que debamos mostrar
  for (let i = currentIndex + 1; i < fullFlow.length; i++) {
    const nextScreen = fullFlow[i];

    // Si es transición, siempre mostrar
    if (nextScreen === 'transition-phase2') {
      return nextScreen;
    }

    const field = screenToField[nextScreen];

    // Si debemos preguntar (por_preguntar.X es true o undefined)
    if (porPreguntar[field] !== false) {
      return nextScreen;
    }

    // Si saltamos, guardar el valor detectado en las respuestas
    if (field === 'tiene_equipo_campo' && detectado.tiene_equipo_campo !== null) {
      FormState.responses.phase1.has_field_team = detectado.tiene_equipo_campo ? 'yes' : 'no';
      console.log('Skipping q1-2, using detected value:', detectado.tiene_equipo_campo);
    }
    if (field === 'sector' && detectado.sector) {
      FormState.responses.phase1.sector = detectado.sector;
      console.log('Skipping q1-3, using detected value:', detectado.sector);
    }

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
// FASE 2A: SWIPE CARDS - Selección de situaciones
// ============================================================

function initSwipeScreen() {
  // Resetear estado
  FormState.situaciones.seleccionadas = [];
  FormState.situaciones.descartadas = [];
  FormState.situaciones.currentSwipeIndex = 0;

  // Renderizar primera card (sin animación de entrada)
  renderSwipeCard(true);

  // Setup event listeners
  setupSwipeListeners();
}

function renderSwipeCard(isInitial = false) {
  const index = FormState.situaciones.currentSwipeIndex;

  if (index >= getSituaciones().length) {
    // Todas las situaciones procesadas
    handleSwipeComplete();
    return;
  }

  const situacion = getSituaciones()[index];
  const card = document.getElementById('swipeCard');
  const iconEl = document.getElementById('swipeCardIcon');
  const titleEl = document.getElementById('swipeCardTitle');
  const descEl = document.getElementById('swipeCardDescription');
  const counterEl = document.getElementById('swipeCounter');
  const totalEl = document.getElementById('swipeTotal');

  // Reset card state
  card.classList.remove('exit-left', 'exit-right', 'swiping-left', 'swiping-right', 'entering', 'returning');
  card.style.transform = '';
  card.style.opacity = '1';

  // Añadir animación de entrada solo si no es inicial
  if (!isInitial) {
    card.classList.add('entering');
    setTimeout(() => card.classList.remove('entering'), 400);
  }

  // Update content (usando Phosphor Icons)
  iconEl.innerHTML = `<i class="ph ${situacion.icono}"></i>`;
  titleEl.textContent = situacion.titulo;
  descEl.textContent = situacion.descripcion;
  counterEl.textContent = index + 1;
  totalEl.textContent = getSituaciones().length;

  // Actualizar cartas del stack (preview de siguientes)
  renderStackCards(index);
}

function renderStackCards(currentIndex) {
  const card1 = document.getElementById('swipeCard1');
  const card2 = document.getElementById('swipeCard2');

  // Carta siguiente (stack-1)
  if (currentIndex + 1 < getSituaciones().length) {
    const next1 = getSituaciones()[currentIndex + 1];
    card1.querySelector('.swipe-card__icon').innerHTML = `<i class="ph ${next1.icono}"></i>`;
    card1.querySelector('.swipe-card__title').textContent = next1.titulo;
    card1.querySelector('.swipe-card__description').textContent = next1.descripcion;
    card1.style.display = '';
  } else {
    card1.style.display = 'none';
  }

  // Carta después de la siguiente (stack-2)
  if (currentIndex + 2 < getSituaciones().length) {
    const next2 = getSituaciones()[currentIndex + 2];
    card2.querySelector('.swipe-card__icon').innerHTML = `<i class="ph ${next2.icono}"></i>`;
    card2.querySelector('.swipe-card__title').textContent = next2.titulo;
    card2.querySelector('.swipe-card__description').textContent = next2.descripcion;
    card2.style.display = '';
  } else {
    card2.style.display = 'none';
  }
}

function setupSwipeListeners() {
  const card = document.getElementById('swipeCard');
  const stack = document.getElementById('swipeStack');
  const btnNo = document.getElementById('btnSwipeNo');
  const btnYes = document.getElementById('btnSwipeYes');

  // Limpiar listeners anteriores para evitar duplicados
  if (window._swipeCleanup) {
    window._swipeCleanup();
  }

  // Touch/mouse swipe con física mejorada
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let hasMoved = false;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;

  const handleStart = (e) => {
    if (card.classList.contains('exit-left') || card.classList.contains('exit-right')) return;

    isDragging = true;
    hasMoved = false;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    lastX = startX;
    lastTime = Date.now();
    velocity = 0;

    card.classList.remove('returning');
    stack.classList.add('dragging');
  };

  const handleMove = (e) => {
    if (!isDragging) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const now = Date.now();
    const dt = now - lastTime;

    if (dt > 0) {
      velocity = (clientX - lastX) / dt * 16; // Normalizado a ~60fps
    }

    // Marcar que hubo movimiento real (mínimo 10px)
    if (Math.abs(clientX - startX) > 10) {
      hasMoved = true;
    }

    lastX = clientX;
    lastTime = now;
    currentX = clientX;

    const diff = currentX - startX;

    // Rotación más sutil y natural
    const rotation = diff * 0.04;
    // Pequeño lift mientras arrastra
    const lift = Math.min(Math.abs(diff) * 0.1, 10);

    card.style.transform = `translateX(${diff}px) translateY(${-lift}px) rotate(${rotation}deg)`;

    // Indicadores de dirección con threshold más pequeño
    if (diff < -40) {
      card.classList.add('swiping-left');
      card.classList.remove('swiping-right');
    } else if (diff > 40) {
      card.classList.add('swiping-right');
      card.classList.remove('swiping-left');
    } else {
      card.classList.remove('swiping-left', 'swiping-right');
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    stack.classList.remove('dragging');

    // Si no hubo movimiento real, no hacer swipe (evita swipes involuntarios en móvil)
    if (!hasMoved) {
      card.style.transform = '';
      card.classList.remove('swiping-left', 'swiping-right');
      return;
    }

    const diff = currentX - startX;

    // Considerar velocidad además de distancia para swipe más natural
    const velocityThreshold = 0.5;
    const distanceThreshold = 80;

    const shouldSwipeLeft = diff < -distanceThreshold || (diff < -30 && velocity < -velocityThreshold);
    const shouldSwipeRight = diff > distanceThreshold || (diff > 30 && velocity > velocityThreshold);

    if (shouldSwipeLeft) {
      swipeCard('left');
    } else if (shouldSwipeRight) {
      swipeCard('right');
    } else {
      // Volver a posición con efecto spring
      card.classList.add('returning');
      card.style.transform = '';
      card.classList.remove('swiping-left', 'swiping-right');
    }
  };

  const onBtnNo = () => swipeCard('left');
  const onBtnYes = () => swipeCard('right');

  card.addEventListener('mousedown', handleStart);
  card.addEventListener('touchstart', handleStart, { passive: true });
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('touchmove', handleMove, { passive: true });
  document.addEventListener('mouseup', handleEnd);
  document.addEventListener('touchend', handleEnd);

  // Button clicks
  btnNo.addEventListener('click', onBtnNo);
  btnYes.addEventListener('click', onBtnYes);

  // Keyboard
  document.addEventListener('keydown', handleSwipeKeyboard);

  // Guardar función de limpieza para evitar listeners duplicados
  window._swipeCleanup = () => {
    card.removeEventListener('mousedown', handleStart);
    card.removeEventListener('touchstart', handleStart);
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('touchmove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchend', handleEnd);
    btnNo.removeEventListener('click', onBtnNo);
    btnYes.removeEventListener('click', onBtnYes);
    document.removeEventListener('keydown', handleSwipeKeyboard);
  };
}

function handleSwipeKeyboard(e) {
  if (FormState.currentScreen !== 'swipe-situaciones') return;

  if (e.key === 'ArrowLeft') {
    swipeCard('left');
  } else if (e.key === 'ArrowRight') {
    swipeCard('right');
  }
}

function swipeCard(direction) {
  const card = document.getElementById('swipeCard');
  const stack = document.getElementById('swipeStack');
  const index = FormState.situaciones.currentSwipeIndex;
  const situacion = getSituaciones()[index];

  // Evitar doble swipe
  if (card.classList.contains('exit-left') || card.classList.contains('exit-right')) return;

  // Limpiar clases de drag
  card.classList.remove('swiping-left', 'swiping-right', 'returning');
  stack.classList.remove('dragging');

  // Animate exit
  card.classList.add(direction === 'left' ? 'exit-left' : 'exit-right');

  // Record choice
  if (direction === 'right') {
    FormState.situaciones.seleccionadas.push(situacion.id);
    console.log(`Seleccionada: ${situacion.titulo}`);
  } else {
    FormState.situaciones.descartadas.push(situacion.id);
    console.log(`Descartada: ${situacion.titulo}`);
  }

  // Next card - timing sincronizado con animación
  setTimeout(() => {
    FormState.situaciones.currentSwipeIndex++;
    renderSwipeCard();
  }, 380);
}

async function handleSwipeComplete() {
  const seleccionadas = FormState.situaciones.seleccionadas;

  console.log('Swipe completado:', seleccionadas.length, 'situaciones seleccionadas');

  if (seleccionadas.length === 0) {
    // Si no seleccionó ninguna, mostrar mensaje y permitir continuar
    alert('Por favor selecciona al menos una situación que te afecte.');
    FormState.situaciones.currentSwipeIndex = 0;
    renderSwipeCard();
    return;
  }

  if (seleccionadas.length <= 4) {
    // Si 4 o menos, esas son el top4 directamente (sin priorización)
    FormState.situaciones.top4 = seleccionadas.slice(0, 4);
    FormState.situaciones.rankOrder = seleccionadas.slice();
    await goToScreen('top4-resultado');
    return;
  }

  // Si más de 4, priorización por toque
  document.getElementById('situacionesCount').textContent = seleccionadas.length;
  await goToScreen('transition-maxdiff');
  // La transición a maxdiff-priorizar se maneja en onScreenEnter('transition-maxdiff')
}

// ============================================================
// FASE 2B: PRIORIZACIÓN POR TOQUE
// ============================================================

function initRankByTap() {
  const seleccionadas = FormState.situaciones.seleccionadas;

  // Orden en que el usuario va tocando (array de IDs)
  FormState.situaciones.rankOrder = [];

  const grid = document.getElementById('rankGrid');
  const countEl = document.getElementById('rankCount');
  const totalEl = document.getElementById('rankTotal');
  const btnContinue = document.getElementById('btnRankContinue');

  totalEl.textContent = seleccionadas.length;
  countEl.textContent = '0';
  btnContinue.classList.add('hidden');

  // Render todas las tarjetas seleccionadas
  grid.innerHTML = seleccionadas.map(id => {
    const situacion = getSituaciones().find(s => s.id === id);
    return `
      <div class="rank-card" data-id="${id}">
        <div class="rank-card__badge"></div>
        <div class="rank-card__icon"><i class="ph ${situacion.icono}"></i></div>
        <h4 class="rank-card__title">${situacion.titulo}</h4>
      </div>
    `;
  }).join('');

  // Click listeners
  grid.querySelectorAll('.rank-card').forEach(card => {
    card.addEventListener('click', handleRankCardClick);
  });

  // Botón continuar
  btnContinue.onclick = handleRankComplete;
}

function handleRankCardClick(e) {
  const card = e.currentTarget;
  const id = card.dataset.id;
  const rankOrder = FormState.situaciones.rankOrder;
  const countEl = document.getElementById('rankCount');
  const totalEl = document.getElementById('rankTotal');
  const btnContinue = document.getElementById('btnRankContinue');

  const existingIndex = rankOrder.indexOf(id);

  if (existingIndex !== -1) {
    // Ya está rankeada → deshacer este y todos los posteriores
    const removed = rankOrder.splice(existingIndex);

    // Actualizar UI de todas las tarjetas removidas
    removed.forEach(removedId => {
      const removedCard = document.querySelector(`.rank-card[data-id="${removedId}"]`);
      if (removedCard) {
        removedCard.classList.remove('ranked', 'rank-top4');
        removedCard.querySelector('.rank-card__badge').textContent = '';
      }
    });
  } else {
    // Nueva selección → agregar al ranking
    rankOrder.push(id);
    card.classList.add('ranked');
    card.querySelector('.rank-card__badge').textContent = rankOrder.length;
  }

  // Actualizar badges y highlights de top4
  rankOrder.forEach((rankedId, idx) => {
    const rankedCard = document.querySelector(`.rank-card[data-id="${rankedId}"]`);
    if (rankedCard) {
      rankedCard.classList.add('ranked');
      rankedCard.querySelector('.rank-card__badge').textContent = idx + 1;

      // Las primeras 4 tienen highlight especial
      if (idx < 4) {
        rankedCard.classList.add('rank-top4');
      } else {
        rankedCard.classList.remove('rank-top4');
      }
    }
  });

  countEl.textContent = rankOrder.length;

  const total = FormState.situaciones.seleccionadas.length;

  // Mostrar botón continuar solo cuando TODAS están rankeadas
  console.log(`Rank progress: ${rankOrder.length}/${total}`);
  if (rankOrder.length >= total) {
    btnContinue.classList.remove('hidden');
    btnContinue.disabled = false;
    // Scroll suave al botón
    setTimeout(() => btnContinue.scrollIntoView({ behavior: 'smooth', block: 'end' }), 150);
  } else {
    btnContinue.classList.add('hidden');
  }
}

async function handleRankComplete() {
  const rankOrder = FormState.situaciones.rankOrder;
  console.log('Priorización completada:', rankOrder);

  // Top 4 = las primeras 4 tocadas
  FormState.situaciones.top4 = rankOrder.slice(0, 4);

  await goToScreen('top4-resultado');
}

function renderTop4Resultado() {
  const rankOrder = FormState.situaciones.rankOrder;
  const top4 = FormState.situaciones.top4;
  const rest = rankOrder.slice(4);
  const container = document.getElementById('top4List');

  // Grupo 1: Los 4 focos principales
  let html = top4.map((id, index) => {
    const situacion = getSituaciones().find(s => s.id === id);
    return `
      <div class="top4-card">
        <div class="top4-card__rank">${index + 1}</div>
        <div class="top4-card__content">
          <h3 class="top4-card__title">${situacion.titulo}</h3>
          <p class="top4-card__desc">${situacion.descripcion}</p>
        </div>
        <div class="top4-card__icon">
          <i class="ph ${situacion.icono}"></i>
        </div>
      </div>
    `;
  }).join('');

  // Grupo 2: También te afectan (si hay más de 4)
  if (rest.length > 0) {
    html += `
      <div class="also-affects">
        <h4 class="also-affects__title">También te afectan</h4>
        <div class="also-affects__list">
          ${rest.map((id) => {
            const s = getSituaciones().find(sit => sit.id === id);
            return `<span class="also-affects__item">
              <i class="ph ${s.icono}"></i> ${s.titulo}
            </span>`;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Mensaje final
  html += `
    <p class="top4-message">
      Vamos a profundizar en tus 4 focos principales${rest.length > 0 ? ', considerando también el resto de situaciones que te afectan' : ''}.
    </p>
  `;

  container.innerHTML = html;
}

async function handleContinueFromTop4() {
  // Ahora pasamos a las preguntas adaptativas basadas en el top 4
  await goToScreen('transition-phase2-questions');
}

// ============================================================
// FASE 2C: PREGUNTAS ADAPTATIVAS (GROQ AI) - MEJORADO
// ============================================================

async function handleTransitionToPhase2() {
  // Ya hicimos el swipe al principio, ahora vamos directo a preguntas adaptativas
  await goToScreen('transition-phase2-questions');
}

async function handleTransitionToPhase2Questions() {
  try {
    console.log('Generating profundización questions based on Top 4:', FormState.situaciones.top4);

    const questions = await generateAdaptiveQuestionsFromTop4();

    if (!questions || questions.length === 0) {
      throw new Error('No questions generated');
    }

    console.log('Generated', questions.length, 'profundización questions');
    FormState.responses.adaptiveQuestions = questions;
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = questions.length;
  } catch (error) {
    console.error('Error generating questions:', error);
    FormState.responses.adaptiveQuestions = getFallbackQuestionsFromTop4();
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = FormState.responses.adaptiveQuestions.length;
  }

  await goToScreen('phase2-questions');
}

// Genera preguntas llamando al servidor (Claude API + base de conocimiento server-side)
async function generateAdaptiveQuestionsFromTop4() {
  const top4 = FormState.situaciones.top4;
  const rankOrder = FormState.situaciones.rankOrder;

  console.log('Calling generate-questions API with:', { top4, rankOrder, tipoNegocio: FormState.tipoNegocio });

  try {
    const response = await fetch(CONFIG.generateQuestionsApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top4: top4,
        rankOrder: rankOrder,
        tipoNegocio: FormState.tipoNegocio || 'distribuidor',
        researchProfile: FormState.company.profile || null,
        phase1Responses: FormState.responses.phase1 || null
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.questions && data.questions.length > 0) {
      console.log(`Server generated ${data.questions.length} questions (model: ${data.meta?.model || 'unknown'})`);
      return data.questions;
    }

    // Si el servidor devolvió fallback
    if (data.questions && data.questions.length > 0) {
      console.log('Using server fallback questions. Error:', data.error, '| Meta:', JSON.stringify(data.meta));
      return data.questions;
    }

    throw new Error(data.error || 'No questions returned');

  } catch (error) {
    console.error('Failed to generate questions from server:', error);
    // Usar fallback local
    return getFallbackQuestionsFromTop4();
  }
}

function getFallbackQuestionsFromTop4() {
  // Preguntas genéricas si falla la generación
  return [
    {
      texto: '¿Cómo te enteras de lo que hizo tu equipo hoy?',
      hint: 'Visitas, llamadas, reuniones',
      profundiza_en: 'Visibilidad',
      opciones: [
        { texto: 'Dashboard en tiempo real', detecta: [], gravedad: 0 },
        { texto: 'Me mandan WhatsApp', detecta: ['A-VISIBILIDAD'], gravedad: 1 },
        { texto: 'Les pregunto en la junta', detecta: ['A-VISIBILIDAD', 'H-VISIBILIDAD'], gravedad: 2 },
        { texto: 'Confío en que están trabajando', detecta: ['A-VISIBILIDAD', 'A-REGISTRO'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Dónde vive la información de tus clientes?',
      hint: 'Datos de contacto, historial',
      profundiza_en: 'Centralización',
      opciones: [
        { texto: 'Sistema centralizado', detecta: [], gravedad: 0 },
        { texto: 'Excel "oficial"', detecta: ['G-EXCEL'], gravedad: 1 },
        { texto: 'Cada vendedor tiene su lista', detecta: ['B-CENTRALIZACION'], gravedad: 2 },
        { texto: 'Dispersa en varios lugares', detecta: ['B-CENTRALIZACION', 'B-DATOS'], gravedad: 3 }
      ]
    },
    {
      texto: '¿Cómo sabes cuánto vas a vender este mes?',
      hint: 'Forecast, pipeline, predicción',
      profundiza_en: 'Visibilidad de ventas',
      opciones: [
        { texto: 'Pipeline actualizado con probabilidades', detecta: [], gravedad: 0 },
        { texto: 'Sumo cotizaciones manualmente', detecta: ['D-FORECAST'], gravedad: 1 },
        { texto: 'Pregunto a los vendedores', detecta: ['D-VISIBILIDAD', 'D-PIPELINE'], gravedad: 2 },
        { texto: 'Sorpresa hasta fin de mes', detecta: ['D-VISIBILIDAD', 'D-PIPELINE', 'D-FORECAST'], gravedad: 3 }
      ]
    }
  ];
}

// ============================================================
// FASE 2 (LEGACY): PREGUNTAS ADAPTATIVAS (GROQ AI)
// ============================================================

async function handleTransitionToPhase2Legacy() {
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
    FormState.totalQuestions = 9 + questions.length;
  } catch (error) {
    console.error('Error generating adaptive questions, using fallback:', error);
    console.log('Fallback reason:', error.message);
    FormState.responses.adaptiveQuestions = getFallbackQuestions();
    FormState.responses.currentAdaptiveIndex = 0;
    FormState.totalQuestions = 9 + FormState.responses.adaptiveQuestions.length;
  }

  await goToScreen('phase2-questions');
}

async function generateAdaptiveQuestions() {
  const { phase1 } = FormState.responses;
  const companyProfile = FormState.company.profile;

  console.log('=== GENERATING ADAPTIVE QUESTIONS WITH FOCOS ===');
  console.log('Phase1 responses:', phase1);

  // ========================================
  // PASO 1: Procesar respuestas Phase 1 y calcular FOCOS
  // ========================================

  // Crear acumulador de clusters
  const accumulator = new ClusterAccumulator();

  // Procesar cada respuesta de Phase 1
  Object.entries(phase1).forEach(([question, value]) => {
    accumulator.processPhase1Response(question, value);
  });

  // Procesar dolores de investigación si existen
  if (companyProfile?.dolores_probables) {
    accumulator.processResearchDolores(companyProfile.dolores_probables);
  }

  // Calcular FOCOS
  accumulator.calculateFocos();

  // Guardar en FormState para uso posterior
  FormState.clusterAccumulator = accumulator;
  FormState.focosDetectados = accumulator.focos;

  console.log('=== FOCOS DETECTADOS ===');
  console.log(accumulator.getSummary());

  // ========================================
  // PASO 2: Banco de preguntas por categoría
  // ========================================

  const QUESTION_BANK = {
    // Si tiene equipo de campo
    field_team: [
      {
        texto: "¿Cómo te enteras de lo que hizo tu equipo hoy?",
        hint: "Visitas, llamadas, reuniones",
        profundiza_en: "Visibilidad",
        opciones: [
          { texto: "Tengo un dashboard en tiempo real", detecta: [], gravedad: 0 },
          { texto: "Me mandan WhatsApp o correo", detecta: ["A-VISIBILIDAD"], gravedad: 1 },
          { texto: "Les pregunto uno por uno", detecta: ["A-VISIBILIDAD", "A-REGISTRO"], gravedad: 2 },
          { texto: "No sé hasta que me dicen", detecta: ["A-VISIBILIDAD", "A-REGISTRO", "G-ADOPCION"], gravedad: 3 }
        ]
      },
      {
        texto: "¿Cuándo registran las visitas a clientes?",
        hint: "En el momento, al final del día, cuando pueden",
        profundiza_en: "Registro",
        opciones: [
          { texto: "En el momento, desde el celular", detecta: [], gravedad: 0 },
          { texto: "Al final del día", detecta: ["A-REGISTRO"], gravedad: 1 },
          { texto: "Cuando se acuerdan o pueden", detecta: ["A-REGISTRO", "G-ADOPCION"], gravedad: 2 },
          { texto: "La verdad casi no registran", detecta: ["A-REGISTRO", "A-VISIBILIDAD", "G-ADOPCION"], gravedad: 3 }
        ]
      },
      {
        texto: "¿Sabes qué clientes no han sido visitados?",
        hint: "Cobertura de cartera",
        profundiza_en: "Cobertura",
        opciones: [
          { texto: "Sí, tengo alertas automáticas", detecta: [], gravedad: 0 },
          { texto: "Lo reviso manualmente en reportes", detecta: ["A-VISIBILIDAD"], gravedad: 1 },
          { texto: "Más o menos, depende del vendedor", detecta: ["A-VISIBILIDAD", "D-SEGUIMIENTO"], gravedad: 2 },
          { texto: "No tengo forma de saberlo", detecta: ["A-VISIBILIDAD", "D-SEGUIMIENTO", "B-CENTRALIZACION"], gravedad: 3 }
        ]
      }
    ],
    // Si usa Excel
    excel_user: [
      {
        texto: "¿Cuánto tardas en armar un reporte para dirección?",
        hint: "Ventas, visitas, resultados",
        profundiza_en: "Reportes",
        opciones: [
          { texto: "Minutos, está automatizado", detecta: [], gravedad: 0 },
          { texto: "Un par de horas", detecta: ["F-TIEMPO"], gravedad: 1 },
          { texto: "Me toma casi todo el día", detecta: ["F-TIEMPO", "F-REPORTES"], gravedad: 2 },
          { texto: "Días, junto info de todos lados", detecta: ["F-TIEMPO", "F-REPORTES", "B-CENTRALIZACION"], gravedad: 3 }
        ]
      },
      {
        texto: "¿Cada cuánto se desactualiza tu Excel?",
        hint: "Datos de clientes, precios, inventario",
        profundiza_en: "Datos",
        opciones: [
          { texto: "Casi nunca, está sincronizado", detecta: [], gravedad: 0 },
          { texto: "A veces hay datos viejos", detecta: ["B-DATOS"], gravedad: 1 },
          { texto: "Seguido, es difícil mantenerlo", detecta: ["B-DATOS", "G-EXCEL"], gravedad: 2 },
          { texto: "Siempre hay problemas con versiones", detecta: ["B-DATOS", "G-EXCEL", "B-CENTRALIZACION"], gravedad: 3 }
        ]
      }
    ],
    // Si es pharma o regulado
    pharma: [
      {
        texto: "¿Cómo controlas las muestras médicas?",
        hint: "Entrega, inventario, vencimiento",
        profundiza_en: "Muestras",
        opciones: [
          { texto: "Sistema con trazabilidad completa", detecta: [], gravedad: 0 },
          { texto: "Excel con firmas escaneadas", detecta: ["C-TRAZABILIDAD"], gravedad: 1 },
          { texto: "Cada rep lleva su control", detecta: ["C-TRAZABILIDAD", "C-COMPLIANCE"], gravedad: 2 },
          { texto: "Es un problema constante", detecta: ["C-TRAZABILIDAD", "C-COMPLIANCE", "A-VISIBILIDAD"], gravedad: 3 }
        ]
      },
      {
        texto: "¿Estás listo para una auditoría mañana?",
        hint: "Visitas, muestras, documentación",
        profundiza_en: "Compliance",
        opciones: [
          { texto: "Sí, todo está en sistema", detecta: [], gravedad: 0 },
          { texto: "Necesito unas horas para preparar", detecta: ["C-COMPLIANCE"], gravedad: 1 },
          { texto: "Sería complicado juntarlo todo", detecta: ["C-COMPLIANCE", "C-TRAZABILIDAD"], gravedad: 2 },
          { texto: "Me daría un infarto", detecta: ["C-COMPLIANCE", "C-TRAZABILIDAD", "F-REPORTES"], gravedad: 3 }
        ]
      }
    ],
    // Si vende a crédito
    credit_sales: [
      {
        texto: "¿Tienes visibilidad de tu cartera vencida?",
        hint: "Facturas pendientes, días de mora",
        profundiza_en: "Cobranza",
        opciones: [
          { texto: "Sí, con alertas automáticas", detecta: [], gravedad: 0 },
          { texto: "Reviso reportes semanalmente", detecta: ["E-COBRANZA"], gravedad: 1 },
          { texto: "Más o menos, a veces se me pasa", detecta: ["E-COBRANZA", "F-REPORTES"], gravedad: 2 },
          { texto: "Es un dolor de cabeza constante", detecta: ["E-COBRANZA", "F-REPORTES", "B-DATOS"], gravedad: 3 }
        ]
      }
    ],
    // Si tiene CRM pero problemas de adopción
    crm_adoption: [
      {
        texto: "¿Tu equipo realmente usa el CRM?",
        hint: "Registros diarios, actualizaciones",
        profundiza_en: "Adopción",
        opciones: [
          { texto: "Sí, es parte del proceso", detecta: [], gravedad: 0 },
          { texto: "Algunos lo usan, otros no tanto", detecta: ["G-ADOPCION"], gravedad: 1 },
          { texto: "Lo usan solo cuando los obligo", detecta: ["G-ADOPCION", "A-REGISTRO"], gravedad: 2 },
          { texto: "Casi nadie lo usa realmente", detecta: ["G-ADOPCION", "A-REGISTRO", "A-VISIBILIDAD"], gravedad: 3 }
        ]
      }
    ],
    // General - siempre aplica
    general: [
      {
        texto: "¿Cómo das seguimiento a oportunidades de venta?",
        hint: "Prospectos, cotizaciones, cierres",
        profundiza_en: "Pipeline",
        opciones: [
          { texto: "Pipeline en sistema con etapas", detecta: [], gravedad: 0 },
          { texto: "Lista en Excel que actualizo", detecta: ["D-PIPELINE"], gravedad: 1 },
          { texto: "Cada vendedor tiene su método", detecta: ["D-PIPELINE", "D-SEGUIMIENTO"], gravedad: 2 },
          { texto: "Se nos pierden oportunidades", detecta: ["D-PIPELINE", "D-SEGUIMIENTO", "A-VISIBILIDAD"], gravedad: 3 }
        ]
      },
      {
        texto: "¿Qué pasa cuando un vendedor se va?",
        hint: "Clientes, historial, conocimiento",
        profundiza_en: "Continuidad",
        opciones: [
          { texto: "Todo queda en el sistema", detecta: [], gravedad: 0 },
          { texto: "Hay que pedirle que entregue sus archivos", detecta: ["B-CENTRALIZACION"], gravedad: 1 },
          { texto: "Se pierde algo de información", detecta: ["B-CENTRALIZACION", "B-DATOS"], gravedad: 2 },
          { texto: "Se lleva todo en la cabeza", detecta: ["B-CENTRALIZACION", "B-DATOS", "D-SEGUIMIENTO"], gravedad: 3 }
        ]
      }
    ]
  };

  // ========================================
  // PASO 3: Seleccionar preguntas basadas en FOCOS
  // ========================================

  // Obtener categorías prioritarias basadas en FOCOS detectados
  const priorityCategories = accumulator.getQuestionCategories(5);
  console.log('Priority categories from FOCOS:', priorityCategories);

  const selectedQuestions = [];
  const usedTextos = new Set();

  // Primera pasada: una pregunta por categoría prioritaria
  priorityCategories.forEach(category => {
    if (QUESTION_BANK[category] && selectedQuestions.length < 5) {
      const categoryQuestions = QUESTION_BANK[category];
      for (const q of categoryQuestions) {
        if (!usedTextos.has(q.texto)) {
          selectedQuestions.push(q);
          usedTextos.add(q.texto);
          break; // Solo una por categoría en primera pasada
        }
      }
    }
  });

  // Segunda pasada: completar con más preguntas si faltan
  if (selectedQuestions.length < 5) {
    priorityCategories.forEach(category => {
      if (QUESTION_BANK[category]) {
        const categoryQuestions = QUESTION_BANK[category];
        for (const q of categoryQuestions) {
          if (!usedTextos.has(q.texto) && selectedQuestions.length < 5) {
            selectedQuestions.push(q);
            usedTextos.add(q.texto);
          }
        }
      }
    });
  }

  console.log('=== PREGUNTAS SELECCIONADAS (basadas en FOCOS) ===');
  selectedQuestions.forEach((q, i) => {
    console.log(`  ${i+1}. "${q.texto}" → ${q.profundiza_en}`);
  });

  return selectedQuestions;
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

  // Actualizar progress pills
  const pillsContainer = document.getElementById('adaptiveProgressPills');
  if (pillsContainer) {
    pillsContainer.innerHTML = questions.map((_, i) =>
      `<span class="progress-pill ${i < index ? 'done' : ''} ${i === index ? 'active' : ''}"></span>`
    ).join('');
  }

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

  const response = {
    value: btn.dataset.value,
    detects: detects,
    gravedad: gravedad
  };

  FormState.responses.phase2[`q2-${index}`] = response;

  // Acumular en el ClusterAccumulator para detección de pains
  if (FormState.clusterAccumulator) {
    FormState.clusterAccumulator.processPhase2Response(response);
  }

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
  const { phase1 } = FormState.responses;
  const top4 = FormState.situaciones.top4;

  // ========================================
  // USAR SITUACIONES SELECCIONADAS POR EL USUARIO (TOP 4)
  // ========================================

  console.log('=== DETECTANDO PAINS BASADOS EN SITUACIONES TOP 4 ===');
  console.log('Top 4 situaciones:', top4);

  // Si tenemos top4, usarlas directamente
  if (top4 && top4.length > 0) {
    // Convertir situaciones a dolores
    const pains = top4.map((situacionId, index) => {
      const situacion = getSituaciones().find(s => s.id === situacionId);
      if (!situacion) return null;

      return {
        order: index + 1,
        key: situacion.clusters[0] || `${situacionId}-GENERAL`,
        title: situacion.titulo,
        description: situacion.descripcion,
        categoria: situacion.categoria,
        clusters: situacion.clusters,
        confidence: 1.0 - (index * 0.05)  // 100% porque el usuario lo seleccionó
      };
    }).filter(Boolean);

    // Si tenemos los pains, usar IA para personalizar las descripciones
    return await personalizePainsWithAI(pains);
  }

  // Fallback al sistema anterior si no hay top4
  const accumulator = FormState.clusterAccumulator;
  if (accumulator) {
    accumulator.calculateFocos();
    FormState.focosDetectados = accumulator.focos;
  }

  const sortedClusters = accumulator
    ? Object.entries(accumulator.clusterScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([cluster]) => cluster)
    : [];

  return detectPainsFallback();
}

// Personaliza los dolores con IA basándose en el contexto de la empresa
async function personalizePainsWithAI(pains) {
  const { phase1 } = FormState.responses;

  const systemPrompt = `Eres un experto analista que personaliza descripciones de dolores empresariales.

El usuario YA SELECCIONÓ estas situaciones como sus principales dolores. Tu trabajo es personalizar las descripciones para su contexto específico.

La descripción personalizada debe:
1. Ser específica para su industria/sector
2. Usar "tú" y lenguaje directo
3. Mencionar el impacto concreto en SU negocio
4. Ser concisa (1-2 oraciones)

Responde SOLO con JSON válido.`;

  const userPrompt = `EMPRESA: ${FormState.company.profile?.empresa?.nombre || FormState.company.name || 'No especificado'}
SECTOR: ${phase1.sector || 'No especificado'}
TAMAÑO: ${phase1.team_size || 'No especificado'}
TIENE EQUIPO CAMPO: ${phase1.has_field_team || 'No especificado'}

SITUACIONES SELECCIONADAS POR EL USUARIO (en orden de prioridad):
${pains.map((p, i) => `${i + 1}. ${p.title}: ${p.description}`).join('\n')}

Personaliza cada dolor para esta empresa. Formato:
{
  "dolores": [
    {
      "titulo": "Título personalizado",
      "descripcion": "Descripción personalizada para esta empresa",
      "impacto": "Consecuencia concreta"
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

    // Combinar datos originales con personalizados
    return pains.map((pain, index) => {
      const personalized = parsed.dolores[index] || {};
      return {
        ...pain,
        title: personalized.titulo || pain.title,
        description: personalized.descripcion || pain.description,
        impacto: personalized.impacto || ''
      };
    });

  } catch (error) {
    console.error('Error personalizing pains:', error);
    // Retornar los pains sin personalizar
    return pains;
  }
}

function detectPainsFallback() {
  const { phase1 } = FormState.responses;
  const top4 = FormState.situaciones.top4;

  // Si tenemos situaciones top4, usarlas
  if (top4 && top4.length > 0) {
    return top4.map((situacionId, index) => {
      const situacion = getSituaciones().find(s => s.id === situacionId);
      if (!situacion) return null;

      return {
        order: index + 1,
        key: situacion.clusters[0] || `${situacionId}-GENERAL`,
        title: situacion.titulo,
        description: situacion.descripcion,
        categoria: situacion.categoria,
        clusters: situacion.clusters,
        confidence: 1.0
      };
    }).filter(Boolean);
  }

  // Fallback basado en respuestas de Phase 1
  const pains = [];

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

  pains.push({
    order: pains.length + 1,
    key: 'D-PIPELINE',
    title: 'Pipeline invisible',
    description: 'Las oportunidades de venta viven en la cabeza de cada vendedor',
    codes: ['D01', 'D02', 'D03'],
    focus: 4,
    confidence: 0.80
  });

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

      // Reset card state
      card.classList.remove('confirmed', 'has-audio');
    }
  });

  // Setup individual pain confirmation handlers
  setupPainConfirmation();
}

// Estado de confirmación de pains individuales
const painConfirmationState = {
  1: { confirmed: false, hasAudio: false, audioBlob: null },
  2: { confirmed: false, hasAudio: false, audioBlob: null },
  3: { confirmed: false, hasAudio: false, audioBlob: null },
  4: { confirmed: false, hasAudio: false, audioBlob: null }
};

let currentPainRecording = null;
let painMediaRecorder = null;
let painAudioChunks = [];
let painRecordingTimer = null;
let painRecordingSeconds = 0;

function setupPainConfirmation() {
  // Reset state
  Object.keys(painConfirmationState).forEach(key => {
    painConfirmationState[key] = { confirmed: false, hasAudio: false, audioBlob: null };
  });

  // Add click handlers for confirm/record buttons
  document.querySelectorAll('.pain-btn').forEach(btn => {
    btn.addEventListener('click', handlePainAction);
  });

  // Add click handlers for individual recorders
  document.querySelectorAll('.pain-recorder-btn').forEach(btn => {
    btn.addEventListener('click', handlePainRecordToggle);
  });

  updatePainsContinueButton();
}

function handlePainAction(e) {
  const btn = e.currentTarget;
  const painNum = btn.dataset.pain;
  const action = btn.dataset.action;
  const card = btn.closest('.pain-card');

  if (action === 'confirm') {
    // Mark as confirmed
    painConfirmationState[painNum].confirmed = true;
    painConfirmationState[painNum].hasAudio = false;

    // Update UI
    card.classList.add('confirmed');
    card.classList.remove('has-audio');
    btn.classList.add('confirmed');

    // Hide recorder if visible
    const recorder = card.querySelector('.pain-audio-recorder');
    if (recorder) recorder.classList.add('hidden');

    console.log(`Pain ${painNum} confirmed`);

  } else if (action === 'record') {
    // Show recorder for this pain
    const recorder = card.querySelector('.pain-audio-recorder');
    if (recorder) {
      recorder.classList.toggle('hidden');

      // Remove confirmed state if showing recorder
      if (!recorder.classList.contains('hidden')) {
        painConfirmationState[painNum].confirmed = false;
        card.classList.remove('confirmed');
        card.querySelector('.pain-btn--confirm')?.classList.remove('confirmed');
      }
    }
  }

  updatePainsContinueButton();
}

async function handlePainRecordToggle(e) {
  const btn = e.currentTarget;
  const painNum = btn.dataset.pain;

  if (painMediaRecorder && painMediaRecorder.state === 'recording') {
    // Stop recording
    stopPainRecording(painNum);
  } else {
    // Start recording
    await startPainRecording(painNum);
  }
}

async function startPainRecording(painNum) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    currentPainRecording = painNum;

    painMediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    });

    painAudioChunks = [];

    painMediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        painAudioChunks.push(e.data);
      }
    };

    painMediaRecorder.onstop = () => {
      const blob = new Blob(painAudioChunks, { type: painMediaRecorder.mimeType });
      painConfirmationState[painNum].hasAudio = true;
      painConfirmationState[painNum].audioBlob = blob;
      painConfirmationState[painNum].confirmed = false;

      // Update UI
      const card = document.querySelector(`.pain-card[data-pain="${painNum}"]`);
      card.classList.add('has-audio');
      card.classList.remove('confirmed');
      card.querySelector('.pain-btn--record')?.classList.add('has-audio');
      card.querySelector('.pain-btn--confirm')?.classList.remove('confirmed');

      const recorder = card.querySelector('.pain-audio-recorder');
      const status = recorder.querySelector('.pain-recorder-status');
      status.textContent = `Audio grabado (${painRecordingSeconds}s)`;

      stream.getTracks().forEach(track => track.stop());
      updatePainsContinueButton();

      console.log(`Pain ${painNum} audio recorded:`, blob.size, 'bytes');
    };

    painMediaRecorder.start(1000);

    // Update UI
    const card = document.querySelector(`.pain-card[data-pain="${painNum}"]`);
    const btn = card.querySelector('.pain-recorder-btn');
    const timer = card.querySelector('.pain-recorder-timer');
    const status = card.querySelector('.pain-recorder-status');

    btn.classList.add('recording');
    btn.querySelector('.pain-recorder-icon--record').classList.add('hidden');
    btn.querySelector('.pain-recorder-icon--stop').classList.remove('hidden');
    status.textContent = 'Grabando...';

    painRecordingSeconds = 0;
    painRecordingTimer = setInterval(() => {
      painRecordingSeconds++;
      const mins = Math.floor(painRecordingSeconds / 60);
      const secs = painRecordingSeconds % 60;
      timer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

  } catch (error) {
    console.error('Error starting pain recording:', error);
    alert('No pudimos acceder al micrófono. Por favor permite el acceso.');
  }
}

function stopPainRecording(painNum) {
  if (painMediaRecorder && painMediaRecorder.state === 'recording') {
    painMediaRecorder.stop();

    clearInterval(painRecordingTimer);

    const card = document.querySelector(`.pain-card[data-pain="${painNum}"]`);
    const btn = card.querySelector('.pain-recorder-btn');

    btn.classList.remove('recording');
    btn.querySelector('.pain-recorder-icon--record').classList.remove('hidden');
    btn.querySelector('.pain-recorder-icon--stop').classList.add('hidden');

    currentPainRecording = null;
  }
}

function updatePainsContinueButton() {
  // Check if all 4 pains have been addressed (confirmed OR has audio)
  const allAddressed = Object.values(painConfirmationState).every(
    state => state.confirmed || state.hasAudio
  );

  const btn = DOM.btnContinuePains;
  const hint = DOM.painsContinueHint;

  if (btn) {
    btn.classList.toggle('hidden', !allAddressed);
  }

  if (hint) {
    const pending = Object.values(painConfirmationState).filter(
      state => !state.confirmed && !state.hasAudio
    ).length;

    if (pending === 0) {
      hint.textContent = '¡Listo! Puedes continuar';
    } else {
      hint.textContent = `Faltan ${pending} dolor${pending > 1 ? 'es' : ''} por confirmar`;
    }
  }
}

function handleContinuePains() {
  // Build final pains with confirmation status
  FormState.finalPains = FormState.detectedPains.map((pain, index) => {
    const painNum = index + 1;
    const state = painConfirmationState[painNum];
    return {
      ...pain,
      confirmed: state.confirmed,
      hasAudio: state.hasAudio,
      audioBlob: state.audioBlob
    };
  });

  FormState.painsConfirmed = true;

  // Go directly to contact form (skip general audio since we have individual audios)
  goToScreen('final-pains');
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
      motivacion: FormState.responses.phase1.motivation,
      // Nuevas preguntas fase 1
      calidad_datos: FormState.responses.phase1.data_quality,
      pipeline_ventas: FormState.responses.phase1.sales_pipeline,
      vende_credito: FormState.responses.phase1.sells_credit,
      tiempo_reportes: FormState.responses.phase1.report_time
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

    // Event Listeners - Botón Start (va a identificación de empresa)
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

  // Event Listeners - Multi-select continue buttons
  if (DOM.btnContinueQ4) {
    DOM.btnContinueQ4.addEventListener('click', advanceFromCurrentQuestion);
  }
  if (DOM.btnContinueQ5) {
    DOM.btnContinueQ5.addEventListener('click', advanceFromCurrentQuestion);
  }
  if (DOM.btnContinueQ7) {
    DOM.btnContinueQ7.addEventListener('click', advanceFromCurrentQuestion);
  }

  // Event Listeners - Research continue
  if (DOM.btnContinueResearch) {
    DOM.btnContinueResearch.addEventListener('click', handleContinueFromResearch);
  }

  // Event Listeners - Top 4 continue → profundización con Claude
  if (DOM.btnContinueTop4) {
    DOM.btnContinueTop4.addEventListener('click', handleContinueFromTop4);
  }

  // Event Listeners - Pains (confirmación individual)
  if (DOM.btnContinuePains) {
    DOM.btnContinuePains.addEventListener('click', handleContinuePains);
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


  console.log('APEX Discovery Form initialized (knowledge base on server)');

  } catch (error) {
    console.error('Error initializing form:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
