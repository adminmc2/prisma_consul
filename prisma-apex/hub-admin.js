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
// ════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════

async function loadDashboard() {
  const token = getToken();
  if (!token) return;

  try {
    const [usersRes, activityRes] = await Promise.all([
      fetch(`${API_BASE}/portal-users`, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(`${API_BASE}/portal-activity?limit=10`, { headers: { 'Authorization': `Bearer ${token}` } })
    ]);

    if (usersRes.ok) {
      const data = await usersRes.json();
      allUsers = data.users || [];
      const clients = allUsers.filter(u => u.role !== 'admin');

      document.getElementById('metricClients').textContent = clients.length;
      document.getElementById('metricFiles').textContent = allUsers.reduce((s, u) => s + (u.file_count || 0), 0);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      document.getElementById('metricActive').textContent = clients.filter(u => u.last_login && new Date(u.last_login) > weekAgo).length;

      renderPipeline(clients);
    }

    if (activityRes.ok) {
      const data = await activityRes.json();
      renderRecentActivity(data.activity || []);
    }
  } catch (err) {
    document.getElementById('pipelineList').innerHTML = '<div class="files-empty"><div>Error al cargar dashboard</div></div>';
  }
}

function renderPipeline(clients) {
  const list = document.getElementById('pipelineList');
  if (!clients.length) {
    list.innerHTML = '<div class="files-empty"><div>No hay clientes registrados</div></div>';
    return;
  }

  list.innerHTML = clients.map(u => {
    const phases = getPhasesForProfile(u.profile_type || 'clinica');
    const cp = u.current_phase || 1;
    const initials = (u.nombre || u.email.split('@')[0]).split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
    const currentPhaseName = phases.find(p => p.id === cp)?.name || '';

    const dots = phases.map((p, i) => {
      const completed = p.id < cp;
      const current = p.id === cp;
      const dotClass = completed ? 'completed' : (current ? 'current' : '');
      const connector = i < phases.length - 1
        ? `<div class="phase-connector${p.id < cp ? ' completed' : ''}"></div>` : '';
      return `<div class="pipeline-phase"><div class="phase-dot ${dotClass}" title="${escapeHtml(p.name)}"></div>${connector}</div>`;
    }).join('');

    return `
      <div class="pipeline-row" onclick="showUserDetailFromDashboard(${u.id})">
        <div class="user-card-avatar" style="width:44px;height:44px;font-size:0.7rem;margin:0;flex-shrink:0;">${initials}</div>
        <div class="pipeline-user-info">
          <div class="pipeline-user-name">${escapeHtml(u.nombre || u.email.split('@')[0])}</div>
          <div class="pipeline-user-company">${escapeHtml(u.empresa || '')}</div>
        </div>
        <div class="pipeline-phases">${dots}</div>
        <div class="pipeline-phase-label">${escapeHtml(currentPhaseName)}</div>
      </div>`;
  }).join('');
}

function renderRecentActivity(activity) {
  const list = document.getElementById('recentActivityList');
  const actionLabels = { login: 'Login', upload: 'Subida', delete: 'Eliminación', rename: 'Renombrar', user_created: 'Nuevo usuario', user_updated: 'Actualización' };

  if (!activity.length) {
    list.innerHTML = '<div class="files-empty" style="padding:1.5rem;"><div>Sin actividad registrada</div></div>';
    return;
  }

  list.innerHTML = activity.map(a => {
    let details = '';
    if (a.details) {
      if (a.action === 'upload') details = (a.details.files || []).join(', ');
      else if (a.action === 'delete') details = a.details.fileName || '';
      else if (a.action === 'rename') details = `${a.details.oldName} → ${a.details.newName}`;
      else if (a.action === 'user_created') details = a.details.email || '';
      else if (a.action === 'login') details = a.details.email || '';
      else if (a.action === 'user_updated') details = `ID ${a.details.targetUserId}`;
    }
    return `
      <div class="recent-activity-item">
        <div class="recent-activity-time">${formatDateShort(a.created_at)}</div>
        <span class="action-badge ${a.action}">${actionLabels[a.action] || a.action}</span>
        <div class="recent-activity-user">${escapeHtml(a.user_nombre || a.user_email || '—')}</div>
        <div class="recent-activity-desc">${escapeHtml(details)}</div>
      </div>`;
  }).join('');
}

function showUserDetailFromDashboard(userId) {
  switchTab('usuarios');
  setTimeout(() => showUserDetail(userId), 100);
}

// ════════════════════════════════════════
// USUARIOS (Admin)
// ════════════════════════════════════════

function showUsersList() {
  document.getElementById('usuarios-list-view').style.display = '';
  document.getElementById('usuarios-detail-view').style.display = 'none';
  selectedUserId = null;
}

async function loadUsers() {
  const token = getToken();
  if (!token) return;
  const grid = document.getElementById('usersGrid');
  grid.innerHTML = '<div class="files-loading"><span class="spinner light"></span></div>';
  try {
    const res = await fetch(`${API_BASE}/portal-users`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    allUsers = data.users || [];
    renderUsers(allUsers);
  } catch { grid.innerHTML = '<div class="files-empty"><div>Error al cargar usuarios</div></div>'; }
}

function renderUsers(users) {
  const grid = document.getElementById('usersGrid');
  grid.innerHTML = users.map(u => {
    const initials = (u.nombre || u.email.split('@')[0]).split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
    const lastLogin = u.last_login ? formatDate(u.last_login) : 'Nunca';
    const phases = getPhasesForProfile(u.profile_type || 'clinica');
    const cp = u.current_phase || 1;
    const currentPhaseName = phases.find(p => p.id === cp)?.name || '';

    const phaseDots = u.role !== 'admin' ? phases.map((p, i) => {
      const completed = p.id < cp;
      const current = p.id === cp;
      const dotClass = completed ? 'completed' : (current ? 'current' : '');
      const connector = i < phases.length - 1
        ? `<div class="user-card-phase-connector${p.id < cp ? ' completed' : ''}"></div>` : '';
      return `<div class="user-card-phase-dot ${dotClass}"></div>${connector}`;
    }).join('') : '';

    return `
      <div class="user-card-admin" onclick="showUserDetail(${u.id})">
        <div class="user-card-admin-header">
          <div class="user-card-avatar" style="width:44px;height:44px;font-size:0.7rem;margin:0;">${initials}</div>
          <div class="user-card-admin-info">
            <div class="user-card-admin-name">${escapeHtml(u.nombre || u.email.split('@')[0])}</div>
            <div class="user-card-admin-email">${escapeHtml(u.email)}</div>
          </div>
          <span class="role-badge ${u.role}">${u.role}</span>
        </div>
        <div class="user-card-admin-stats">
          <div class="user-card-admin-stat"><span>${u.file_count || 0}</span> archivos</div>
          <div class="user-card-admin-stat"><span>${formatSize(u.total_size || 0)}</span></div>
          <div class="user-card-admin-stat">Último: ${lastLogin}</div>
        </div>
        ${u.role !== 'admin' ? `
        <div class="user-card-phases">
          ${phaseDots}
          <div class="user-card-phase-name">${escapeHtml(currentPhaseName)}</div>
        </div>` : ''}
      </div>`;
  }).join('');
}

// ── CREATE USER ──
function showCreateUserModal() { document.getElementById('createUserModal').style.display = ''; }
function hideCreateUserModal() {
  document.getElementById('createUserModal').style.display = 'none';
  document.getElementById('createUserForm').reset();
  document.getElementById('createUserError').textContent = '';
}

async function createUser(e) {
  e.preventDefault();
  const token = getToken();
  if (!token) return;
  const form = document.getElementById('createUserForm');
  const errorEl = document.getElementById('createUserError');
  errorEl.textContent = '';
  const body = {
    email: form.newEmail.value.trim(), password: form.newPassword.value,
    nombre: form.newNombre.value.trim(), empresa: form.newEmpresa.value.trim(),
    rfc: form.newRfc.value.trim(), direccion: form.newDireccion.value.trim(),
    ciudad: form.newCiudad.value.trim(), cp: form.newCp.value.trim(),
    telefono: form.newTelefono.value.trim(), contacto_principal: form.newContacto.value.trim(),
    cargo: form.newCargo.value.trim(), sector: form.newSector.value.trim()
  };
  if (!body.email || !body.password) { errorEl.textContent = 'Email y contraseña son requeridos'; return; }
  try {
    const res = await fetch(`${API_BASE}/portal-users`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) { errorEl.textContent = data.error || 'Error al crear usuario'; return; }
    hideCreateUserModal();
    loadUsers();
  } catch { errorEl.textContent = 'Error de conexión'; }
}
