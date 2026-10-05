// Main Application Shell & Hash Router for Maximize Motors Dealership CRM
import { isAuthenticated, clearAuth, currentUserEmail } from "./auth.js";
import { h, button, errorBox, icon } from "./ui.js";
import { modules, navItems } from "./modules.js";
import { renderLogin } from "./pages/login.js";
import { renderDashboard } from "./pages/dashboard.js";

const root = document.getElementById("app");

function layout(route) {
  // Mobile backdrop
  const backdrop = h("div", {
    class: "sidebar-backdrop",
    onClick: () => sidebar.classList.remove("open"),
  });

  const sidebar = h("aside", { class: "sidebar" },
    h("div", { class: "brand-header" },
      h("div", { class: "brand-emblem" }, icon("logo", "brand-logo-icon")),
      h("div", { class: "brand-titles" },
        h("div", { class: "brand-name" }, "MAXIMIZE MOTORS"),
        h("div", { class: "brand-sub" }, "DEALERSHIP CRM"))),

    h("div", { class: "nav-section-title" }, "OPERATIONS"),
    h("nav", { class: "sidebar-nav" },
      navItems.map(([key, label, iconKey]) =>
        h("a", {
          href: `#/${key}`,
          class: `nav-link ${key === route ? "active" : ""}`,
          onClick: () => sidebar.classList.remove("open"),
        },
        icon(iconKey || "car", "nav-icon"),
        h("span", { class: "nav-label" }, label)))),

    h("div", { class: "sidebar-footer" },
      h("div", { class: "dealership-badge" },
        h("span", { class: "dealership-dot" }),
        h("div", { class: "dealership-info" },
          h("div", { class: "dealership-loc" }, "Flagship Dealership"),
          h("div", { class: "dealership-live" }, "Showroom Live")))));

  const content = h("main", { class: "content" });
  const activeNavItem = navItems.find(([k]) => k === route);
  const title = activeNavItem ? activeNavItem[1] : "Dealership Overview";

  const email = currentUserEmail();
  const initials = email ? email.slice(0, 2).toUpperCase() : "AD";

  const header = h("header", { class: "header" },
    h("div", { class: "header-left" },
      h("button", {
        class: "menu-btn",
        type: "button",
        "aria-label": "Toggle navigation menu",
        onClick: () => sidebar.classList.toggle("open"),
      }, icon("dashboard", "menu-icon")),
      h("h1", { class: "header-title" }, title)),

    h("div", { class: "header-right" },
      h("div", { class: "user-profile-badge" },
        h("div", { class: "user-avatar" }, initials),
        h("div", { class: "user-meta" },
          h("span", { class: "user-name" }, email || "Sales Staff"),
          h("span", { class: "user-role" }, "Advisor"))),
      h("button", {
        class: "btn btn-logout",
        type: "button",
        onClick: () => {
          clearAuth();
          location.hash = "#/login";
        },
      },
      icon("logout", "btn-icon"),
      h("span", { class: "logout-text" }, "Sign Out"))));

  root.replaceChildren(
    h("div", { class: "layout" },
      backdrop,
      sidebar,
      h("div", { class: "main" }, header, content)));

  return content;
}

async function route() {
  const hash = location.hash.replace(/^#\//, "") || "dashboard";
  const name = hash.split("/")[0];

  if (name === "login") {
    if (isAuthenticated()) {
      location.hash = "#/dashboard";
      return;
    }
    renderLogin(root);
    return;
  }

  if (!isAuthenticated()) {
    location.hash = "#/login";
    return;
  }

  const content = layout(name);
  try {
    if (name === "dashboard") {
      await renderDashboard(content);
    } else if (modules[name]) {
      await modules[name](content);
    } else {
      location.hash = "#/dashboard";
    }
  } catch (e) {
    content.replaceChildren(errorBox(e.message || "An unexpected error occurred while rendering the page."));
  }
}

window.addEventListener("hashchange", route);
route();
