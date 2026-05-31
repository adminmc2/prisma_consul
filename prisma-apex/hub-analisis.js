// PRISMA Hub — análisis (entregables ARMC en iframe) + simulador (módulo nativo).
// Sub-slice 3.2.5.a F1: SIM shell. Se irá alimentando en .b/.c/.d/.e con
// las 4 capas y el bloque de análisis.



// ── SIMULADOR UX — shell nativo del Hub ──
// Las 4 capas (Capa 1/2/3 y Mapa) son nativas: se renderizan dentro del Hub
// con CSS/JS aislados (factory por instancia). No hay iframes; la navegación
// cross-layer es por llamada directa entre instancias.
const SIM_CAPAS = [
  { id: 'capa-1-ux',          label: 'Capa 1: UX',          icon: 'ph-tree-structure' },
  { id: 'capa-2-diccionario', label: 'Capa 2: Diccionario', icon: 'ph-book-bookmark' },
  { id: 'capa-3-sql',         label: 'Capa 3: BD (SQL)',    icon: 'ph-database' },
  { id: 'mapa',               label: 'Mapa',                icon: 'ph-flow-arrow' }
];
const SIM_CAPA_BY_TAB = { '1': 'capa-1-ux', '2': 'capa-2-diccionario', '3': 'capa-3-sql', '4': 'mapa' };

function mountSimuladorShell(hostId) {
  const host = document.getElementById(hostId);
  if (!host || host.dataset.simMounted === '1') return;
  host.dataset.simMounted = '1';
  const tabs = SIM_CAPAS.map((c, i) =>
    `<button type="button" class="sim-subtab${i === 0 ? ' active' : ''}" data-capa="${c.id}">` +
    `<i class="ph ${c.icon}"></i> ${c.label}</button>`
  ).join('');
  const panels = SIM_CAPAS.map((c, i) =>
    `<div class="sim-panel${i === 0 ? ' active' : ''}" data-capa="${c.id}"><div class="sim-native-mount"></div></div>`
  ).join('');
  host.innerHTML =
    `<div class="simulador-shell">` +
    `<div class="sim-subtabs" role="tablist">${tabs}</div>` +
    `<div class="sim-panels">${panels}</div></div>`;
  host.querySelectorAll('.sim-subtab').forEach(btn => {
    btn.addEventListener('click', () => simShowCapa(host, btn.dataset.capa));
  });
  simShowCapa(host, SIM_CAPAS[0].id);
}

function simShowCapa(host, capaId) {
  host.querySelectorAll('.sim-subtab').forEach(b => b.classList.toggle('active', b.dataset.capa === capaId));
  host.querySelectorAll('.sim-panel').forEach(p => {
    const on = p.dataset.capa === capaId;
    p.classList.toggle('active', on);
    if (!on) return;
    const mount = p.querySelector('.sim-native-mount');
    if (!mount) return;
    // Capa nativa: instancia perezosa (una por superficie)
    if (!p.__capaInst) {
      const onNavigate = (tab, itemId) => simNavigate(host, tab, itemId);
      if (capaId === 'capa-1-ux') p.__capaInst = createCapa1(mount, { onNavigate });
      else if (capaId === 'capa-2-diccionario') p.__capaInst = createCapa2(mount, { onNavigate });
      else if (capaId === 'capa-3-sql') p.__capaInst = createCapa3(mount, { onNavigate });
      else if (capaId === 'mapa') p.__capaInst = createMapa(mount, { onNavigate });
    } else if (typeof p.__capaInst.refresh === 'function') {
      p.__capaInst.refresh();
    }
  });
}

// Navegación cross-layer dentro de una superficie: conmuta la subpestaña y
// entrega el 'select' a la capa destino por llamada directa a su instancia.
function simNavigate(host, tab, itemId) {
  const capaId = SIM_CAPA_BY_TAB[String(tab)] || String(tab);
  simShowCapa(host, capaId);
  setTimeout(() => {
    const panel = host.querySelector('.sim-panel[data-capa="' + capaId + '"]');
    if (panel && panel.__capaInst) panel.__capaInst.focusItem(itemId);
  }, 140);
}


// ── Capa 1 nativa — datos del flujo (idénticos a la versión legacy) ──
const CAPA1_NODES = {
  lead_entry_channel: {
    title: 'Entrada del lead', key: 'LEAD_ENTRY_CHANNEL', x: 120, y: 420, width: 390,
    description: 'El flujo comienza cuando se recibe un nuevo lead por uno de los canales habilitados.',
    dataPoints: ['Canal disponible: Formulario de contacto web', 'Canal disponible: WhatsApp', 'Estado: pendiente de selección de canal', 'Sin persistencia hasta la selección'],
    actions: [
      { id: 'route-entry-web', label: 'Formulario de contacto web', targetId: 'web_contact_form_received', dbAction: 'Sin persistencia todavía: se representa la recepción del lead desde el formulario de contacto web.' },
      { id: 'route-entry-whatsapp', label: 'WhatsApp', targetId: 'lead_capture_whatsapp', dbAction: 'Sin persistencia todavía: se fija solo la bifurcación visual por canal WhatsApp.' }
    ]
  },
  web_contact_form_received: {
    title: 'Contacto web recibido', key: 'WEB_CONTACT_FORM_RECEIVED', x: 900, y: 110, width: 340,
    description: 'Se registra un contacto entrante desde la web con los datos básicos del lead.',
    dataPoints: ['Canal origen: WEB_FORM', 'Origen: formulario de contacto web', 'Datos básicos recibidos', 'Ingreso al flujo inicial', 'Aviso de Privacidad LFPDPPP visible antes de enviar para captación inicial y orientación comercial'],
    note: 'Aquí se registra la entrada del contacto antes del siguiente paso operativo.',
    crossLinks: [{ label: 'Ver contrato web_contact_form en Capa 2', tab: 2, itemId: 'form-web_contact_form' }],
    actions: [{ id: 'register-lead-web', label: 'Registrar lead capturado', targetId: 'lead_captured', dbAction: "INSERT armc_leads(canal_origen='WEB_FORM', ...) RETURNING id; INSERT armc_events(lead_id=[id], event_type='LEAD_CAPTURED');" }]
  },
  lead_capture_whatsapp: {
    title: 'Contacto por WhatsApp recibido', key: 'LEAD_CAPTURE_WHATSAPP', x: 900, y: 860, width: 340,
    description: 'Se registra un contacto entrante por WhatsApp con el contexto inicial disponible.',
    dataPoints: ['Canal origen: WHATSAPP', 'Origen: conversación de WhatsApp', 'Contexto inicial recibido', 'Ingreso al flujo inicial', 'Aviso de Privacidad LFPDPPP enviado por el bot antes de capturar datos para captación inicial y orientación comercial'],
    note: 'Aquí se registra la entrada del contacto antes del siguiente paso operativo.',
    crossLinks: [{ label: 'Ver contrato lead_capture en Capa 2', tab: 2, itemId: 'form-lead_capture' }],
    actions: [{ id: 'register-lead-whatsapp', label: 'Registrar lead capturado', targetId: 'lead_captured', dbAction: "INSERT armc_leads(canal_origen='WHATSAPP', ...) RETURNING id; INSERT armc_events(lead_id=[id], event_type='LEAD_CAPTURED');" }]
  },
  lead_captured: {
    title: 'Lead capturado', key: 'LEAD_CAPTURED', x: 1700, y: 480, width: 360,
    description: 'Convergencia: el lead queda registrado en el sistema con un id único, independientemente del canal de entrada.',
    dataPoints: ['id único asignado por el sistema', 'estado: LEAD_CAPTURED', 'canal_origen preservado', 'fecha_primer_contacto registrada', 'evento LEAD_CAPTURED emitido'],
    terminalCopy: 'Lead capturado en el sistema.',
    crossLinks: [
      { label: 'Ver evento LEAD_CAPTURED en Capa 2', tab: 2, itemId: 'event-LEAD_CAPTURED' },
      { label: 'Ver tabla armc_leads en Capa 3', tab: 3, itemId: 'table-armc_leads' }
    ],
    actions: []
  },
  // Handoff humano — patrón transversal (no nueva linealidad del flujo base).
  // Activable desde cualquiera de los 4 nodos del flujo lineal (lead_entry_channel,
  // web_contact_form_received, lead_capture_whatsapp, lead_captured).
  human_handoff_requested: {
    title: 'Handoff humano solicitado', key: 'HUMAN_HANDOFF_REQUESTED', x: 2080, y: 110, width: 360,
    description: 'La conversación entra en estado "esperando humano". El bot queda silenciado para esta conversación; un humano del Hub puede tomarla.',
    dataPoints: [
      'Trigger: explícito (lead solicita) o automático (señal del bot)',
      'Canal origen heredado: WEB_FORM o WHATSAPP',
      'Receptor por defecto: Carlos',
      'Bot silenciado para esta conversación'
    ],
    note: 'Patrón transversal activable desde cualquier nodo del flujo base.',
    crossLinks: [
      { label: 'Ver evento HUMAN_HANDOFF_REQUESTED en Capa 2', tab: 2, itemId: 'event-HUMAN_HANDOFF_REQUESTED' },
      { label: 'Ver tabla armc_handoffs en Capa 3', tab: 3, itemId: 'table-armc_handoffs' }
    ],
    actions: []
  },
  human_handoff_active: {
    title: 'Handoff humano activo', key: 'HUMAN_HANDOFF_ACTIVE', x: 2080, y: 480, width: 360,
    description: 'Un humano del Hub ha tomado el handoff. La conversación está siendo atendida por una persona; el bot sigue silenciado.',
    dataPoints: [
      'Humano asignado: FK portal_users en armc_leads.handoff_assigned_to',
      'UI del Hub muestra nombre visible del humano',
      'Sistema autoasigna al humano que abre el lead; botón "Reasignar" actualiza la asignación',
      'Cada asignación / reasignación queda como fila ASSIGNED en armc_handoffs',
      'Bot continúa silenciado'
    ],
    note: 'Mientras el handoff está activo, la responsabilidad funcional es del humano asignado.',
    crossLinks: [
      { label: 'Ver evento HUMAN_HANDOFF_ASSIGNED en Capa 2', tab: 2, itemId: 'event-HUMAN_HANDOFF_ASSIGNED' },
      { label: 'Ver tabla armc_handoffs en Capa 3', tab: 3, itemId: 'table-armc_handoffs' }
    ],
    actions: []
  },
  human_handoff_closed: {
    title: 'Handoff humano cerrado', key: 'HUMAN_HANDOFF_CLOSED', x: 2080, y: 860, width: 360,
    description: 'El handoff cierra, sea manualmente desde apex-armc o automáticamente por inactividad.',
    dataPoints: [
      'Cierre manual: el humano lo cierra desde apex-armc',
      'Cierre automático: tras 24 horas sin actividad',
      'close_reason en armc_leads: "manual" o "inactivity"',
      'Identidad de quien cierra (closed_by) NO se duplica en armc_leads; se persiste en armc_handoffs (fila CLOSED con user_id) y en el payload del evento HUMAN_HANDOFF_CLOSED (closed_by_user_id opcional)'
    ],
    note: 'Reintroducción del bot tras el cierre queda fuera del alcance de este paquete.',
    crossLinks: [
      { label: 'Ver evento HUMAN_HANDOFF_CLOSED en Capa 2', tab: 2, itemId: 'event-HUMAN_HANDOFF_CLOSED' },
      { label: 'Ver tabla armc_handoffs en Capa 3', tab: 3, itemId: 'table-armc_handoffs' }
    ],
    actions: []
  }
};

let capa1Uid = 0;
// Factory: monta una instancia aislada de la Capa 1 en mountEl. Reutilizable
// en #tab-simulador y #ud-simulador sin colisión de IDs ni de estado.
function createCapa1(mountEl, opts) {
  opts = opts || {};
  const uid = 'c1u' + (++capa1Uid);
  mountEl.classList.add('sim-capa1');
  mountEl.innerHTML =
    '<div class="capa1-header"><div class="header-copy">' +
      '<h1><i class="ph ph-tree-structure"></i> Simulador UX ARMC &middot; Capa 1</h1>' +
      '<p>Mapa de estados y decisiones. La especificaci&oacute;n de formularios y campos vive en el diccionario operativo de la Capa 2.</p>' +
    '</div><button class="ghost-button capa1-reset" type="button"><i class="ph ph-arrow-counter-clockwise"></i> Reiniciar</button></div>' +
    '<div class="capa1-main"><div class="capa1-canvas-wrapper"><div class="capa1-canvas">' +
      '<svg class="capa1-svg"><defs>' +
        '<marker id="arrow-' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(161,184,242,0.45)"></path></marker>' +
        '<marker id="arrowA-' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#31BEEF"></path></marker>' +
        '<marker id="arrowE-' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#e56b6f"></path></marker>' +
      '</defs></svg><div class="capa1-nodes"></div></div></div>' +
    '<aside class="capa1-console"><div class="console-header"><span>Terminal del sistema</span>' +
      '<button type="button" class="capa1-clear">[Limpiar]</button></div><div class="capa1-logs"></div></aside></div>' +
    '<div class="capa1-zoom"><button type="button" class="capa1-zoom-out" title="Reducir">&minus;</button>' +
      '<span class="zoom-level capa1-zoom-level" title="Restablecer zoom" style="cursor:pointer">100%</span>' +
      '<button type="button" class="capa1-zoom-in" title="Ampliar">+</button>' +
      '<button type="button" class="capa1-fs" title="Pantalla completa"><i class="ph ph-corners-out"></i></button></div>';

  const nodesData = JSON.parse(JSON.stringify(CAPA1_NODES));
  const container = mountEl.querySelector('.capa1-nodes');
  const svgPath = mountEl.querySelector('.capa1-svg');
  const logsBox = mountEl.querySelector('.capa1-logs');
  const canvasEl = mountEl.querySelector('.capa1-canvas');
  const wrapper = mountEl.querySelector('.capa1-canvas-wrapper');
  const zoomLabel = mountEl.querySelector('.capa1-zoom-level');
  let zoomLevel = 1;
  let activePathKeys = [];
  const ZOOM_MIN = 0.3, ZOOM_MAX = 2;

  function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function log(message, type, dbAction) {
    const div = document.createElement('div');
    const tone = type === 'success' ? 'log-success' : type === 'error' ? 'log-error' : type === 'warning' ? 'log-warning' : 'log-info';
    let html = '<span class="' + tone + '">' + escapeHtml(message) + '</span>';
    if (dbAction) html += '<span class="log-db">' + escapeHtml(dbAction) + '</span>';
    div.className = 'log-entry';
    div.innerHTML = html;
    logsBox.appendChild(div);
    logsBox.scrollTop = logsBox.scrollHeight;
  }
  function clearLogs() { logsBox.innerHTML = ''; }
  function getIconForNode(key) {
    if (key.includes('LEAD')) return 'ph ph-user-plus';
    if (key.includes('AUTO')) return 'ph ph-robot';
    if (key.includes('HUMAN')) return 'ph ph-headset';
    if (key.includes('SUPER')) return 'ph ph-clipboard-text';
    if (key.includes('USUARIO')) return 'ph ph-check-circle';
    return 'ph ph-hourglass-medium';
  }
  function applyZoom() {
    canvasEl.style.transform = 'scale(' + zoomLevel + ')';
    zoomLabel.textContent = Math.round(zoomLevel * 100) + '%';
  }
  function zoomBy(delta) { zoomLevel = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomLevel + delta)); applyZoom(); }
  function zoomReset() { zoomLevel = 1; applyZoom(); }
  function toggleFullscreen() {
    const el = mountEl.closest('.simulador-shell') || mountEl;
    const doc = document;
    if (!doc.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen || (() => {})).call(el); }
    else { (doc.exitFullscreen || doc.webkitExitFullscreen || (() => {})).call(doc); }
  }
  function attachDrag(nodeEl, data) {
    const header = nodeEl.querySelector('.node-header');
    header.addEventListener('mousedown', (event) => {
      event.preventDefault();
      header.style.cursor = 'grabbing';
      let startX = event.clientX, startY = event.clientY;
      const onMove = (mv) => {
        const scale = zoomLevel > 0 ? zoomLevel : 1;
        data.x += (mv.clientX - startX) / scale;
        data.y += (mv.clientY - startY) / scale;
        nodeEl.style.left = data.x + 'px';
        nodeEl.style.top = data.y + 'px';
        startX = mv.clientX; startY = mv.clientY;
        drawLines();
      };
      const onUp = () => {
        header.style.cursor = 'grab';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }
  function renderDataBlock(body, data) {
    if (!data.dataPoints || !data.dataPoints.length) return;
    const block = document.createElement('div');
    block.className = 'node-data';
    const title = document.createElement('strong');
    title.textContent = 'Campos o contexto visible';
    block.appendChild(title);
    const list = document.createElement('ul');
    data.dataPoints.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
    block.appendChild(list);
    body.appendChild(block);
    if (data.note) {
      const note = document.createElement('div');
      note.className = 'node-note';
      note.textContent = data.note;
      body.appendChild(note);
    }
  }
  function createActionButton(nodeId, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-btn';
    button.dataset.btn = action.id;
    button.innerHTML = '<span>' + escapeHtml(action.label) + '</span><i class="ph ph-arrow-right"></i>';
    button.addEventListener('click', () => handleAction(nodeId, action.id, action.targetId, action.dbAction || ''));
    return button;
  }
  function renderCrossLinks(body, data) {
    if (!data.crossLinks || !data.crossLinks.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'cross-links';
    data.crossLinks.forEach((cl) => {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'cross-link';
      a.innerHTML = '<i class="ph ph-arrow-square-out"></i><span>' + escapeHtml(cl.label) + '</span>';
      a.addEventListener('click', () => { if (typeof opts.onNavigate === 'function') opts.onNavigate(cl.tab, cl.itemId); });
      wrap.appendChild(a);
    });
    body.appendChild(wrap);
  }
  function renderActions(body, nodeId, data) {
    if (!data.actions.length) {
      const terminal = document.createElement('div');
      terminal.className = 'terminal-copy';
      terminal.textContent = data.terminalCopy || '(Punto final de este flujo)';
      body.appendChild(terminal);
      renderCrossLinks(body, data);
      return;
    }
    const list = document.createElement('div');
    list.className = 'options-list';
    data.actions.forEach((action) => list.appendChild(createActionButton(nodeId, action)));
    body.appendChild(list);
    renderCrossLinks(body, data);
  }
  function renderNodes() {
    container.innerHTML = '';
    Object.entries(nodesData).forEach(([nodeId, data]) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'node';
      nodeEl.dataset.node = nodeId;
      nodeEl.style.left = data.x + 'px';
      nodeEl.style.top = data.y + 'px';
      nodeEl.style.width = (data.width || 360) + 'px';
      const header = document.createElement('div');
      header.className = 'node-header';
      header.innerHTML = '<div class="node-title"><i class="' + getIconForNode(data.key) + '"></i><span>' + escapeHtml(data.title) + '</span></div><span class="node-id">#' + escapeHtml(nodeId) + '</span>';
      const body = document.createElement('div');
      body.className = 'node-body';
      body.innerHTML = '<div class="node-key-badge">key: ' + escapeHtml(data.key) + '</div><p class="node-description">' + escapeHtml(data.description) + '</p>';
      renderDataBlock(body, data);
      renderActions(body, nodeId, data);
      nodeEl.appendChild(header);
      nodeEl.appendChild(body);
      attachDrag(nodeEl, data);
      container.appendChild(nodeEl);
    });
  }
  function applyActivePathState() {
    activePathKeys.forEach((key) => {
      const pathEl = svgPath.querySelector('[data-path="' + key + '"]');
      if (!pathEl) return;
      pathEl.classList.add('active');
      pathEl.setAttribute('marker-end', 'url(#arrowA-' + uid + ')');
    });
  }
  function drawLines() {
    if (mountEl.offsetParent === null) return;
    const defs = svgPath.querySelector('defs').outerHTML;
    const lines = [];
    Object.entries(nodesData).forEach(([, data]) => {
      data.actions.forEach((action) => {
        const button = container.querySelector('.option-btn[data-btn="' + action.id + '"]');
        const targetNode = container.querySelector('.node[data-node="' + action.targetId + '"]');
        if (!button || !targetNode) return;
        const buttonRect = button.getBoundingClientRect();
        const canvasRect = svgPath.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();
        const startX = (buttonRect.right - canvasRect.left) + 2;
        const startY = (buttonRect.top - canvasRect.top) + (buttonRect.height / 2);
        const endX = (targetRect.left - canvasRect.left) - 6;
        const endY = (targetRect.top - canvasRect.top) + 26;
        const curve = Math.max(100, Math.abs(endX - startX) / 3);
        const key = 'path-' + action.id + '-to-' + action.targetId;
        const d = 'M ' + startX + ' ' + startY + ' C ' + (startX + curve) + ' ' + startY + ', ' + (endX - curve) + ' ' + endY + ', ' + endX + ' ' + endY;
        lines.push('<path data-path="' + key + '" class="link" d="' + d + '" marker-end="url(#arrow-' + uid + ')"></path>');
      });
    });
    svgPath.innerHTML = defs + lines.join('');
    applyActivePathState();
  }
  function focusNode(nodeId) {
    container.querySelectorAll('.node').forEach((node) => {
      node.classList.remove('active');
      node.classList.add('disabled');
    });
    const currentNode = container.querySelector('.node[data-node="' + nodeId + '"]');
    if (currentNode) {
      currentNode.classList.remove('disabled');
      currentNode.classList.add('active');
      const scrollLeft = Math.max(currentNode.offsetLeft - 100, 0);
      const scrollTop = Math.max(currentNode.offsetTop - Math.round(wrapper.clientHeight * 0.25), 0);
      wrapper.scrollTo({ left: scrollLeft, top: scrollTop, behavior: 'smooth' });
    }
  }
  function handleAction(sourceNodeId, actionId, targetId, dbAction) {
    const key = 'path-' + actionId + '-to-' + targetId;
    const button = container.querySelector('.option-btn[data-btn="' + actionId + '"]');
    if (button) button.classList.add('selected');
    if (!container.querySelector('.node[data-node="' + targetId + '"]')) {
      const pathEl = svgPath.querySelector('[data-path="' + key + '"]');
      log('Ruta invalida: el nodo destino no existe en el mapa.', 'error');
      if (pathEl) {
        pathEl.classList.add('error');
        pathEl.setAttribute('marker-end', 'url(#arrowE-' + uid + ')');
      }
      return;
    }
    if (!activePathKeys.includes(key)) activePathKeys.push(key);
    applyActivePathState();
    log('Decision ejecutada desde ' + nodesData[sourceNodeId].key + ' hacia ' + nodesData[targetId].key + '.', 'info', dbAction);
    focusNode(targetId);
    log('Nodo activo: ' + nodesData[targetId].title, 'success');
  }
  function resetSimulation() {
    activePathKeys = [];
    clearLogs();
    renderNodes();
    drawLines();
    focusNode('lead_entry_channel');
    log('Sistema reiniciado. Capa 1 vuelve al modo simulador con arranque por canal web y WhatsApp.', 'warning');
  }
  function focusItem(itemId) {
    const m = String(itemId || '').match(/^node-(.+)$/);
    if (m && nodesData[m[1]]) focusNode(m[1]);
  }

  mountEl.querySelector('.capa1-reset').addEventListener('click', resetSimulation);
  mountEl.querySelector('.capa1-clear').addEventListener('click', clearLogs);
  mountEl.querySelector('.capa1-zoom-out').addEventListener('click', () => zoomBy(-0.1));
  mountEl.querySelector('.capa1-zoom-in').addEventListener('click', () => zoomBy(0.1));
  zoomLabel.addEventListener('click', zoomReset);
  mountEl.querySelector('.capa1-fs').addEventListener('click', toggleFullscreen);

  wrapper.addEventListener('wheel', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.1 : -0.1);
  }, { passive: false });

  // Pan libre por arrastre del fondo (el arrastre de nodos lo captura .node-header)
  wrapper.addEventListener('mousedown', (event) => {
    if (event.button !== 0 || event.target.closest('.node')) return;
    event.preventDefault();
    wrapper.classList.add('panning');
    const startX = event.clientX, startY = event.clientY;
    const startLeft = wrapper.scrollLeft, startTop = wrapper.scrollTop;
    const onMove = (mv) => {
      wrapper.scrollLeft = startLeft - (mv.clientX - startX);
      wrapper.scrollTop = startTop - (mv.clientY - startY);
    };
    const onUp = () => {
      wrapper.classList.remove('panning');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  renderNodes();
  setTimeout(() => { drawLines(); resetSimulation(); }, 40);

  // refresh: recalcula líneas al volver a mostrar la subpestaña (el panel
  // oculto tiene rects en cero y las curvas quedarían mal trazadas).
  const api = { focusItem, refresh: () => setTimeout(drawLines, 40) };
  mountEl.__capa1 = api;
  return api;
}

// Un único listener global de resize (registrado una sola vez) redibuja las
// instancias de Capa 1 vivas en el DOM. No se registra un listener por
// instancia: las fichas admin destruidas salen del DOM con container.innerHTML
// y no se recorren — sin acumulación de listeners ni closures muertos.
window.addEventListener('resize', () => {
  document.querySelectorAll('.sim-capa1').forEach(el => {
    if (el.__capa1 && typeof el.__capa1.refresh === 'function') el.__capa1.refresh();
  });
});


// ── Capa 2 nativa (B3) — Diccionario operativo ──
// Consume los JSON desde la ruta legacy (sin alias todavía, B3). Caché de
// módulo: las dos superficies (usuario/admin) comparten la descarga.
const CAPA2_BASE = '/core/simulador-ux/capa-2-diccionario/';
const CAPA2_FORM_FILES = ['web-contact-form', 'lead-capture'];
const CAPA2_EVENT_FILES = ['lead-captured'];
const _capa2Cache = {};
function capa2LoadJSON(path) {
  if (!_capa2Cache[path]) {
    _capa2Cache[path] = fetch(CAPA2_BASE + path).then(r => {
      if (!r.ok) throw new Error(path);
      return r.json();
    }).catch(err => {
      // No envenenar la caché: ante fallo transitorio se borra la entrada
      // para que un reintento dentro de la sesión vuelva a descargar.
      delete _capa2Cache[path];
      throw err;
    });
  }
  return _capa2Cache[path];
}

// Factory: instancia aislada de la Capa 2 en mountEl. CSS/JS scopeados;
// reutilizable en #tab-simulador y #ud-simulador sin colisión de estado.
function createCapa2(mountEl, opts) {
  opts = opts || {};
  mountEl.classList.add('sim-capa2');
  mountEl.innerHTML =
    '<aside class="capa2-sidebar"><div class="side-head">' +
      '<h2><i class="ph ph-book-bookmark"></i> Diccionario ARMC</h2>' +
      '<div class="search-box"><i class="ph ph-magnifying-glass"></i>' +
      '<input class="capa2-search" type="text" placeholder="Buscar&hellip;" autocomplete="off"></div>' +
    '</div><nav class="capa2-tree"></nav></aside>' +
    '<main class="capa2-detail"><div class="empty">Cargando&hellip;</div></main>';

  const state = { catalogo: null, forms: [], events: [], mappings: null, tree: [], activeId: null, collapsed: new Set(), search: '' };
  const treeEl = mountEl.querySelector('.capa2-tree');
  const detailEl = mountEl.querySelector('.capa2-detail');
  const searchEl = mountEl.querySelector('.capa2-search');

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function buildTree() {
    state.tree = [
      { id: 'cat-catalogo', label: 'Catálogo', icon: 'ph-list-bullets', items: [
        { id: 'catalogo-demandas', label: 'Demandas (20)', icon: 'ph-target', kind: 'demandas' },
        { id: 'catalogo-lineas', label: 'Líneas de servicio (5)', icon: 'ph-stack', kind: 'lineas' }
      ] },
      { id: 'cat-forms', label: 'Formularios', icon: 'ph-clipboard-text',
        items: state.forms.map(f => ({ id: 'form-' + f.id, label: f.id, icon: 'ph-clipboard-text', kind: 'form', payload: f })) },
      { id: 'cat-events', label: 'Eventos', icon: 'ph-lightning',
        items: state.events.map(e => ({ id: 'event-' + e.id, label: e.id, icon: 'ph-lightning', kind: 'event', payload: e })) },
      { id: 'cat-mappings', label: 'Mapeos', icon: 'ph-database', items: [
        { id: 'mappings-forms', label: 'Formularios → BD', icon: 'ph-arrow-right', kind: 'mappings-forms' },
        { id: 'mappings-events', label: 'Eventos → BD', icon: 'ph-arrow-right', kind: 'mappings-events' }
      ] }
    ];
  }
  function matchesSearch(label) {
    if (!state.search) return true;
    return label.toLowerCase().includes(state.search.toLowerCase());
  }
  function renderTree() {
    treeEl.innerHTML = state.tree.map(cat => {
      const items = cat.items.filter(it => matchesSearch(it.label));
      if (state.search && items.length === 0) return '';
      const collapsed = state.collapsed.has(cat.id) ? 'collapsed' : '';
      const itemsHtml = items.map(it => {
        const active = state.activeId === it.id ? 'active' : '';
        return `<div class="item ${active}" data-id="${it.id}"><i class="ph ${it.icon}"></i><span>${escapeHtml(it.label)}</span></div>`;
      }).join('');
      return `<div class="cat ${collapsed}" data-cat="${cat.id}">` +
        `<div class="cat-head"><i class="ph ph-caret-down chev"></i><i class="ph ${cat.icon}"></i><span>${cat.label}</span><span class="cat-count">${cat.items.length}</span></div>` +
        `<div class="cat-items">${itemsHtml}</div></div>`;
    }).join('');
    treeEl.querySelectorAll('.cat-head').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.parentElement.dataset.cat;
        if (state.collapsed.has(id)) state.collapsed.delete(id); else state.collapsed.add(id);
        renderTree();
      });
    });
    treeEl.querySelectorAll('.item').forEach(el => {
      el.addEventListener('click', () => {
        state.activeId = el.dataset.id;
        renderTree();
        renderDetail();
      });
    });
  }
  function findItem(id) {
    for (const c of state.tree) {
      for (const it of c.items) { if (it.id === id) return it; }
    }
    return null;
  }
  function header(kicker, title, chips) {
    chips = chips || [];
    return '<div class="detail-head"><div class="detail-kicker">' + escapeHtml(kicker) + '</div>' +
      '<h1 class="detail-title">' + escapeHtml(title) + '</h1>' +
      '<div class="chips">' + chips.map(c => `<span class="chip ${c.soft ? 'soft' : ''}">${escapeHtml(c.label)}</span>`).join('') + '</div></div>';
  }
  function navChip(label, tab, itemId, soft) {
    return `<button type="button" class="chip ${soft ? 'soft' : ''}" data-nav-tab="${tab}" data-nav-item="${escapeHtml(itemId)}">` +
      `<i class="ph ph-arrow-square-out" style="margin-right:4px;font-size:0.78rem"></i>${escapeHtml(label)}</button>`;
  }
  function renderDemandas(host) {
    const rows = state.catalogo.opciones;
    host.innerHTML = header('Catálogo', 'Demandas (20)', [{ label: 'fuente: catalogo-demandas.json', soft: true }]) +
      '<div class="panel-filter"><input class="capa2-demandas-filter" placeholder="Filtrar por frase o línea de servicio…" autocomplete="off">' +
      '<span class="count capa2-demandas-count">' + rows.length + ' / ' + rows.length + '</span></div>' +
      '<table class="data"><thead><tr><th>#</th><th>Frase</th><th>Líneas</th><th>Tratamientos</th></tr></thead><tbody class="capa2-demandas-body"></tbody></table>';
    const body = host.querySelector('.capa2-demandas-body');
    const count = host.querySelector('.capa2-demandas-count');
    const draw = (q) => {
      const filtered = rows.filter(r => {
        if (!q) return true;
        const t = q.toLowerCase();
        return r.frase.toLowerCase().includes(t) || r.lineas_servicio.some(l => l.toLowerCase().includes(t));
      });
      body.innerHTML = filtered.map(r =>
        '<tr><td><code>' + r.id + '</code></td><td>' + escapeHtml(r.frase) + '</td>' +
        '<td>' + r.lineas_servicio.map(l => `<span class="tag">${escapeHtml(l)}</span>`).join('') + '</td>' +
        '<td style="color:#b7c7dd;font-size:0.84rem">' + escapeHtml(r.tratamientos) + '</td></tr>'
      ).join('') || '<tr><td colspan="4" class="empty">Sin resultados</td></tr>';
      count.textContent = filtered.length + ' / ' + rows.length;
    };
    draw('');
    host.querySelector('.capa2-demandas-filter').addEventListener('input', e => draw(e.target.value));
  }
  function renderLineas(host) {
    const lineas = state.catalogo.lineas_servicio;
    host.innerHTML = header('Catálogo', 'Líneas de servicio (5)', [{ label: 'fuente: catalogo-demandas.json', soft: true }]) +
      '<table class="data"><thead><tr><th>Línea</th><th>Descripción</th></tr></thead><tbody>' +
      lineas.map(l => `<tr><td><code>${escapeHtml(l.nombre)}</code></td><td>${escapeHtml(l.descripcion)}</td></tr>`).join('') +
      '</tbody></table>';
  }
  function renderForm(host, f) {
    const chips = [{ label: 'canal: ' + f.canal }, { label: 'paso: ' + f.paso, soft: true }];
    if (f.dispara_evento) chips.push({ label: 'evento: ' + f.dispara_evento });
    if (f.salida) chips.push({ label: 'salida: ' + f.salida, soft: true });
    if (f.version) chips.push({ label: 'v' + f.version, soft: true });
    const persist = state.mappings.forms[f.id];
    const traceLinks = [navChip('← Capa 1: ' + f.paso, 1, 'node-' + f.paso, false)];
    if (persist) traceLinks.push(navChip('→ Capa 3: ' + persist.tabla_principal, 3, 'table-' + persist.tabla_principal, true));
    host.innerHTML = header('Formulario', f.nombre, chips) +
      '<section class="block"><h3>Trazabilidad</h3><div class="chips">' + traceLinks.join('') + '</div></section>';
    host.innerHTML += '<section class="block"><h3>Campos (input de captura)</h3>' +
      '<table class="data"><thead><tr><th>Nombre</th><th>Tipo</th><th>Obligatorio</th><th>Restricciones</th><th>Ejemplo</th></tr></thead><tbody>' +
      f.campos.map(c => {
        const restr = [];
        if (c.min !== undefined) restr.push('min: ' + c.min);
        if (c.max !== undefined) restr.push('max: ' + c.max);
        if (c.min_items !== undefined) restr.push('min items: ' + c.min_items);
        if (c.max_items !== undefined) restr.push('max items: ' + c.max_items);
        if (c.pattern) restr.push('pattern: <code>' + escapeHtml(c.pattern) + '</code>');
        if (c.nullable) restr.push('nullable');
        if (c.fuente) restr.push('fuente: <code>' + escapeHtml(c.fuente) + '</code>');
        return '<tr><td><code>' + escapeHtml(c.nombre) + '</code></td><td>' + escapeHtml(c.tipo) + '</td>' +
          '<td>' + (c.obligatorio ? '<span class="yes">sí</span>' : '<span class="no">no</span>') + '</td>' +
          '<td style="font-size:0.82rem;color:#b7c7dd">' + (restr.join(' · ') || '—') + '</td>' +
          '<td style="font-size:0.82rem;color:#b7c7dd">' + (c.ejemplo !== undefined ? '<code>' + escapeHtml(JSON.stringify(c.ejemplo)) + '</code>' : '—') + '</td></tr>';
      }).join('') + '</tbody></table></section>' +
      (f.genera && f.genera.length ? '<section class="block"><h3>Genera (atributos asignados por el sistema)</h3>' +
        '<table class="data"><thead><tr><th>Nombre</th><th>Tipo</th><th>Descripción</th></tr></thead><tbody>' +
        f.genera.map(g => `<tr><td><code>${escapeHtml(g.nombre)}</code></td><td>${escapeHtml(g.tipo)}</td><td style="color:#b7c7dd;font-size:0.86rem">${escapeHtml(g.descripcion || '')}</td></tr>`).join('') +
        '</tbody></table></section>' : '') +
      (f.derivados && f.derivados.length ? '<section class="block"><h3>Derivados</h3>' +
        '<table class="data"><thead><tr><th>Nombre</th><th>Origen</th></tr></thead><tbody>' +
        f.derivados.map(d => `<tr><td><code>${escapeHtml(d.nombre)}</code></td><td>${escapeHtml(d.origen)}</td></tr>`).join('') +
        '</tbody></table></section>' : '') +
      (f.reglas && f.reglas.length ? '<section class="block"><h3>Reglas</h3><ul class="simple">' +
        f.reglas.map(r => `<li>${escapeHtml(r)}</li>`).join('') + '</ul></section>' : '') +
      (persist ? '<section class="block"><h3>Persistencia</h3><table class="data"><tbody>' +
        '<tr><th style="width:200px">Tabla principal</th><td><code>' + escapeHtml(persist.tabla_principal) + '</code></td></tr>' +
        (persist.tabla_secundaria ? '<tr><th>Tabla secundaria</th><td><code>' + escapeHtml(persist.tabla_secundaria) + '</code></td></tr>' : '') +
        '<tr><th>Columnas</th><td>' + persist.columnas.map(c => `<code>${escapeHtml(c)}</code>`).join(' ') + '</td></tr>' +
        '<tr><th>Eventos asociados</th><td>' + persist.eventos.map(e => `<span class="tag">${escapeHtml(e)}</span>`).join('') + '</td></tr>' +
        '</tbody></table></section>' : '');
  }
  function renderEvent(host, e) {
    const origenStr = Array.isArray(e.origen) ? e.origen.join(', ') : e.origen;
    const chips = [{ label: 'paso: ' + e.paso, soft: true }, { label: 'origen: ' + origenStr }];
    const eventMap = state.mappings.events[e.id];
    const traceLinks = [navChip('← Capa 1: ' + e.paso, 1, 'node-' + e.paso, false)];
    const origenArr = Array.isArray(e.origen) ? e.origen : (e.origen ? [e.origen] : []);
    origenArr.forEach(o => traceLinks.push(navChip('↑ Form: ' + o, 2, 'form-' + o, false)));
    if (eventMap && eventMap.tablas) eventMap.tablas.forEach(t => traceLinks.push(navChip('→ Capa 3: ' + t, 3, 'table-' + t, true)));
    host.innerHTML = header('Evento', e.id, chips) +
      '<section class="block"><h3>Trazabilidad</h3><div class="chips">' + traceLinks.join('') + '</div></section>';
    host.innerHTML += '<section class="block"><h3>Destino</h3><div>' +
      e.destino.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') + '</div></section>' +
      '<section class="block"><h3>Payload mínimo</h3><ul class="simple">' +
      e.payload_minimo.map(p => `<li><code>${escapeHtml(p)}</code></li>`).join('') + '</ul></section>' +
      (e.payload_opcional && e.payload_opcional.length ? '<section class="block"><h3>Payload opcional</h3><ul class="simple">' +
        e.payload_opcional.map(p => `<li><code>${escapeHtml(p)}</code></li>`).join('') + '</ul></section>' : '');
  }
  function renderMappingsForms(host) {
    const entries = Object.entries(state.mappings.forms);
    host.innerHTML = header('Mapeos', 'Formularios → Base de datos', [{ label: 'fuente: mappings.json', soft: true }]) +
      '<table class="data"><thead><tr><th>Formulario</th><th>Tabla principal</th><th>Tabla secundaria</th><th>Eventos</th></tr></thead><tbody>' +
      entries.map(([id, def]) =>
        '<tr><td><code>' + escapeHtml(id) + '</code></td><td><code>' + escapeHtml(def.tabla_principal) + '</code></td>' +
        '<td>' + (def.tabla_secundaria ? '<code>' + escapeHtml(def.tabla_secundaria) + '</code>' : '<span class="no">—</span>') + '</td>' +
        '<td>' + def.eventos.map(e => `<span class="tag">${escapeHtml(e)}</span>`).join('') + '</td></tr>'
      ).join('') + '</tbody></table>';
  }
  function renderMappingsEvents(host) {
    const entries = Object.entries(state.mappings.events);
    host.innerHTML = header('Mapeos', 'Eventos → Base de datos', [{ label: 'fuente: mappings.json', soft: true }]) +
      '<table class="data"><thead><tr><th>Evento</th><th>Tablas</th></tr></thead><tbody>' +
      entries.map(([id, def]) =>
        '<tr><td><code>' + escapeHtml(id) + '</code></td><td>' +
        def.tablas.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') + '</td></tr>'
      ).join('') + '</tbody></table>';
  }
  function renderDetail() {
    const it = findItem(state.activeId);
    if (!it) { detailEl.innerHTML = '<div class="empty">Selecciona un item del menú lateral.</div>'; return; }
    if (it.kind === 'demandas') renderDemandas(detailEl);
    else if (it.kind === 'lineas') renderLineas(detailEl);
    else if (it.kind === 'form') renderForm(detailEl, it.payload);
    else if (it.kind === 'event') renderEvent(detailEl, it.payload);
    else if (it.kind === 'mappings-forms') renderMappingsForms(detailEl);
    else if (it.kind === 'mappings-events') renderMappingsEvents(detailEl);
    // Cablear los chips de navegación cross-layer (sin onclick inline)
    detailEl.querySelectorAll('[data-nav-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof opts.onNavigate === 'function') opts.onNavigate(Number(btn.dataset.navTab), btn.dataset.navItem);
      });
    });
  }
  function focusItem(itemId) {
    if (findItem(itemId)) {
      state.activeId = itemId;
      renderTree();
      renderDetail();
    }
  }

  searchEl.addEventListener('input', (e) => { state.search = e.target.value; renderTree(); });

  (async () => {
    try {
      const [catalogo, mappings] = await Promise.all([
        capa2LoadJSON('catalogo-demandas.json'),
        capa2LoadJSON('mappings.json')
      ]);
      const forms = await Promise.all(CAPA2_FORM_FILES.map(n => capa2LoadJSON('forms/' + n + '.json')));
      const events = await Promise.all(CAPA2_EVENT_FILES.map(n => capa2LoadJSON('events/' + n + '.json')));
      state.catalogo = catalogo; state.mappings = mappings; state.forms = forms; state.events = events;
      buildTree();
      state.activeId = 'catalogo-demandas';
      renderTree();
      renderDetail();
    } catch (err) {
      detailEl.innerHTML = '<div class="empty" style="color:#e56b6f">Error cargando datos: ' + escapeHtml(err.message) + '</div>';
    }
  })();

  return { focusItem: focusItem, refresh: function () {} };
}

// ── Capa 3 nativa (B4) — Esquema SQL / BD ──
// Consume schema.sql, data-dictionary.md y mappings.json desde la ruta
// legacy (sin alias todavía, B4). Caché de módulo con .catch que no
// envenena ante fallo transitorio (misma lección que B3).
const CAPA3_BASE = '/core/simulador-ux/';
const _capa3Cache = {};
function capa3Load(path, asJson) {
  if (!_capa3Cache[path]) {
    _capa3Cache[path] = fetch(CAPA3_BASE + path).then(r => {
      if (!r.ok) throw new Error(path);
      return asJson ? r.json() : r.text();
    }).catch(err => { delete _capa3Cache[path]; throw err; });
  }
  return _capa3Cache[path];
}

function createCapa3(mountEl, opts) {
  opts = opts || {};
  mountEl.classList.add('sim-capa3');
  mountEl.innerHTML =
    '<aside class="capa3-sidebar"><div class="side-head">' +
      '<h2><i class="ph ph-database"></i> Esquema SQL</h2>' +
      '<div class="search-box"><i class="ph ph-magnifying-glass"></i>' +
      '<input class="capa3-search" type="text" placeholder="Buscar tabla, columna&hellip;" autocomplete="off"></div>' +
    '</div><nav class="capa3-tree"></nav></aside>' +
    '<main class="capa3-detail"><div class="empty">Cargando&hellip;</div></main>';

  const state = { schemaSql: '', tables: [], indices: [], dictionary: {}, mappings: null, activeId: null, collapsed: new Set(), search: '' };
  const treeEl = mountEl.querySelector('.capa3-tree');
  const detailEl = mountEl.querySelector('.capa3-detail');
  const searchEl = mountEl.querySelector('.capa3-search');

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function parseDictionary(md) {
    const tables = {};
    let currentTable = null, inTable = false;
    const lines = md.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const tableMatch = line.match(/^##\s+`?([a-z_]+)`?\s*$/);
      if (tableMatch && !line.includes('Diccionario')) {
        currentTable = tableMatch[1];
        tables[currentTable] = { columns: [], notes: [] };
        inTable = false;
        continue;
      }
      if (line.match(/^##\s+Índices/) || line.match(/^##\s+Indices/)) {
        currentTable = '__indices__';
        tables[currentTable] = { columns: [], notes: [] };
        inTable = false;
        continue;
      }
      if (!currentTable) continue;
      if (line.startsWith('|') && lines[i + 1] && /^\|[\s:-]+\|/.test(lines[i + 1])) {
        i++;
        inTable = true;
        continue;
      }
      if (inTable && line.startsWith('|')) {
        tables[currentTable].columns.push(line.split('|').slice(1, -1).map(c => c.trim()));
        continue;
      }
      if (inTable && !line.startsWith('|')) inTable = false;
      if (line.startsWith('**')) tables[currentTable].notes.push(line.replace(/\*\*/g, ''));
    }
    return tables;
  }
  function parseSchema(sql) {
    const tables = [], indices = [];
    const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
    let m;
    while ((m = tableRegex.exec(sql)) !== null) tables.push({ name: m[1], ddl: m[0] });
    const indexRegex = /CREATE\s+INDEX\s+(\w+)\s+ON\s+(\w+)\s*\(([^)]+)\)/gi;
    while ((m = indexRegex.exec(sql)) !== null) indices.push({ name: m[1], table: m[2], column: m[3].trim() });
    return { tables, indices };
  }
  function buildTree() {
    return [
      { id: 'cat-tables', label: 'Tablas', icon: 'ph-table',
        items: state.tables.map(t => ({ id: 'table-' + t.name, label: t.name, icon: 'ph-table', kind: 'table', payload: t })) },
      { id: 'cat-indices', label: 'Índices', icon: 'ph-list-magnifying-glass',
        items: [{ id: 'all-indices', label: 'Todos los índices', icon: 'ph-list-magnifying-glass', kind: 'indices' }] },
      { id: 'cat-ref', label: 'Referencia', icon: 'ph-code',
        items: [{ id: 'full-ddl', label: 'DDL completo', icon: 'ph-code', kind: 'ddl-full' }] }
    ];
  }
  function matchesSearch(label) {
    if (!state.search) return true;
    return label.toLowerCase().includes(state.search.toLowerCase());
  }
  function renderTree() {
    const cats = buildTree();
    treeEl.innerHTML = cats.map(cat => {
      const items = cat.items.filter(it => matchesSearch(it.label));
      if (state.search && items.length === 0) return '';
      const collapsed = state.collapsed.has(cat.id) ? 'collapsed' : '';
      const itemsHtml = items.map(it => {
        const active = state.activeId === it.id ? 'active' : '';
        return `<div class="item ${active}" data-id="${it.id}"><i class="ph ${it.icon}"></i><span>${escapeHtml(it.label)}</span></div>`;
      }).join('');
      return `<div class="cat ${collapsed}" data-cat="${cat.id}">` +
        `<div class="cat-head"><i class="ph ph-caret-down chev"></i><i class="ph ${cat.icon}"></i><span>${cat.label}</span><span class="cat-count">${cat.items.length}</span></div>` +
        `<div class="cat-items">${itemsHtml}</div></div>`;
    }).join('');
    treeEl.querySelectorAll('.cat-head').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.parentElement.dataset.cat;
        if (state.collapsed.has(id)) state.collapsed.delete(id); else state.collapsed.add(id);
        renderTree();
      });
    });
    treeEl.querySelectorAll('.item').forEach(el => {
      el.addEventListener('click', () => {
        state.activeId = el.dataset.id;
        renderTree();
        renderDetail();
      });
    });
  }
  function findItem(id) {
    const cats = buildTree();
    for (const c of cats) for (const it of c.items) if (it.id === id) return it;
    return null;
  }
  function header(kicker, title, chips) {
    chips = chips || [];
    return '<div class="detail-head"><div class="detail-kicker">' + escapeHtml(kicker) + '</div>' +
      '<h1 class="detail-title">' + escapeHtml(title) + '</h1>' +
      '<div class="chips">' + chips.map(c => `<span class="chip ${c.soft ? 'soft' : ''}">${escapeHtml(c.label)}</span>`).join('') + '</div></div>';
  }
  function navChip(label, tab, itemId, soft) {
    return `<button type="button" class="chip ${soft ? 'soft' : ''}" data-nav-tab="${tab}" data-nav-item="${escapeHtml(itemId)}">` +
      `<i class="ph ph-arrow-square-out" style="margin-right:4px;font-size:0.78rem"></i>${escapeHtml(label)}</button>`;
  }
  function renderTable(host, t) {
    const dict = state.dictionary[t.name];
    const tableIndices = state.indices.filter(idx => idx.table === t.name);
    const colCount = dict ? dict.columns.length : 0;
    const colsHtml = dict && dict.columns.length ?
      '<table class="data"><thead><tr><th>Columna</th><th>Tipo</th><th>Nulo</th><th>Dominio / Default</th><th>Descripción</th></tr></thead><tbody>' +
      dict.columns.map(c =>
        '<tr><td>' + (c[0] || '').replace(/`([^`]+)`/g, '<code>$1</code>') + '</td>' +
        '<td>' + escapeHtml(c[1] || '') + '</td>' +
        '<td>' + (c[2] === 'NO' ? '<span class="yes">NO NULL</span>' : '<span class="no">nullable</span>') + '</td>' +
        '<td>' + (c[3] || '').replace(/`([^`]+)`/g, '<code>$1</code>') + '</td>' +
        '<td style="color:#b7c7dd;font-size:0.84rem">' + (c[4] || '').replace(/`([^`]+)`/g, '<code>$1</code>') + '</td></tr>'
      ).join('') + '</tbody></table>'
      : '<div class="empty">Sin columnas documentadas.</div>';
    const idxHtml = tableIndices.length ?
      '<table class="data"><thead><tr><th>Índice</th><th>Columna</th></tr></thead><tbody>' +
      tableIndices.map(i => `<tr><td><code>${escapeHtml(i.name)}</code></td><td><code>${escapeHtml(i.column)}</code></td></tr>`).join('') +
      '</tbody></table>'
      : '<div class="empty">Sin índices definidos para esta tabla.</div>';
    const notesHtml = dict && dict.notes.length ?
      '<ul class="simple">' + dict.notes.map(n => '<li>' + n.replace(/`([^`]+)`/g, '<code>$1</code>') + '</li>').join('') + '</ul>' : '';
    const usedByForms = [], usedByEvents = [];
    if (state.mappings) {
      Object.entries(state.mappings.forms || {}).forEach(([fid, def]) => {
        if (def.tabla_principal === t.name || def.tabla_secundaria === t.name) usedByForms.push(fid);
      });
      Object.entries(state.mappings.events || {}).forEach(([eid, def]) => {
        if ((def.tablas || []).includes(t.name)) usedByEvents.push(eid);
      });
    }
    const usedByHtml = (usedByForms.length || usedByEvents.length) ?
      '<section class="block"><h3>Usado por</h3><div class="chips">' +
      usedByForms.map(f => navChip('← Form: ' + f, 2, 'form-' + f, false)).join('') +
      usedByEvents.map(ev => navChip('← Evento: ' + ev, 2, 'event-' + ev, true)).join('') +
      '</div></section>' : '';
    host.innerHTML = header('Tabla', t.name, [{ label: colCount + ' columnas' }, { label: tableIndices.length + ' índices', soft: true }]) +
      usedByHtml +
      '<section class="block"><h3>Columnas</h3>' + colsHtml + '</section>' +
      (notesHtml ? '<section class="block"><h3>Notas</h3>' + notesHtml + '</section>' : '') +
      '<section class="block"><h3>Índices</h3>' + idxHtml + '</section>' +
      '<section class="block"><h3>DDL</h3><pre class="ddl">' + escapeHtml(t.ddl) + ';</pre></section>';
  }
  function renderIndices(host) {
    host.innerHTML = header('Índices', 'Todos los índices', [{ label: state.indices.length + ' índices', soft: true }]) +
      '<table class="data"><thead><tr><th>Índice</th><th>Tabla</th><th>Columna</th></tr></thead><tbody>' +
      state.indices.map(i => `<tr><td><code>${escapeHtml(i.name)}</code></td><td><code>${escapeHtml(i.table)}</code></td><td><code>${escapeHtml(i.column)}</code></td></tr>`).join('') +
      '</tbody></table>';
  }
  function renderFullDDL(host) {
    host.innerHTML = header('Referencia', 'DDL completo', [{ label: 'fuente: schema.sql', soft: true }]) +
      '<pre class="ddl">' + escapeHtml(state.schemaSql) + '</pre>';
  }
  function renderDetail() {
    const it = findItem(state.activeId);
    if (!it) { detailEl.innerHTML = '<div class="empty">Selecciona un item del menú lateral.</div>'; return; }
    if (it.kind === 'table') renderTable(detailEl, it.payload);
    else if (it.kind === 'indices') renderIndices(detailEl);
    else if (it.kind === 'ddl-full') renderFullDDL(detailEl);
    detailEl.querySelectorAll('[data-nav-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (typeof opts.onNavigate === 'function') opts.onNavigate(Number(btn.dataset.navTab), btn.dataset.navItem);
      });
    });
  }
  function focusItem(itemId) {
    if (findItem(itemId)) {
      state.activeId = itemId;
      renderTree();
      renderDetail();
    }
  }

  searchEl.addEventListener('input', (e) => { state.search = e.target.value; renderTree(); });

  (async () => {
    try {
      const [sqlRes, mdRes, mappingsRes] = await Promise.all([
        capa3Load('capa-3-sql/schema.sql', false),
        capa3Load('capa-3-sql/data-dictionary.md', false),
        capa3Load('capa-2-diccionario/mappings.json', true).catch(() => null)
      ]);
      state.schemaSql = sqlRes;
      const parsed = parseSchema(sqlRes);
      state.tables = parsed.tables;
      state.indices = parsed.indices;
      state.dictionary = parseDictionary(mdRes);
      state.mappings = mappingsRes;
      state.activeId = 'table-armc_leads';
      renderTree();
      renderDetail();
    } catch (err) {
      detailEl.innerHTML = '<div class="empty" style="color:#e56b6f">Error cargando datos: ' + escapeHtml(err.message) + '</div>';
    }
  })();

  return { focusItem: focusItem, refresh: function () {} };
}

// ── Init ──
function init() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('login')) {
    clearSession();
    history.replaceState(null, '', window.location.pathname);
    return;
  }
  if (getToken()) showPanel();
}












// ── Mapa nativo (B5) — matriz de trazabilidad ──
// Datos inline (sin assets externos). Cierra la eliminación de iframes
// de nivel 2 del simulador.
const MAPA_ROWS = [
  { c1: 'lead_entry_channel', c1_label: 'Entrada del lead', c2_form: null, c2_event: null, c3: [], note: 'Dispatcher visual. Sin datos ni evento.' },
  { c1: 'web_contact_form_received', c1_label: 'Contacto web recibido', c2_form: 'web_contact_form', c2_event: null, c3: [], note: 'Input por canal web. La persistencia ocurre al converger en lead_captured.' },
  { c1: 'lead_capture_whatsapp', c1_label: 'Contacto por WhatsApp recibido', c2_form: 'lead_capture', c2_event: null, c3: [], note: 'Input por canal WhatsApp. La persistencia ocurre al converger en lead_captured.' },
  { c1: 'lead_captured', c1_label: 'Lead capturado (convergencia)', c2_form: null, c2_event: 'LEAD_CAPTURED', c3: ['armc_leads', 'armc_events'], note: 'Punto único de persistencia. Emite el evento y escribe en BD.' },
  { c1: 'human_handoff_requested', c1_label: 'Handoff humano solicitado', c2_form: null, c2_event: 'HUMAN_HANDOFF_REQUESTED', c3: ['armc_leads', 'armc_events', 'armc_handoffs'], note: 'Patrón transversal: activable desde cualquier nodo del flujo base. Bot silenciado para la conversación.' },
  { c1: 'human_handoff_active', c1_label: 'Handoff humano activo', c2_form: null, c2_event: 'HUMAN_HANDOFF_ASSIGNED', c3: ['armc_leads', 'armc_events', 'armc_handoffs'], note: 'Humano del Hub atiende la conversación. Cada (re)asignación añade fila ASSIGNED en armc_handoffs.' },
  { c1: 'human_handoff_closed', c1_label: 'Handoff humano cerrado', c2_form: null, c2_event: 'HUMAN_HANDOFF_CLOSED', c3: ['armc_leads', 'armc_events', 'armc_handoffs'], note: 'Cierre manual o por inactividad (24h). closed_by no se duplica en armc_leads.' }
];

function createMapa(mountEl, opts) {
  opts = opts || {};
  mountEl.classList.add('sim-mapa');
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function btn(label, tab, itemId, soft) {
    return `<button type="button" class="nav-btn ${soft ? 'soft' : ''}" data-nav-tab="${tab}" data-nav-item="${escapeHtml(itemId)}">` +
      `<i class="ph ph-arrow-square-out"></i>${escapeHtml(label)}</button>`;
  }
  const rowsHtml = MAPA_ROWS.map(r => {
    const c1 = btn(r.c1, 1, 'node-' + r.c1, false);
    const c2parts = [];
    if (r.c2_form) c2parts.push(btn(r.c2_form, 2, 'form-' + r.c2_form, false));
    if (r.c2_event) c2parts.push(btn(r.c2_event, 2, 'event-' + r.c2_event, true));
    const c2 = c2parts.length ? c2parts.join('') : '<span class="none">— sin contrato —</span>';
    const c3 = r.c3.length ? r.c3.map(t => btn(t, 3, 'table-' + t, true)).join('') : '<span class="none">— sin persistencia —</span>';
    return `<tr data-c1="${escapeHtml(r.c1)}"><td>${c1}<div style="color:var(--m-muted);font-size:0.78rem;margin-top:4px">${escapeHtml(r.c1_label)}</div></td>` +
      `<td>${c2}</td><td>${c3}</td><td>${escapeHtml(r.note)}</td></tr>`;
  }).join('');
  mountEl.innerHTML =
    '<div class="mapa-page">' +
    '<h1><i class="ph ph-flow-arrow"></i> Mapa de trazabilidad</h1>' +
    '<p class="lede">Una fila por estado verificado del flujo. Los formularios web y WhatsApp son input: recogen los datos del lead. La persistencia (evento + escritura en BD) ocurre una sola vez, en el nodo de convergencia <code>lead_captured</code>. Click en cualquier botón para saltar al item en su capa.</p>' +
    '<div class="legend">' +
      '<span class="item"><span class="dot c1"></span> Capa 1 — Estados de UX</span>' +
      '<span class="item"><span class="dot c2"></span> Capa 2 — Formularios y eventos</span>' +
      '<span class="item"><span class="dot c3"></span> Capa 3 — Tablas SQL</span>' +
    '</div>' +
    '<h2 class="section">Flujo verificado</h2>' +
    '<table class="matrix"><thead><tr>' +
      '<th class="col-c1">Capa 1 (estado)</th><th class="col-c2">Capa 2 (formulario &middot; evento)</th>' +
      '<th class="col-c3">Capa 3 (persistencia)</th><th class="col-note">Nota</th>' +
    '</tr></thead><tbody class="mapa-rows">' + rowsHtml + '</tbody></table>' +
    '<h2 class="section">Cómo leer este mapa</h2>' +
    '<div class="note">Esta matriz muestra los cuatro estados verificados de Capa 1. Los dos formularios (<code>web_contact_form</code> y <code>lead_capture</code>) son input por canal: recogen datos del lead pero no persisten todavía. La emisión del evento <code>LEAD_CAPTURED</code> y la escritura en <code>armc_leads</code> + <code>armc_events</code> ocurren una sola vez por lead, en el nodo de convergencia <code>lead_captured</code>. Los estados visualizados sin contrato (como <code>lead_entry_channel</code>) son construcciones puramente visuales. A medida que se verifiquen nuevas piezas del flujo, se añadirán filas a esta matriz.</div>' +
    '</div>';

  mountEl.querySelectorAll('[data-nav-tab]').forEach(b => {
    b.addEventListener('click', () => {
      if (typeof opts.onNavigate === 'function') opts.onNavigate(Number(b.dataset.navTab), b.dataset.navItem);
    });
  });

  // El Mapa es una matriz completa, no tiene selección de item; si otra capa
  // navega hacia él con un itemId de estado, se desplaza a esa fila.
  function focusItem(itemId) {
    const m = String(itemId || '').match(/^node-(.+)$/);
    if (!m) return;
    const row = mountEl.querySelector('tr[data-c1="' + m[1] + '"]');
    if (row && row.scrollIntoView) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return { focusItem: focusItem, refresh: function () {} };
}





// ── ANÁLISIS TAB ──
const ANALISIS_SECTIONS = [
  { id: 'roles', title: 'Análisis por roles', icon: 'ph ph-users-three', desc: '7 flujos operativos analizados por rol' },
  { id: 'diagnostico', title: 'Diagnóstico integrado', icon: 'ph ph-heartbeat', desc: 'Hallazgos, matriz D1-D4, fricciones, embudo y cadena causal' },
  { id: 'blueprint', title: 'Blueprint de Sistema', icon: 'ph ph-blueprint', desc: 'Modelo de datos, flujos to-be, automatizaciones, fases y KPIs' }
];

// ── Capa de registro de rutas (REGISTRO-RUTAS.md) ──
// Reemplaza las antiguas constantes ANALISIS_BASE_PATH / DIAGNOSTICO_PATH / BLUEPRINT_PATH.
// Fuente de verdad para los paths físicos de los entregables por cliente.
const ANALISIS_REGISTRY = {
  armc: {
    diagramas:   '/publicados/armc/diagramas/',
    diagnostico: '/publicados/armc/diagnostico/',
    blueprint:   '/publicados/armc/blueprint/'
  }
};
function getAnalysisPaths(cliente) {
  const entry = ANALISIS_REGISTRY[cliente];
  if (!entry) {
    console.warn(`getAnalysisPaths: cliente "${cliente}" no registrado`);
    return null;
  }
  return entry;
}

const ANALISIS_ROLES = [
  { id: 'atencion-paciente', file: 'flujo-atención-paciente.html', title: 'Atención al Paciente', icon: 'ph ph-user', desc: 'Captación, conversión, seguimiento y reportes' },
  { id: 'cirujano', file: 'flujo-cirujano.html', title: 'Cirujano', icon: 'ph ph-stethoscope', desc: 'Evaluación, procedimiento y seguimiento post' },
  { id: 'enfermero', file: 'flujo-enfermero.html', title: 'Enfermero', icon: 'ph ph-heartbeat', desc: 'Preparación, asistencia quirúrgica y cuidados' },
  { id: 'cosmiatra', file: 'flujo-cosmiatra.html', title: 'Cosmiatra', icon: 'ph ph-sparkle', desc: 'Consulta, tratamientos y seguimiento dermatológico' },
  { id: 'primer-ayudante', file: 'flujo-primer-ayudante.html', title: 'Primer Ayudante', icon: 'ph ph-hand', desc: 'Asistencia quirúrgica y preparación de materiales' },
  { id: 'tricologia', file: 'flujo-tricologia.html', title: 'Tricología y Microinjerto', icon: 'ph ph-eyedropper', desc: 'Diagnóstico capilar, microinjerto y comunicación' },
  { id: 'ceo', file: 'flujo-ceo.html', title: 'CEO/Dirección', icon: 'ph ph-chart-line-up', desc: 'Estrategia, visibilidad, KPIs y decisiones' }
];

const ANALISIS_DIAGNOSTICO = [
  { id: 'resumen-ejecutivo', file: 'resumen-ejecutivo.html', title: 'Resumen Ejecutivo', icon: 'ph ph-target', desc: 'Hallazgos principales, métricas clave y voces del equipo' },
  { id: 'matriz-dolor-proceso', file: 'matriz-dolor-proceso.html', title: 'Matriz Dolor × Proceso', icon: 'ph ph-grid-four', desc: 'D1-D4 cruzado con los 7 roles — severidad y evidencia' },
  { id: 'mapa-fricciones', file: 'mapa-fricciones.html', title: 'Mapa de Fricciones', icon: 'ph ph-fire', desc: 'Fricciones transversales y específicas por rol' },
  { id: 'embudo-operativo', file: 'embudo-operativo.html', title: 'Embudo Operativo', icon: 'ph ph-funnel', desc: 'De la captación a la retención con métricas reales' },
  { id: 'cadena-causal', file: 'cadena-causal.html', title: 'Cadena Causal', icon: 'ph ph-tree-structure', desc: 'Diagrama D1→D2→D3→D4→Retención con evidencia' }
];

const ANALISIS_BLUEPRINT = [
  { id: 'modelo-datos', file: 'modelo-datos.html', title: 'Modelo de Datos', icon: 'ph ph-database', desc: '7 entidades con campos, relaciones y mapeo D1-D4' },
  { id: 'flujos-to-be', file: 'flujos-to-be.html', title: 'Flujos To-Be', icon: 'ph ph-flow-arrow', desc: 'Cómo trabaja cada rol con APEX — antes vs después' },
  { id: 'automatizaciones', file: 'automatizaciones.html', title: 'Automatizaciones', icon: 'ph ph-lightning', desc: '12 automatizaciones que eliminan fricciones documentadas' },
  { id: 'fases-implementacion', file: 'fases-implementacion.html', title: 'Fases de Implementación', icon: 'ph ph-steps', desc: '4 fases D1→D2→D3→D4 con resultados medibles' },
  { id: 'kpis-objetivo', file: 'kpis-objetivo.html', title: 'KPIs y Objetivos', icon: 'ph ph-chart-line-up', desc: '13 métricas actuales vs objetivos a 6 y 12 meses' }
];

// ── Client: Análisis Tab (3 capas) ──
const _armcPaths = getAnalysisPaths('armc');
const ANALISIS_SECTION_MAP = {
  roles: { items: () => ANALISIS_ROLES, path: _armcPaths?.diagramas, title: 'Análisis por roles' },
  diagnostico: { items: () => ANALISIS_DIAGNOSTICO, path: _armcPaths?.diagnostico, title: 'Diagnóstico integrado' },
  blueprint: { items: () => ANALISIS_BLUEPRINT, path: _armcPaths?.blueprint, title: 'Blueprint de Sistema' }
};

// Factoría de controlador de análisis. Una sola implementación, dos instancias
// (usuario y admin-detail). Diferencia entre vistas reducida a 2 prefijos:
// camel  → IDs camelCase + nombres de handlers en onclick (SectionsGrid,
//          RolesGrid, Iframe, ViewerTitle, SectionTitle, OpenSection, OpenItem).
// kebab  → IDs kebab-case de contenedores (-sections, -roles, -viewer).
function crearControladorAnalisis({ camel, kebab }) {
  function load() {
    const grid = document.getElementById(`${camel}SectionsGrid`);
    if (!grid) return;
    grid.innerHTML = ANALISIS_SECTIONS.map(s => `
      <div class="analisis-section-card" onclick="${camel}OpenSection('${s.id}')">
        <div class="section-icon"><i class="${s.icon}"></i></div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>
    `).join('');
  }

  function openSection(sectionId) {
    const section = ANALISIS_SECTION_MAP[sectionId];
    if (!section) return;
    const grid = document.getElementById(`${camel}RolesGrid`);
    grid.innerHTML = section.items().map(r => `
      <div class="analisis-role-card" onclick="${camel}OpenItem('${r.id}', '${sectionId}')">
        <div class="role-icon"><i class="${r.icon}"></i></div>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
      </div>
    `).join('');
    document.getElementById(`${camel}SectionTitle`).textContent = section.title;
    document.getElementById(`${kebab}-sections`).style.display = 'none';
    document.getElementById(`${kebab}-roles`).style.cssText = '';
  }

  function showSections() {
    document.getElementById(`${kebab}-viewer`).style.display = 'none';
    document.getElementById(`${kebab}-roles`).style.display = 'none';
    document.getElementById(`${kebab}-sections`).style.cssText = '';
    document.getElementById(`${camel}Iframe`).src = 'about:blank';
  }

  function showRoles() {
    document.getElementById(`${kebab}-viewer`).style.display = 'none';
    document.getElementById(`${kebab}-roles`).style.cssText = '';
    document.getElementById(`${camel}Iframe`).src = 'about:blank';
  }

  function openItem(itemId, sectionId) {
    const section = ANALISIS_SECTION_MAP[sectionId];
    if (!section || !section.path) return;
    const item = section.items().find(r => r.id === itemId);
    if (!item) return;
    document.getElementById(`${camel}Iframe`).src = section.path + item.file + '?v=' + Date.now();
    document.getElementById(`${camel}ViewerTitle`).textContent = item.title;
    document.getElementById(`${kebab}-roles`).style.display = 'none';
    document.getElementById(`${kebab}-viewer`).style.cssText = '';
  }

  return { load, openSection, showSections, showRoles, openItem };
}

const _ctrlAnalisisUser = crearControladorAnalisis({ camel: 'analisis',   kebab: 'analisis' });
const _ctrlAnalisisUd   = crearControladorAnalisis({ camel: 'udAnalisis', kebab: 'ud-analisis' });

// Wrappers globales explícitos (function declarations → window.X automático).
// Preservan el contrato onclick estático del HTML (index.html y markup
// inyectado por hub-admin.js): los nombres deben seguir resolviendo en window.
function loadAnalisis()                             { return _ctrlAnalisisUser.load(); }
function analisisOpenSection(sectionId)             { return _ctrlAnalisisUser.openSection(sectionId); }
function analisisShowSections()                     { return _ctrlAnalisisUser.showSections(); }
function analisisShowRoles()                        { return _ctrlAnalisisUser.showRoles(); }
function analisisOpenItem(itemId, sectionId)        { return _ctrlAnalisisUser.openItem(itemId, sectionId); }

function loadUdAnalisis()                           { return _ctrlAnalisisUd.load(); }
function udAnalisisOpenSection(sectionId)           { return _ctrlAnalisisUd.openSection(sectionId); }
function udAnalisisShowSections()                   { return _ctrlAnalisisUd.showSections(); }
function udAnalisisShowRoles()                      { return _ctrlAnalisisUd.showRoles(); }
function udAnalisisOpenItem(itemId, sectionId)      { return _ctrlAnalisisUd.openItem(itemId, sectionId); }

// ── Init ──
init();
