// Reusable form builder with client-side validation.
// field: { name, label, type, required, options, min, max, minLength, help, full, default, loadOptions }
// types: text email password tel integer number date datetime textarea select checkbox list multiselect
import { h, button, errorBox } from "./ui.js";

const nowLocal = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

export function buildForm(fields, { initial = {}, submitLabel = "Save", onSubmit, onCancel }) {
  const inputs = {};
  const errs = {};
  const wraps = {};
  const banner = h("div");

  const grid = h("form", { class: "form-grid", novalidate: true });

  for (const f of fields) {
    let input;
    const val = initial[f.name] ?? (f.default === "now" ? nowLocal() : f.default);
    if (f.type === "textarea") input = h("textarea", { rows: 3 });
    else if (f.type === "select" || f.type === "multiselect") {
      input = h("select", { multiple: f.type === "multiselect" });
      if (f.type === "select") input.append(h("option", { value: "" }, "— select —"));
      (f.options || []).forEach((o) => input.append(h("option", { value: o }, String(o).replaceAll("_", " "))));
      if (f.loadOptions) {
        input.disabled = true;
        f.loadOptions().then((opts) => {
          opts.forEach((o) => input.append(h("option", { value: o.value }, o.label)));
          (initial[f.name] || []).forEach((id) => { for (const op of input.options) if (op.value == id) op.selected = true; });
          input.disabled = false;
        }).catch(() => { input.replaceChildren(h("option", { value: "" }, "Could not load options")); });
      }
    } else if (f.type === "checkbox") input = h("input", { type: "checkbox" });
    else {
      const t = { integer: "number", number: "number", datetime: "datetime-local", list: "text", tel: "text" }[f.type] || f.type;
      input = h("input", { type: t, autocomplete: f.type === "password" ? "new-password" : "off",
        step: f.type === "integer" ? "1" : f.type === "number" ? "any" : null, min: f.min, max: f.max });
    }
    input.name = f.name;

    if (f.type === "checkbox") input.checked = !!val;
    else if (f.type === "list") input.value = Array.isArray(val) ? val.join(", ") : val ?? "";
    else if (f.type === "datetime") input.value = val ? String(val).slice(0, 16) : "";
    else if (f.type === "multiselect") { /* set after options load */ }
    else if (f.type !== "password") input.value = val ?? "";

    inputs[f.name] = input;
    errs[f.name] = h("div", { class: "err" });
    wraps[f.name] = f.type === "checkbox"
      ? h("div", { class: `field check ${f.full ? "full" : ""}` }, input, h("label", {}, f.label))
      : h("div", { class: `field ${f.full || f.type === "textarea" ? "full" : ""}` },
          h("label", {}, f.label, f.required ? h("span", { class: "req" }, " *") : null),
          input, f.help ? h("div", { class: "help" }, f.help) : null, errs[f.name]);
    grid.append(wraps[f.name]);
  }

  function read(f) {
    const el = inputs[f.name];
    if (f.type === "checkbox") return el.checked;
    if (f.type === "multiselect") return [...el.selectedOptions].map((o) => Number(o.value));
    const raw = el.value.trim();
    if (f.type === "list") return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (raw === "") return null;
    if (f.type === "integer" || f.type === "number") return Number(raw);
    if (f.type === "tel") return raw;
    if (f.type === "datetime") return raw.length === 16 ? raw + ":00" : raw;
    return raw;
  }

  function validate() {
    let ok = true;
    const values = {};
    for (const f of fields) {
      const v = read(f);
      let msg = "";
      const empty = v == null || v === "" || (Array.isArray(v) && f.type !== "multiselect" && !v.length);
      if (f.required && empty && f.type !== "checkbox") msg = `${f.label} is required`;
      else if (!empty) {
        if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = "Enter a valid email address";
        else if (f.type === "tel" && !/^[+]?[\d\s\-()]{7,20}$/.test(inputs[f.name].value.trim())) msg = "Enter a valid phone number (7–20 digits)";
        else if (f.type === "integer" && !Number.isInteger(v)) msg = "Must be a whole number";
        else if ((f.type === "integer" || f.type === "number") && (Number.isNaN(v) || (f.min != null && v < f.min))) msg = `Must be ${f.min != null ? `≥ ${f.min}` : "a number"}`;
        else if (f.minLength && String(v).length < f.minLength) msg = `At least ${f.minLength} characters`;
        else if (f.validate) msg = f.validate(v, (n) => read(fields.find((x) => x.name === n))) || "";
      }
      errs[f.name].textContent = msg;
      wraps[f.name].classList.toggle("invalid", !!msg);
      if (msg) ok = false;
      values[f.name] = v;
    }
    return ok ? values : null;
  }

  const submit = button(submitLabel, null, "primary");
  submit.type = "submit";
  grid.append(h("div", { class: "form-actions" }, onCancel ? button("Cancel", onCancel) : null, submit));

  grid.addEventListener("submit", async (e) => {
    e.preventDefault();
    banner.replaceChildren();
    const values = validate();
    if (!values) return;
    submit.disabled = true;
    const label = submit.textContent;
    submit.textContent = "Saving...";
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = [err.message];
      if (err.fieldErrors) for (const [k, m] of Object.entries(err.fieldErrors)) {
        if (errs[k]) { errs[k].textContent = m; wraps[k].classList.add("invalid"); } else msg.push(`${k}: ${m}`);
      }
      banner.replaceChildren(errorBox(msg.join("\n")));
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });

  return h("div", {}, banner, grid);
}
