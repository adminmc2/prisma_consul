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

// ── User Detail (Tabbed) ──
let udStagedFiles = [];
let udCurrentUserId = null;

async function showUserDetail(userId) {
  selectedUserId = userId;
  udCurrentUserId = userId;
  document.getElementById('usuarios-list-view').style.display = 'none';
  document.getElementById('usuarios-detail-view').style.display = '';

  const user = allUsers.find(u => u.id === userId);
  if (!user) return;

  const container = document.getElementById('userDetailContainer');
  const initials = (user.nombre || user.email.split('@')[0]).split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 4);
  const phases = getPhasesForProfile(user.profile_type || 'clinica');
  const cp = user.current_phase || 1;

  const phaseSteps = user.role !== 'admin' ? phases.map(p => {
    const completed = p.id < cp;
    const current = p.id === cp;
    const cls = completed ? 'completed' : (current ? 'current' : '');
    return `<div class="phase-step ${cls}" onclick="updateUserPhase(${userId}, ${p.id})">
      <div class="phase-step-number">${completed ? '✓' : p.id}</div>
      <div class="phase-step-name">${escapeHtml(p.name)}</div>
    </div>`;
  }).join('') : '<div style="color:var(--text-muted);font-size:0.85rem;">El admin no tiene pipeline de fases</div>';

  const fields = [
    { label: 'Nombre', key: 'nombre' }, { label: 'Empresa', key: 'empresa' },
    { label: 'Sector', key: 'sector' }, { label: 'RFC / CIF / Tax ID', key: 'rfc' },
    { label: 'Dirección', key: 'direccion' }, { label: 'Ciudad', key: 'ciudad' },
    { label: 'C.P.', key: 'cp' }, { label: 'Teléfono', key: 'telefono' },
    { label: 'Contacto', key: 'contacto_principal' }, { label: 'Cargo', key: 'cargo' }
  ];

  const fieldsHtml = fields.map(f =>
    `<div class="user-detail-field">
      <div class="user-detail-field-label">${f.label}</div>
      <input class="user-detail-field-input" data-field="${f.key}" value="${escapeHtml(user[f.key] || '')}" placeholder="—">
    </div>`
  ).join('');

  const docTypeOptionsHtml = DOC_TYPE_OPTIONS.map(o =>
    `<option value="${o.value}">${o.label}</option>`
  ).join('');

  container.innerHTML = `
    <div class="user-detail-header">
      <div class="user-detail-avatar">${initials}</div>
      <div style="flex:1;">
        <div class="user-detail-name">${escapeHtml(user.nombre || user.email.split('@')[0])}</div>
        <div class="user-detail-email">${escapeHtml(user.email)} · <span class="role-badge ${user.role}">${user.role}</span></div>
      </div>
      ${user.role !== 'admin' ? `<button class="btn-upload" onclick="viewAsClient(${user.id}, '${escapeHtml(user.nombre || user.empresa || user.email)}')" style="font-size:0.75rem;padding:8px 18px;white-space:nowrap;">Ver como cliente</button>` : ''}
    </div>

    <div class="ud-tabs">
      <button class="ud-tab active" onclick="switchUdTab('ud-perfil')">Perfil y proceso</button>
      <button class="ud-tab" onclick="switchUdTab('ud-docs')">Documentos</button>
      <button class="ud-tab" onclick="switchUdTab('ud-apex')">Formulario APEX</button>
      <button class="ud-tab" onclick="switchUdTab('ud-analisis')">Análisis de flujos y procesos</button>
      <button class="ud-tab" onclick="switchUdTab('ud-simulador')">Simulador UX ARMC</button>
    </div>

    <!-- Perfil y proceso -->
    <div id="ud-perfil" class="ud-content active">
      <div class="user-detail-grid">
        <div>
          <div class="user-detail-section">
            <div class="user-detail-section-title">Información</div>
            ${fieldsHtml}
            <div style="margin-top:1rem;">
              <button class="btn-upload" onclick="saveUserDetail(${userId})" style="font-size:0.75rem;padding:8px 18px;">Guardar cambios</button>
            </div>
          </div>
        </div>
        <div>
          <div class="user-detail-section">
            <div class="user-detail-section-title">Fase del proceso</div>
            <div class="phase-selector">${phaseSteps}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.75rem;">Haz clic en una fase para establecer el estado actual</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Documentos -->
    <div id="ud-docs" class="ud-content">
      <div class="ud-dropzone" id="udDropzone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p class="ud-dropzone-text">Arrastra archivos aquí o haz clic para seleccionar</p>
        <p class="ud-dropzone-hint">Máximo 25 MB por archivo</p>
        <input type="file" id="udFileInput" multiple style="display:none;">
      </div>
      <div id="udStagingArea" style="display:none;">
        <div class="section-divider" style="margin-bottom:0.75rem;">
          <span class="section-divider-title">Archivos pendientes</span>
          <div class="section-divider-line"></div>
        </div>
        <div class="staging-list" id="udStagingList"></div>
        <div class="staging-actions">
          <button type="button" class="btn-upload" id="udBtnUpload">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Subir archivos</span>
          </button>
          <button type="button" class="btn-clear-staging" onclick="udClearStaging()">Cancelar</button>
        </div>
      </div>
      <div class="upload-status" id="udUploadStatus"></div>
      <div class="section-divider">
        <span class="section-divider-title">Archivos subidos</span>
        <div class="section-divider-line"></div>
      </div>
      <div class="files-list" id="udFilesList">
        <div class="files-loading"><span class="spinner light"></span></div>
      </div>
    </div>

    <!-- Formulario APEX -->
    <div id="ud-apex" class="ud-content">
      <div id="udApexContainer">
        <div class="files-loading"><span class="spinner light"></span></div>
      </div>
    </div>

    <!-- Análisis -->
    <div id="ud-analisis" class="ud-content analisis-layer-flex" style="display:none;min-height:400px;">
      <div id="ud-analisis-sections" class="analisis-container analisis-layer">
        <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1rem;">Selecciona una sección para explorar</p>
        <div class="analisis-sections-grid" id="udAnalisisSectionsGrid"></div>
      </div>
      <div id="ud-analisis-roles" class="analisis-container analisis-layer" style="display:none;">
        <div class="analisis-viewer-topbar" style="padding:0;border:none;margin-bottom:1rem;">
          <button class="analisis-back-btn" onclick="udAnalisisShowSections()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          <span class="analisis-viewer-title" id="udAnalisisSectionTitle"></span>
        </div>
        <div class="analisis-roles-grid" id="udAnalisisRolesGrid"></div>
      </div>
      <div id="ud-analisis-viewer" class="analisis-layer-flex" style="display:none;">
        <div class="analisis-viewer-topbar">
          <button class="analisis-back-btn" onclick="udAnalisisShowRoles()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver a roles
          </button>
          <span class="analisis-viewer-title" id="udAnalisisViewerTitle"></span>
        </div>
        <iframe id="udAnalisisIframe" class="analisis-iframe" style="min-height:600px;" sandbox="allow-scripts allow-same-origin"></iframe>
      </div>
    </div>

    <!-- Simulador UX ARMC — shell nativo (B1, sin iframe de nivel 1) -->
    <div id="ud-simulador" class="ud-content analisis-layer-flex" style="display:none;min-height:600px;background:var(--prisma-navy);"></div>
  `;

  // Wire up dropzone
  initUdDropzone();
  // Load files and APEX
  loadUdFiles(userId);
  loadUdApex(userId);
}

// ── Admin User Detail: Dropzone ──
function initUdDropzone() {
  const dropzone = document.getElementById('udDropzone');
  const fileInput = document.getElementById('udFileInput');
  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
  dropzone.addEventListener('drop', (e) => { e.preventDefault(); dropzone.classList.remove('drag-over'); udAddFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', (e) => { udAddFiles(e.target.files); e.target.value = ''; });

  document.getElementById('udBtnUpload').addEventListener('click', udUploadFiles);
}

function udAddFiles(fileList) {
  const status = document.getElementById('udUploadStatus');
  for (const file of fileList) {
    if (file.size > 25 * 1024 * 1024) { status.className = 'upload-status error'; status.textContent = `"${file.name}" supera los 25 MB`; continue; }
    const nameWithoutExt = file.name.replace(/\.[^.]+$/, '');
    udStagedFiles.push({ file, docType: 'general', displayName: nameWithoutExt });
  }
  udRenderStaging();
}

function udRenderStaging() {
  const area = document.getElementById('udStagingArea');
  const list = document.getElementById('udStagingList');
  if (!udStagedFiles.length) { area.style.display = 'none'; return; }
  area.style.display = 'block';
  list.innerHTML = udStagedFiles.map((item, idx) => {
    const ext = getFileExt(item.file.name);
    const iconClass = getIconClass(ext);
    const optionsHtml = DOC_TYPE_OPTIONS.map(o =>
      `<div class="custom-dropdown-option${o.value === item.docType ? ' selected' : ''}" data-value="${o.value}">${o.label}</div>`
    ).join('');
    const currentLabel = DOC_TYPE_OPTIONS.find(o => o.value === item.docType)?.label || 'General';
    return `
      <div class="staging-item">
        <div class="file-icon ${iconClass}">${ext || '?'}</div>
        <div class="staging-item-info">
          <div class="staging-item-name">${escapeHtml(item.file.name)}</div>
          <div class="staging-item-size">${formatSize(item.file.size)}</div>
          <input type="text" class="staging-item-title" placeholder="Título descriptivo" value="${escapeHtml(item.displayName || '')}" onchange="udStagedFiles[${idx}].displayName=this.value" required>
        </div>
        <div class="staging-item-type">
          <div class="custom-dropdown" data-ud-staging-idx="${idx}">
            <button type="button" class="custom-dropdown-toggle" onclick="toggleStagingDropdown(this)">
              <span>${currentLabel}</span>
              <svg class="custom-dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="custom-dropdown-menu">${optionsHtml}</div>
          </div>
        </div>
        <button class="staging-item-remove" onclick="udStagedFiles.splice(${idx},1);udRenderStaging();" title="Quitar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
  }).join('');

  // Wire dropdown clicks for ud staging
  list.querySelectorAll('.custom-dropdown-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const dropdown = opt.closest('.custom-dropdown');
      const idx = parseInt(dropdown.dataset.udStagingIdx);
      udStagedFiles[idx].docType = opt.dataset.value;
      dropdown.querySelector('.custom-dropdown-toggle span').textContent = opt.textContent;
      dropdown.querySelectorAll('.custom-dropdown-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      dropdown.querySelector('.custom-dropdown-menu').classList.remove('open');
      dropdown.querySelector('.custom-dropdown-toggle').classList.remove('open');
    });
  });
}

function udClearStaging() { udStagedFiles = []; udRenderStaging(); document.getElementById('udUploadStatus').textContent = ''; }

async function udUploadFiles() {
  if (!udStagedFiles.length) return;
  const missing = udStagedFiles.some(item => !item.displayName?.trim());
  if (missing) { document.getElementById('udUploadStatus').className = 'upload-status error'; document.getElementById('udUploadStatus').textContent = 'Todos los archivos necesitan un título descriptivo'; return; }
  const token = getToken();
  if (!token) return;
  const btn = document.getElementById('udBtnUpload');
  btn.disabled = true;
  const status = document.getElementById('udUploadStatus');
  const total = udStagedFiles.length;
  let uploaded = 0;
  for (let i = udStagedFiles.length - 1; i >= 0; i--) {
    const item = udStagedFiles[i];
    status.className = 'upload-status uploading';
    status.textContent = `Subiendo ${total - i} de ${total}: "${item.file.name}"...`;
    try {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('docType', item.docType);
      if (item.displayName) formData.append('displayName', item.displayName);
      formData.append('userId', udCurrentUserId);
      const res = await fetch(`${API_BASE}/portal-upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (res.ok) { uploaded++; udStagedFiles.splice(i, 1); }
      else { const data = await res.json(); status.className = 'upload-status error'; status.textContent = `Error: "${item.file.name}" - ${data.error || 'Error'}`; }
    } catch { status.className = 'upload-status error'; status.textContent = `Error de conexión al subir "${item.file.name}"`; }
  }
  btn.disabled = false;
  udRenderStaging();
  if (uploaded > 0) {
    status.className = 'upload-status success';
    status.textContent = `${uploaded} archivo${uploaded > 1 ? 's' : ''} subido${uploaded > 1 ? 's' : ''} correctamente`;
    loadUdFiles(udCurrentUserId);
  }
}

// ── Admin User Detail: Files List ──
async function loadUdFiles(userId) {
  const filesList = document.getElementById('udFilesList');
  if (!filesList) return;
  filesList.innerHTML = '<div class="files-loading"><span class="spinner light"></span></div>';
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/portal-files?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) return;
    const data = await res.json();
    const files = data.files || [];
    if (!files.length) {
      filesList.innerHTML = '<div class="files-empty" style="padding:1.5rem;"><div>Sin archivos</div></div>';
      return;
    }
    filesList.innerHTML = files.map(f => {
      const displayName = f.name || '';
      const code = f.driveName || '';
      const ext = getFileExt(code || displayName) || getMimeLabel(f.mimeType);
      const iconClass = getIconClass(ext);
      const docType = f.docType || 'general';
      return `<div class="file-card" data-file-id="${f.id}">
        <div class="file-icon ${iconClass}">${ext || '?'}</div>
        <div class="file-info">
          ${code ? `<div class="file-code">${escapeHtml(code)}</div>` : ''}
          <div class="file-name file-name-editable" title="Clic para renombrar" onclick="startRename('${f.id}', this)">${escapeHtml(displayName)}</div>
          <div class="file-meta">
            <span>${formatDate(f.createdTime)}</span><span class="file-meta-sep"></span><span>${formatSize(f.size)}</span>
            ${docType ? `<span class="file-meta-sep"></span><span class="file-type-badge">${DOC_TYPE_LABELS[docType] || docType}</span>` : ''}
          </div>
        </div>
        <div class="file-actions">
          ${f.link ? `<a href="${f.link}" target="_blank" rel="noopener" class="file-link" title="Abrir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg></a>` : ''}
          <button class="file-btn-delete" title="Eliminar" onclick="udDeleteFile('${f.id}', '${escapeHtml(displayName || code)}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      </div>`;
    }).join('');
  } catch { filesList.innerHTML = '<div class="files-empty" style="padding:1.5rem;"><div>Error al cargar archivos</div></div>'; }
}

async function udDeleteFile(fileId, fileName) {
  if (!confirm(`¿Eliminar "${fileName}"?`)) return;
  const token = getToken();
  if (!token) return;
  const status = document.getElementById('udUploadStatus');
  try {
    const res = await fetch(`${API_BASE}/portal-files?action=delete&fileId=${fileId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) { status.className = 'upload-status success'; status.textContent = `"${fileName}" eliminado`; loadUdFiles(udCurrentUserId); }
    else { status.className = 'upload-status error'; status.textContent = 'Error al eliminar'; }
  } catch { status.className = 'upload-status error'; status.textContent = 'Error de conexión'; }
}

// ── Admin User Detail: APEX ──
async function loadUdApex(userId) {
  const container = document.getElementById('udApexContainer');
  if (!container) return;
  container.innerHTML = '<div class="files-loading"><span class="spinner light"></span></div>';
  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/portal-apex-results?userId=${userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    if (!data.submission) {
      container.innerHTML = `<div class="apex-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
        <div>No hay resultados APEX vinculados a este usuario.</div>
      </div>`;
      return;
    }
    renderApexResults(data.submission, container);
  } catch { container.innerHTML = '<div class="apex-empty"><div>Error al cargar resultados APEX</div></div>'; }
}

async function updateUserPhase(userId, newPhase) {
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/portal-users/${userId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_phase: newPhase })
    });
    if (res.ok) {
      const user = allUsers.find(u => u.id === userId);
      if (user) user.current_phase = newPhase;
      showUserDetail(userId);
    }
  } catch {}
}

async function saveUserDetail(userId) {
  const token = getToken();
  if (!token) return;
  const inputs = document.querySelectorAll('#userDetailContainer .user-detail-field-input');
  const body = {};
  inputs.forEach(inp => { body[inp.dataset.field] = inp.value; });

  try {
    const res = await fetch(`${API_BASE}/portal-users/${userId}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const data = await res.json();
      const idx = allUsers.findIndex(u => u.id === userId);
      if (idx >= 0) Object.assign(allUsers[idx], data.user);
      showUserDetail(userId);
    }
  } catch {}
}
