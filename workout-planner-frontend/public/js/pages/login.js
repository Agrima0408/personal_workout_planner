// Maximize Motors — Dealership Authentication Portal
import { api } from "../api.js";
import { setToken } from "../auth.js";
import { h, errorBox, icon } from "../ui.js";

export function renderLogin(root) {
  const banner = h("div", { class: "login-banner-wrap" });
  const email = h("input", {
    type: "email",
    name: "email",
    id: "login-email",
    placeholder: "advisor@maximizemotors.com",
    autocomplete: "username",
    required: true,
  });
  const pass = h("input", {
    type: "password",
    name: "password",
    id: "login-pass",
    placeholder: "••••••••",
    autocomplete: "current-password",
    required: true,
  });
  const btn = h("button", { class: "btn btn-primary btn-block btn-lg", type: "submit" }, "Access Dealership Portal");

  const form = h("form", { novalidate: true, class: "login-form" },
    h("div", { class: "field" },
      h("label", { for: "login-email" }, "Staff Email Address"),
      email),
    h("div", { class: "field" },
      h("label", { for: "login-pass" }, "Password"),
      pass),
    btn);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    banner.replaceChildren();
    const emailVal = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || !pass.value) {
      banner.replaceChildren(errorBox("Please provide a valid staff email and password."));
      return;
    }
    btn.disabled = true;
    btn.textContent = "Authenticating...";
    try {
      const res = await api.login(emailVal, pass.value);
      pass.value = ""; // security: wipe password from DOM immediately
      setToken(res.token);
      location.hash = "#/dashboard";
    } catch (err) {
      pass.value = "";
      banner.replaceChildren(errorBox(err.status === 401 ? "Invalid dealership credentials. Please check email and password." : err.message));
      btn.disabled = false;
      btn.textContent = "Access Dealership Portal";
    }
  });

  root.replaceChildren(
    h("div", { class: "login-wrap" },
      h("div", { class: "login-card" },
        h("div", { class: "login-brand" },
          h("div", { class: "login-logo-badge" }, icon("logo", "login-logo-icon")),
          h("h1", { class: "brand-title" }, "MAXIMIZE MOTORS"),
          h("div", { class: "brand-tag" }, "DEALERSHIP CRM")),
        h("p", { class: "login-subtitle" }, "Enter your sales staff credentials to access the dealership management system"),
        banner,
        form,
        h("div", { class: "login-footer" },
          h("small", { class: "text-muted" }, "Authorized Dealership Personnel Only • Secure JWT Session")))));
}
