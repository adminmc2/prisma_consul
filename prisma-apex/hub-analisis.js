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
    dataPoints: ['Canal origen: WEB_FORM', 'Origen: formulario de contacto web', 'Datos básicos recibidos', 'Ingreso al flujo inicial'],
    note: 'Aquí se registra la entrada del contacto antes del siguiente paso operativo.',
    crossLinks: [{ label: 'Ver contrato web_contact_form en Capa 2', tab: 2, itemId: 'form-web_contact_form' }],
    actions: [{ id: 'register-lead-web', label: 'Registrar lead capturado', targetId: 'lead_captured', dbAction: "INSERT armc_leads(canal_origen='WEB_FORM', ...) RETURNING id; INSERT armc_events(lead_id=[id], event_type='LEAD_CAPTURED');" }]
  },
  lead_capture_whatsapp: {
    title: 'Contacto por WhatsApp recibido', key: 'LEAD_CAPTURE_WHATSAPP', x: 900, y: 860, width: 340,
    description: 'Se registra un contacto entrante por WhatsApp con el contexto inicial disponible.',
    dataPoints: ['Canal origen: WHATSAPP', 'Origen: conversación de WhatsApp', 'Contexto inicial recibido', 'Ingreso al flujo inicial'],
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

