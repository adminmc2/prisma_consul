// PRISMA Hub — dominio admin + vistas del panel reutilizadas por el modo view-as.
// Acoplamiento real, no decisión estética (verificado en index.html:421, :2175, :2298, :2415, :2488).
// Sub-slice 3.2.4.a F1: state + view-as. Se irá alimentando en 3.2.4.b/c/d/e.

// ── Phase system config ──
const PHASE_DEFINITIONS = {
  clinica: [
    { id: 1, name: 'Formulario APEX' },
    { id: 2, name: 'Documentación' },
    { id: 3, name: 'Entrevistas' },
    { id: 4, name: 'Análisis de flujos y procesos' }
  ]
};

function getPhasesForProfile(profileType) {
  return PHASE_DEFINITIONS[profileType] || PHASE_DEFINITIONS.clinica;
}

// ── State admin ──
let viewingUserId = null;
let allUsers = [];
let selectedUserId = null;

// ── VIEW AS USER (Admin — from user detail) ──
function viewAsUser(userId, userName) {
  viewingUserId = userId;
  document.getElementById('viewingUserName').textContent = userName;
  document.getElementById('adminViewingBanner').style.display = '';
  switchTab('documentos');
}

function viewAsClient(userId, userName) {
  viewingUserId = userId;
  document.getElementById('viewingUserName').textContent = userName;
  document.getElementById('adminViewingBanner').style.display = '';
  // Hide admin tabs, show user tabs
  document.querySelectorAll('.panel-tab.admin-only').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.panel-tab.user-only').forEach(t => t.style.display = 'block');
  switchTab('apex');
}

function stopViewingAs() {
  viewingUserId = null;
  document.getElementById('adminViewingBanner').style.display = 'none';
  if (isAdmin()) {
    // Restore admin tabs, hide user tabs
    document.querySelectorAll('.panel-tab.user-only').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.panel-tab.admin-only').forEach(t => t.style.display = 'block');
    switchTab('dashboard');
  } else {
    loadFiles();
  }
}