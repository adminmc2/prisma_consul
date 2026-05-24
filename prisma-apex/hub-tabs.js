// PRISMA Hub — navegación entre pestañas (sub-slice 3.2.3 F1).
// switchTab para la barra principal del panel + switchUdTab para sub-pestañas
// del detalle de usuario en vista admin.

// ── TAB SWITCHING ──
function switchTab(tabName) {
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.panel-tab[data-tab="${tabName}"]`);
  if (activeTab) activeTab.classList.add('active');

  const flexTabs = ['documentos', 'apex', 'perfil', 'entrevistas', 'analisis', 'simulador'];
  ['dashboard', 'documentos', 'usuarios', 'apex', 'perfil', 'entrevistas', 'analisis', 'simulador'].forEach(tab => {
    const el = document.getElementById(`tab-${tab}`);
    if (el) el.style.display = tab === tabName ? (flexTabs.includes(tab) ? 'flex' : '') : 'none';
  });

  if (tabName === 'dashboard') loadDashboard();
  if (tabName === 'documentos') loadFiles();
  if (tabName === 'usuarios') { showUsersList(); loadUsers(); }
  if (tabName === 'apex') loadApexResults();
  if (tabName === 'perfil') loadProfile();
  if (tabName === 'entrevistas') loadEntrevistas();
  if (tabName === 'analisis') { analisisShowSections(); loadAnalisis(); }
  if (tabName === 'simulador') mountSimuladorShell('tab-simulador');
}

function switchUdTab(tabId) {
  document.querySelectorAll('.ud-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.ud-content').forEach(c => c.classList.remove('active'));
  const tab = [...document.querySelectorAll('.ud-tab')].find(t => t.textContent.includes(
    tabId === 'ud-perfil' ? 'Perfil' : tabId === 'ud-docs' ? 'Documentos' : tabId === 'ud-apex' ? 'APEX' : tabId === 'ud-simulador' ? 'Simulador' : 'Análisis'
  ));
  if (tab) tab.classList.add('active');
  const content = document.getElementById(tabId);
  if (content) {
    content.classList.add('active');
    if (tabId === 'ud-analisis') { content.style.display = 'flex'; udAnalisisShowSections(); loadUdAnalisis(); }
    if (tabId === 'ud-simulador') {
      content.style.display = 'flex';
      mountSimuladorShell('ud-simulador');
    }
  }
  // Hide analisis when switching away
  if (tabId !== 'ud-analisis') {
    const analisis = document.getElementById('ud-analisis');
    if (analisis) analisis.style.display = 'none';
  }
  if (tabId !== 'ud-simulador') {
    const sim = document.getElementById('ud-simulador');
    if (sim) sim.style.display = 'none';
  }
}
