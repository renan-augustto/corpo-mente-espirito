export const esc = (x) =>
  String(x ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const icons = {
  body: '<path d="M3 12h4l3-7 4 14 3-7h4"/><path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-3 3-2 7 1 10l7 6 7-6c3-3 4-7 1-10"/>',
  mind: '<path d="M12 18V6m0 0C9 1 4 4 5 8c-4 1-4 7 0 8-1 4 5 6 7 2m0-12c3-5 8-2 7 2 4 1 4 7 0 8 1 4-5 6-7 2M5 8l3 2m11-2-3 2M5 16l3-2m11 2-3-2"/>',
  spirit:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  home: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="18" width="7" height="3" rx="1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M7 3v4m10-4v4"/>',
  tasks: '<path d="m3 6 2 2 4-4m3 3h9M3 13l2 2 4-4m3 3h9M3 20l2 2 4-4m3 3h9"/>',
  book: '<path d="M4 3h6a2 2 0 0 1 2 2v16a4 4 0 0 0-4-3H4zm16 0h-6a2 2 0 0 0-2 2v16a4 4 0 0 1 4-3h4z"/>',
  chart: '<path d="M3 3v18h18M7 16l5-6 4 3 5-8"/>',
  settings:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3m-10 0 1 15h12l1-15M10 10v7m4-7v7"/>',
  left: '<path d="m15 5-7 7 7 7"/>',
  right: '<path d="m9 5 7 7-7 7"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8m-8 12h4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
};
export const ico = (n) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n] || icons.tasks}</svg>`;
export function btn(label, action, cls = '', icon = '') {
  return `<button type="button" class="${cls}" data-action="${action}">${icon ? ico(icon) : ''}${label}</button>`;
}
export function heading(title, desc, action = '') {
  return `<header class="heading"><div><div class="eyebrow">Corpo · Mente · Espírito</div><h1>${title}</h1><p>${desc}</p></div>${action}</header>`;
}
