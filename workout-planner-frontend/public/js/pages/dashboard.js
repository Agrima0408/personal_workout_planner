// Maximize Motors — Dealership Command Center Dashboard
// Calculates metrics in real-time from backend data without fabricated stats.
import { api, normalizeList } from "../api.js";
import { h, icon, badge, fmtPrice, fmtDate, skeletonCards, emptyState, button } from "../ui.js";

function getStockBadge(stockCount) {
  const stock = Number(stockCount);
  if (stock <= 0) return badge("OUT_OF_STOCK");
  if (stock <= 2) {
    return h("span", { class: "badge badge-warn" },
      h("span", { class: "badge-dot" }),
      `${stock} left`);
  }
  return h("span", { class: "badge badge-good" },
    h("span", { class: "badge-dot" }),
    `${stock} in stock`);
}

export async function renderDashboard(container) {
  // Render initial loading state with skeleton cards
  const kpiSection = h("div", { class: "dashboard-kpis" }, skeletonCards(4));
  const pipelineSection = h("div", { class: "dashboard-pipeline-wrap" });
  const recentSection = h("div", { class: "dashboard-split-grid" });

  const pageHeader = h("div", { class: "page-head" },
    h("div", { class: "page-title-group" },
      h("h2", { class: "page-title" }, "Dealership Overview & KPIs"),
      h("p", { class: "page-subtitle" }, "Live operational telemetry across inventory, prospective buyers, and sales pipeline")),
    h("div", { class: "header-badges" },
      h("span", { class: "badge badge-good" }, h("span", { class: "badge-dot" }), "Showroom Online")));

  container.replaceChildren(pageHeader, kpiSection, pipelineSection, recentSection);

  try {
    // Concurrent fetch from Spring Boot endpoints
    const [buyersRes, leadsRes, oppsRes, productsRes, activitiesRes] = await Promise.allSettled([
      api.get("/customers"),
      api.get("/leads"),
      api.get("/opportunities"),
      api.get("/products"),
      api.get("/activities"),
    ]);

    const buyers = buyersRes.status === "fulfilled" ? normalizeList(buyersRes.value) : [];
    const leads = leadsRes.status === "fulfilled" ? normalizeList(leadsRes.value) : [];
    const opportunities = oppsRes.status === "fulfilled" ? normalizeList(oppsRes.value) : [];
    const products = productsRes.status === "fulfilled" ? normalizeList(productsRes.value) : [];
    const activities = activitiesRes.status === "fulfilled" ? normalizeList(activitiesRes.value) : [];

    // 1. KPI Calculations
    const totalBuyers = buyers.length;
    const activeLeads = leads.filter((l) => String(l.leadStatus).toUpperCase() === "ACTIVE").length;
    const openOpps = opportunities.filter((o) => ["OPEN", "NEGOTIATION"].includes(String(o.status).toUpperCase()));
    const openOppsCount = openOpps.length;
    const openPipelineValue = openOpps.reduce((sum, o) => sum + (Number(o.value) || 0), 0);
    const totalVehicles = products.length;
    const totalStock = products.reduce((sum, p) => sum + (Number(p.productStock) || 0), 0);

    // Render KPI Cards
    kpiSection.replaceChildren(
      h("div", { class: "grid kpi-grid" },
        // TOTAL BUYERS
        h("a", { class: "card stat-card", href: "#/customers" },
          h("div", { class: "stat-card-head" },
            h("span", { class: "stat-label" }, "Total Buyers"),
            h("div", { class: "stat-icon-wrap icon-buyers" }, icon("buyers", "stat-icon"))),
          h("div", { class: "stat-number" }, totalBuyers),
          h("div", { class: "stat-footer text-muted" }, `${buyers.filter((b) => b.customerType === "New").length} new buyers registered`)),

        // ACTIVE LEADS
        h("a", { class: "card stat-card", href: "#/leads" },
          h("div", { class: "stat-card-head" },
            h("span", { class: "stat-label" }, "Active Leads"),
            h("div", { class: "stat-icon-wrap icon-leads" }, icon("leads", "stat-icon"))),
          h("div", { class: "stat-number" }, activeLeads),
          h("div", { class: "stat-footer text-muted" }, `${leads.length} total potential buyers`)),

        // OPEN OPPORTUNITIES
        h("a", { class: "card stat-card", href: "#/opportunities" },
          h("div", { class: "stat-card-head" },
            h("span", { class: "stat-label" }, "Open Opportunities"),
            h("div", { class: "stat-icon-wrap icon-pipeline" }, icon("pipeline", "stat-icon"))),
          h("div", { class: "stat-number" }, openOppsCount),
          h("div", { class: "stat-footer text-accent" }, `${fmtPrice(openPipelineValue)} active pipeline`)),

        // VEHICLE INVENTORY
        h("a", { class: "card stat-card", href: "#/products" },
          h("div", { class: "stat-card-head" },
            h("span", { class: "stat-label" }, "Vehicle Inventory"),
            h("div", { class: "stat-icon-wrap icon-car" }, icon("car", "stat-icon"))),
          h("div", { class: "stat-number" }, totalVehicles),
          h("div", { class: "stat-footer text-muted" }, `${totalStock} units across models`))));

    // 2. Sales Pipeline Stages: OPEN → NEGOTIATION → WON → LOST
    const stages = [
      { key: "OPEN", label: "Open Deals", color: "blue", desc: "Initial inquiries" },
      { key: "NEGOTIATION", label: "Negotiation", color: "amber", desc: "Pricing & terms" },
      { key: "WON", label: "Deals Won", color: "green", desc: "Closed vehicle sales" },
      { key: "LOST", label: "Deals Lost", color: "red", desc: "Unconverted prospects" },
    ];

    const stageData = stages.map((st) => {
      const matching = opportunities.filter((o) => String(o.status).toUpperCase() === st.key);
      const val = matching.reduce((sum, o) => sum + (Number(o.value) || 0), 0);
      return { ...st, count: matching.length, totalVal: val };
    });

    const pipelineCard = h("div", { class: "card pipeline-card" },
      h("div", { class: "pipeline-header" },
        h("div", {},
          h("h3", { class: "card-title" }, "Sales Pipeline"),
          h("p", { class: "card-subtitle" }, "Deal progression from initial lead negotiation to finalized sale")),
        h("a", { class: "btn btn-sm btn-secondary", href: "#/opportunities" }, "View Full Pipeline")),

      h("div", { class: "pipeline-stages" },
        stageData.map((st, idx) =>
          h("div", { class: `pipeline-stage stage-${st.color}` },
            h("div", { class: "stage-top" },
              h("span", { class: "stage-label" }, st.label),
              idx < 3 ? h("span", { class: "stage-arrow" }, "→") : null),
            h("div", { class: "stage-count" }, st.count),
            h("div", { class: "stage-val" }, fmtPrice(st.totalVal)),
            h("div", { class: "stage-desc" }, st.desc)))));

    pipelineSection.replaceChildren(pipelineCard);

    // 3. Recent Leads Table or Empty State
    let recentLeadsContent;
    if (leads.length === 0) {
      recentLeadsContent = emptyState({
        iconName: "leads",
        title: "No Leads Recorded",
        description: "Register new prospective buyers to begin tracking.",
      });
    } else {
      recentLeadsContent = h("div", { class: "table-wrap", style: "padding: 0" },
        h("table", { class: "dealership-table table-condensed" },
          h("thead", {},
            h("tr", {},
              h("th", {}, "Prospect"),
              h("th", {}, "Contact"),
              h("th", {}, "Status"),
              h("th", {}, "Channel"))),
          h("tbody", {},
            leads.slice(0, 5).map((l) =>
              h("tr", {},
                h("td", {}, h("strong", {}, l.leadName)),
                h("td", {}, l.leadEmail || l.leadPhone || "—"),
                h("td", {}, badge(l.leadStatus)),
                h("td", {}, badge(l.leadSource)))))));
    }

    const recentLeadsCard = h("div", { class: "card dashboard-panel" },
      h("div", { class: "panel-header" },
        h("div", {},
          h("h3", { class: "card-title" }, "Recent Potential Buyers"),
          h("p", { class: "card-subtitle" }, "Latest automotive customer inquiries")),
        h("a", { class: "panel-link", href: "#/leads" }, "All Leads →")),
      recentLeadsContent);

    // 4. Upcoming Activities Table or Empty State
    let activitiesContent;
    if (activities.length === 0) {
      activitiesContent = emptyState({
        iconName: "activities",
        title: "No Activities Scheduled",
        description: "Schedule test drives or follow-ups with potential buyers.",
      });
    } else {
      activitiesContent = h("div", { class: "table-wrap", style: "padding: 0" },
        h("table", { class: "dealership-table table-condensed" },
          h("thead", {},
            h("tr", {},
              h("th", {}, "Type"),
              h("th", {}, "Details"),
              h("th", {}, "Scheduled"),
              h("th", {}, "Status"))),
          h("tbody", {},
            activities.slice(0, 5).map((a) =>
              h("tr", {},
                h("td", {}, badge(a.activityTitle)),
                h("td", {}, h("span", { class: "text-truncate" }, a.activityDescription || "—")),
                h("td", {}, a.activityScheduledAt || "—"),
                h("td", {}, badge(a.activityStatus)))))));
    }

    const upcomingActivitiesCard = h("div", { class: "card dashboard-panel" },
      h("div", { class: "panel-header" },
        h("div", {},
          h("h3", { class: "card-title" }, "Upcoming Activities & Test Drives"),
          h("p", { class: "card-subtitle" }, "Scheduled showroom appointments & calls")),
        h("a", { class: "panel-link", href: "#/activities" }, "All Activities →")),
      activitiesContent);

    // 5. Vehicle Inventory Snapshot or Empty State
    let inventoryContent;
    if (products.length === 0) {
      inventoryContent = emptyState({
        iconName: "car",
        title: "No Vehicles in Inventory",
        description: "Add vehicles to populate dealership showroom inventory.",
      });
    } else {
      inventoryContent = h("div", { class: "table-wrap", style: "padding: 0" },
        h("table", { class: "dealership-table" },
          h("thead", {},
            h("tr", {},
              h("th", {}, "Model & Specification"),
              h("th", {}, "Category"),
              h("th", {}, "MSRP"),
              h("th", {}, "Net Price"),
              h("th", {}, "Stock Status"))),
          h("tbody", {},
            products.slice(0, 5).map((p) =>
              h("tr", {},
                h("td", {}, h("strong", { class: "vehicle-name" }, p.productName)),
                h("td", {}, p.productCategory ? h("span", { class: "badge badge-category" }, p.productCategory) : "—"),
                h("td", {}, fmtPrice(p.productPrice)),
                h("td", {}, h("strong", { class: "price-highlight" }, fmtPrice(p.productTotal))),
                h("td", {}, getStockBadge(p.productStock)))))));
    }

    const inventorySnapshotCard = h("div", { class: "card dashboard-panel full-width-panel" },
      h("div", { class: "panel-header" },
        h("div", {},
          h("h3", { class: "card-title" }, "Vehicle Inventory Snapshot"),
          h("p", { class: "card-subtitle" }, "Current models in dealership lot and showroom")),
        h("a", { class: "panel-link", href: "#/products" }, "Manage Inventory →")),
      inventoryContent);

    recentSection.replaceChildren(recentLeadsCard, upcomingActivitiesCard, inventorySnapshotCard);

  } catch (err) {
    kpiSection.replaceChildren(
      h("div", { class: "alert alert-danger" },
        `Unable to compute live dealership KPIs: ${err.message}. Please verify the Spring Boot backend is active.`));
  }
}
