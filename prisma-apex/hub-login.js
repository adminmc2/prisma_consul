// PRISMA Hub — auth/sesión/arranque del panel (sub-slice 3.2.2 F1).
// API_BASE, helpers de sessionStorage, showScreen, listeners de login/logout, showPanel.

const API_BASE = '/api';

// ── Session helpers ──
function getToken() { return sessionStorage.getItem('portal_token'); }
function getEmail() { return sessionStorage.getItem('portal_email'); }
function getNombre() { return sessionStorage.getItem('portal_nombre'); }
function getRole() { return sessionStorage.getItem('portal_role'); }
function isAdmin() { return getRole() === 'admin'; }
function getEmpresa() { try { return JSON.parse(sessionStorage.getItem('portal_empresa')); } catch { return null; } }
function setSession(token, email, nombre, empresa, role) {
  sessionStorage.setItem('portal_token', token);
  sessionStorage.setItem('portal_email', email);
  if (nombre) sessionStorage.setItem('portal_nombre', nombre);
  if (empresa) sessionStorage.setItem('portal_empresa', JSON.stringify(empresa));
  if (role) sessionStorage.setItem('portal_role', role);
}
function clearSession() {
  ['portal_token','portal_email','portal_nombre','portal_empresa','portal_role'].forEach(k => sessionStorage.removeItem(k));
}

// ── Screen transitions ──
function showScreen(id) {
  document.querySelectorAll('.portal-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── LOGIN ──
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const btnLogin = document.getElementById('btnLogin');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) { loginError.textContent = 'Introduce email y contraseña'; return; }
  btnLogin.disabled = true;
  btnLogin.innerHTML = '<span class="spinner"></span>';
  try {
    const res = await fetch(`${API_BASE}/portal-auth`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { loginError.textContent = data.error || 'Error de autenticación'; resetLoginButton(); return; }
    setSession(data.token, data.email, data.nombre, data.empresa, data.role);
    showPanel();
  } catch { loginError.textContent = 'Error de conexión'; resetLoginButton(); }
});

function resetLoginButton() {
  btnLogin.disabled = false;
  btnLogin.innerHTML = '<span>Acceder</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
}

// ── PANEL ──
function showPanel() {
  const email = getEmail() || '';
  const nombre = getNombre() || email.split('@')[0];
  const empresa = getEmpresa();

  if (empresa && empresa.nombre) {
    document.getElementById('empresaNombre').textContent = empresa.nombre;
    document.getElementById('empresaSector').textContent = empresa.sector || '';
    const initials = empresa.nombre.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
    document.getElementById('userAvatar').textContent = initials || '??';
  } else {
    document.getElementById('empresaNombre').textContent = nombre;
    document.getElementById('empresaSector').textContent = email;
    const initials = nombre.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
    document.getElementById('userAvatar').textContent = initials || '??';
  }

  if (isAdmin()) {
    document.querySelectorAll('.panel-tab.admin-only').forEach(t => t.style.display = 'block');
    switchTab('dashboard');
  } else {
    document.querySelectorAll('.panel-tab.user-only').forEach(t => t.style.display = 'block');
    switchTab('apex');
  }

  showScreen('screen-panel');
}

// ── LOGOUT ──
document.getElementById('btnLogout').addEventListener('click', () => {
  clearSession();
  viewingUserId = null;
  document.getElementById('adminViewingBanner').style.display = 'none';
  document.querySelectorAll('.panel-tab.admin-only, .panel-tab.user-only').forEach(t => t.style.display = 'none');
  showScreen('screen-login');
  loginError.textContent = '';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
});