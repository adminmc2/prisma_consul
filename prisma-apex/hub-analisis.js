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

