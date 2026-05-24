// PRISMA Hub — helpers transversales (sub-slice 3.2.1 F1).
// Utilidades puras de formato/string. Cero dependencias.

function escapeHtml(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }
function formatDate(iso) { if (!iso) return ''; return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }); }
function formatDateShort(iso) { if (!iso) return ''; const d = new Date(iso); const now = new Date(); const diff = now - d; if (diff < 3600000) return `hace ${Math.floor(diff/60000)}m`; if (diff < 86400000) return `hace ${Math.floor(diff/3600000)}h`; return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); }
function formatSize(bytes) { if (!bytes || bytes === 0) return ''; const units = ['B','KB','MB','GB']; let i = 0, size = parseInt(bytes); while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; } return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`; }
function getFileExt(name) { if (!name) return ''; const parts = name.split('.'); return parts.length > 1 ? parts.pop().toLowerCase() : ''; }
function getMimeLabel(mimeType) {
  if (!mimeType) return '';
  if (mimeType.includes('google-apps.document')) return 'DOC';
  if (mimeType.includes('google-apps.spreadsheet')) return 'XLS';
  if (mimeType.includes('google-apps.presentation')) return 'PPT';
  if (mimeType.includes('google-apps.form')) return 'FORM';
  return '';
}
function getIconClass(ext) {
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc','docx','odt','rtf','DOC'].includes(ext)) return 'doc';
  if (['xls','xlsx','csv','ods','XLS'].includes(ext)) return 'xls';
  if (['jpg','jpeg','png','gif','svg','webp'].includes(ext)) return 'img';
  if (['PPT','FORM'].includes(ext)) return 'other';
  return 'other';
}
function guessDocType(mimeType, ext) {
  if (['pdf'].includes(ext)) return 'informe';
  if (['doc','docx'].includes(ext)) return 'general';
  if (['xls','xlsx','csv'].includes(ext)) return 'factura';
  if (['jpg','jpeg','png','gif','svg'].includes(ext)) return 'otro';
  return 'general';
}