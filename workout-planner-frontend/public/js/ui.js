// Modern UI Components and DOM helper for Maximize Motors Dealership CRM

const SVG_TAGS = new Set(["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "use"]);

export function h(tag, attrs, ...children) {
  const isSvg = SVG_TAGS.has(tag);
  const el = isSvg
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);

  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "class") el.setAttribute("class", v);
    else if (k === "value" && !isSvg) el.value = v;
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }

  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

// Icon library with sharp, automotive and CRM SVG paths
const ICONS = {
  logo: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M12 2L2 7l10 5 10-5-10-5z" }),
    h("path", { d: "M2 17l10 5 10-5" }),
    h("path", { d: "M2 12l10 5 10-5" })),
  dashboard: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M12 14v-4" }),
    h("path", { d: "M3.34 19a10 10 0 1 1 17.32 0" })),
  car: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9L1.5 12.5C1.2 13.1 1 13.7 1 14.3V16c0 .6.4 1 1 1h2" }),
    h("circle", { cx: "7", cy: "17", r: "2" }),
    h("path", { d: "M9 17h6" }),
    h("circle", { cx: "17", cy: "17", r: "2" })),
  buyers: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
    h("circle", { cx: "9", cy: "7", r: "4" }),
    h("path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
    h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })),
  leads: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("circle", { cx: "12", cy: "12", r: "10" }),
    h("circle", { cx: "12", cy: "12", r: "6" }),
    h("circle", { cx: "12", cy: "12", r: "2" })),
  pipeline: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })),
  activities: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
    h("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
    h("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
    h("line", { x1: "3", y1: "10", x2: "21", y2: "10" })),
  campaigns: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6" }),
    h("path", { d: "M4 11V4h16l-3 4 3 4H4" }),
    h("line", { x1: "4", y1: "4", x2: "4", y2: "20" })),
  staff: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
    h("circle", { cx: "12", cy: "7", r: "4" })),
  plus: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
    h("line", { x1: "5", y1: "12", x2: "19", y2: "12" })),
  search: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("circle", { cx: "11", cy: "11", r: "8" }),
    h("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })),
  eye: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
    h("circle", { cx: "12", cy: "12", r: "3" })),
  trash: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("polyline", { points: "3 6 5 6 21 6" }),
    h("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })),
  logout: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
    h("polyline", { points: "16 17 21 12 16 7" }),
    h("line", { x1: "21", y1: "12", x2: "9", y2: "12" })),
  arrowRight: (cls) => h("svg", { class: `icon ${cls}`, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" },
    h("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
    h("polyline", { points: "12 5 19 12 12 19" })),
};

export function icon(name, cls = "") {
  if (ICONS[name]) return ICONS[name](cls);
  return h("span", { class: `icon-placeholder ${cls}` });
}

export const button = (label, onClick, cls = "") => {
  const isDanger = cls.includes("danger");
  const isPrimary = cls.includes("primary");
  return h("button", {
    class: `btn ${cls}`,
    type: "button",
    onClick,
  }, label);
};

export const errorBox = (msg) =>
  h("div", { class: "alert alert-danger", role: "alert" },
    h("div", { class: "alert-icon" }, "!"),
    h("div", { class: "alert-msg" }, msg));

export const infoBox = (msg) =>
  h("div", { class: "alert alert-info", role: "status" },
    h("div", { class: "alert-icon" }, "i"),
    h("div", { class: "alert-msg" }, msg));

export function toast(message, type = "info") {
  const container = document.getElementById("toasts");
  if (!container) return;
  const t = h("div", { class: `toast ${type}` },
    h("span", { class: "toast-dot" }),
    h("span", { class: "toast-text" }, message));
  container.append(t);
  setTimeout(() => {
    t.classList.add("toast-fadeout");
    setTimeout(() => t.remove(), 300);
  }, 3500);
}

// Skeleton loaders
export function skeletonTable(columnCount = 5, rowCount = 5) {
  const headers = Array.from({ length: columnCount }, () => h("th", {}, h("div", { class: "skeleton skeleton-text" })));
  const rows = Array.from({ length: rowCount }, () =>
    h("tr", {}, Array.from({ length: columnCount }, () =>
      h("td", {}, h("div", { class: "skeleton skeleton-line" })))));

  return h("div", { class: "card table-wrap", style: "padding: 0" },
    h("table", {},
      h("thead", {}, h("tr", {}, headers)),
      h("tbody", {}, rows)));
}

export function skeletonCards(count = 4) {
  return h("div", { class: "grid kpi-grid" },
    Array.from({ length: count }, () =>
      h("div", { class: "card stat-card skeleton-stat" },
        h("div", { class: "skeleton skeleton-title" }),
        h("div", { class: "skeleton skeleton-number" }),
        h("div", { class: "skeleton skeleton-subtitle" }))));
}

export function skeletonBlock(height = "200px") {
  return h("div", { class: "card", style: `min-height: ${height}; display: flex; align-items: center; justify-content: center;` },
    h("div", { class: "skeleton", style: `width: 100%; height: ${height}; border-radius: 8px;` }));
}

export const loading = (text = "Loading data...") =>
  h("div", { class: "loading-state" },
    h("span", { class: "spinner" }),
    h("span", { class: "loading-text" }, text));

export function emptyState({ iconName = "car", title = "No records found", description = "No data currently available in this view.", action = null }) {
  return h("div", { class: "empty-state card" },
    h("div", { class: "empty-icon-wrap" }, icon(iconName, "empty-icon")),
    h("h3", { class: "empty-title" }, title),
    h("p", { class: "empty-desc" }, description),
    action ? h("div", { class: "empty-action" }, action) : null);
}

export function modal(title, body, { small = false } = {}) {
  const close = () => {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    }, 200);
  };
  const onKey = (e) => e.key === "Escape" && close();
  const overlay = h("div", { class: "overlay", onClick: (e) => e.target === overlay && close() },
    h("div", { class: `modal ${small ? "small" : ""}`, role: "dialog", "aria-modal": "true" },
      h("div", { class: "modal-head" },
        h("div", { class: "modal-title-wrap" },
          h("span", { class: "modal-indicator" }),
          h("h2", {}, title)),
        h("button", { class: "x-btn", type: "button", onClick: close, "aria-label": "Close" }, "×")),
      h("div", { class: "modal-body" }, body)));
  document.addEventListener("keydown", onKey);
  document.body.append(overlay);
  return { close };
}

export function confirmDialog(message, onConfirm, { title = "Confirm Removal", confirmLabel = "Delete Record" } = {}) {
  const err = h("div");
  const yes = button(confirmLabel, async () => {
    yes.disabled = true;
    yes.textContent = "Removing...";
    try {
      await onConfirm();
      m.close();
    } catch (e) {
      err.replaceChildren(errorBox(e.message));
      yes.disabled = false;
      yes.textContent = confirmLabel;
    }
  }, "btn-danger");

  const m = modal(title, h("div", { class: "confirm-content" },
    err,
    h("p", { class: "confirm-text" }, message),
    h("div", { class: "form-actions" },
      button("Cancel", () => m.close(), "btn-secondary"),
      yes)), { small: true });
}

const BADGE_CLASSES = {
  // Good (Green)
  WON: "badge-good",
  COMPLETED: "badge-good",
  ACTIVE: "badge-good",
  TRUE: "badge-good",
  EXISTING: "badge-good",
  IN_STOCK: "badge-good",
  ADMIN: "badge-admin",

  // Warn (Amber)
  NEGOTIATION: "badge-warn",
  PENDING: "badge-warn",
  PLANNED: "badge-warn",
  ON_HOLD: "badge-warn",
  LOW_STOCK: "badge-warn",
  MANAGER: "badge-manager",

  // Bad (Red)
  LOST: "badge-bad",
  UNSUCCESSFUL: "badge-bad",
  CANCELLED: "badge-bad",
  FALSE: "badge-bad",
  OUT_OF_STOCK: "badge-bad",

  // Info (Slate / Blue)
  OPEN: "badge-info",
  NEW: "badge-info",
  SALES_EXECUTIVE: "badge-info",
  WEBSITE: "badge-info",
  SOCIAL_MEDIA: "badge-info",
  ADVERTISEMENT: "badge-info",
  REFERRAL: "badge-info",
  CALL: "badge-call",
  MEETING: "badge-meeting",
  FOLLOW_UP: "badge-followup",
};

export const badge = (v) => {
  if (v == null || v === "") return h("span", { class: "badge badge-empty" }, "—");
  const key = String(v).toUpperCase().replace(/[\s-]/g, "_");
  const cls = BADGE_CLASSES[key] || "badge-default";
  const label = String(v).replaceAll("_", " ");
  return h("span", { class: `badge ${cls}` },
    h("span", { class: "badge-dot" }),
    label);
};

export const fmtDate = (v) => {
  if (!v) return "—";
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v).replace("T", " ").slice(0, 16);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(v).replace("T", " ").slice(0, 16);
  }
};

export const fmtPrice = (v) => {
  if (v == null || v === "") return "—";
  const num = Number(v);
  if (isNaN(num)) return String(v);
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

export const fmtNum = (v) => (v == null || v === "" ? "—" : Number(v).toLocaleString("en-US"));

// Clean dealership responsive table
export function table(columns, rows, actions) {
  if (!rows || !rows.length) {
    return emptyState({
      iconName: "car",
      title: "No records found",
      description: "No matching entries available in the dealership database.",
    });
  }

  return h("div", { class: "card table-wrap", style: "padding: 0" },
    h("table", { class: "dealership-table" },
      h("thead", {},
        h("tr", {},
          columns.map((c) => h("th", {}, c.label)),
          actions ? h("th", { class: "th-actions" }, "Actions") : null)),
      h("tbody", {},
        rows.map((r) =>
          h("tr", {},
            columns.map((c) => h("td", {}, c.render(r) ?? "—")),
            actions ? h("td", { class: "td-actions" }, actions(r)) : null)))));
}

export function detailList(pairs) {
  return h("dl", { class: "dealership-detail" },
    pairs.map(([k, v]) => [
      h("dt", {}, k),
      h("dd", {}, v ?? "—"),
    ]));
}
