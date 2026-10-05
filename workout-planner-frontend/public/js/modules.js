// Dealership Modules Configuration for Maximize Motors
// Strictly uses existing backend Spring Boot entity fields and endpoints.
import { api, normalizeList } from "./api.js";
import { h, badge, detailList, fmtDate, fmtNum, fmtPrice } from "./ui.js";
import { crudPage } from "./crud.js";

const s = (key) => (r) => r[key];
const dt = (key) => (r) => fmtDate(r[key]);
const bd = (key) => (r) => badge(r[key]);

const list = (title, items, label) =>
  h("div", { class: "sub-section" },
    h("h3", { class: "sub-title" }, `${title} (${(items || []).length})`),
    (items || []).length
      ? h("ul", { class: "linked-list" }, items.map((i) => h("li", {}, label(i))))
      : h("div", { class: "empty-sub" }, "No linked records registered."));

// ---- Enums (exact values recognized by Spring Boot) ----
const USER_ROLE = ["Admin", "Sales_Executive", "Manager"];
const CUSTOMER_TYPE = ["New", "Existing"];
const LEAD_STATUS = ["PENDING", "ACTIVE", "ON_HOLD", "SUCCESSFUL", "UNSUCCESSFUL"];
const LEAD_SOURCE = ["WEBSITE", "SOCIAL_MEDIA", "ADVERTISEMENT", "REFERRAL"];
const OPP_STATUS = ["OPEN", "NEGOTIATION", "WON", "LOST"];
const CAMPAIGN_STATUS = ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"];
const ACTIVITY_TITLE = ["CALL", "MEETING", "FOLLOW_UP"];
const ACTIVITY_STATUS = ["PENDING", "COMPLETED", "CANCELLED"];

export const modules = {
  // 1. VEHICLE INVENTORY (formerly Products)
  products: crudPage({
    title: "Vehicle Inventory",
    singular: "Vehicle",
    endpoint: "/products",
    iconName: "car",
    emptyDesc: "No vehicles in inventory. Add your first vehicle to start managing dealership showroom stock.",
    columns: [
      { label: "ID", render: s("id") },
      {
        label: "Vehicle Model & Trim",
        render: (r) => h("div", { class: "vehicle-cell" },
          h("strong", { class: "vehicle-name" }, r.productName),
          r.productDescription ? h("small", { class: "vehicle-desc-preview" }, r.productDescription) : null),
      },
      {
        label: "Category",
        render: (r) => r.productCategory ? h("span", { class: "badge badge-category" }, r.productCategory) : "—",
      },
      { label: "Base MSRP", render: (r) => fmtPrice(r.productPrice) },
      {
        label: "Incentive",
        render: (r) => (Number(r.productDiscount) > 0 ? h("span", { class: "discount-tag" }, `-${fmtPrice(r.productDiscount)}`) : "—"),
      },
      {
        label: "Net Price",
        render: (r) => h("strong", { class: "price-highlight" }, fmtPrice(r.productTotal)),
      },
      {
        label: "Inventory Status",
        render: (r) => {
          const stock = Number(r.productStock);
          if (stock <= 0) return badge("OUT_OF_STOCK");
          if (stock <= 2) return h("span", { class: "badge badge-warn" }, h("span", { class: "badge-dot" }), `Low Stock (${stock})`);
          return h("span", { class: "badge badge-good" }, h("span", { class: "badge-dot" }), `In Stock (${stock})`);
        },
      },
    ],
    fields: [
      { name: "productName", label: "Vehicle Model & Trim", type: "text", required: true, help: "e.g. Apex GT Sport, Horizon V6 Luxury" },
      { name: "productCategory", label: "Vehicle Category", type: "text", help: "e.g. Sedan, SUV, Coupe, Electric, Truck" },
      { name: "productPrice", label: "MSRP / Base Price ($)", type: "number", required: true, min: 0 },
      { name: "productStock", label: "Available Stock Count", type: "number", required: true, min: 0 },
      { name: "productDiscount", label: "Dealership Discount / Incentive ($)", type: "number", required: true, min: 0, default: 0 },
      { name: "productTotal", label: "Total Final Price ($)", type: "number", required: true, min: 0, help: "Final calculated customer price" },
      { name: "productDescription", label: "Key Options & Features Overview", type: "textarea" },
    ],
    view: (r) => detailList([
      ["Vehicle ID", `#${r.id}`],
      ["Model & Specification", r.productName],
      ["Vehicle Category", r.productCategory || "Standard"],
      ["Base MSRP", fmtPrice(r.productPrice)],
      ["Dealer Incentive", r.productDiscount > 0 ? `-${fmtPrice(r.productDiscount)}` : "None"],
      ["Net Total Price", fmtPrice(r.productTotal)],
      ["Units on Lot / Showroom", `${r.productStock} units`],
      ["Overview & Equipment", r.productDescription || "No detailed notes provided."],
    ]),
  }),

  // 2. BUYERS (formerly Customers)
  customers: crudPage({
    title: "Buyers",
    singular: "Buyer",
    endpoint: "/customers",
    iconName: "buyers",
    emptyDesc: "No buyers registered yet. Add buyers to begin tracking vehicle purchases and client relationships.",
    columns: [
      { label: "ID", render: s("id") },
      { label: "Buyer Name", render: (r) => h("strong", {}, r.customerName) },
      { label: "Email Address", render: s("customerEmail") },
      { label: "Phone", render: s("customerPhone") },
      { label: "City", render: (r) => r.customerCity || "—" },
      { label: "Buyer Type", render: bd("customerType") },
      { label: "Customer Since", render: dt("customerCreatedAt") },
    ],
    fields: [
      { name: "customerName", label: "Buyer Full Name", type: "text", required: true },
      { name: "customerEmail", label: "Email Address", type: "email", required: true },
      { name: "customerPhone", label: "Primary Phone Number", type: "tel", required: true },
      { name: "customerAddress", label: "Mailing / Billing Address", type: "text" },
      { name: "customerCity", label: "City", type: "text" },
      { name: "customerType", label: "Buyer Classification", type: "select", options: CUSTOMER_TYPE },
      { name: "customerCreatedAt", label: "Registration Timestamp", type: "datetime", default: "now" },
    ],
    view: (r) => h("div", {},
      detailList([
        ["Buyer ID", `#${r.id}`],
        ["Full Name", r.customerName],
        ["Email", r.customerEmail],
        ["Contact Phone", r.customerPhone],
        ["Street Address", r.customerAddress],
        ["City", r.customerCity],
        ["Buyer Classification", badge(r.customerType)],
        ["Customer Since", fmtDate(r.customerCreatedAt)],
      ]),
      list("Active Purchase Deals", r.opportunities, (o) => `#${o.id} ${o.title} (${o.status}) — ${fmtPrice(o.value)}`),
      list("Test Drives & Appointments", r.activities, (a) => `#${a.id} ${a.activityTitle} (${a.activityStatus}) — ${fmtDate(a.activityScheduledAt)}`)),
  }),

  // 3. POTENTIAL BUYERS (formerly Leads)
  leads: crudPage({
    title: "Potential Buyers",
    singular: "Lead",
    endpoint: "/leads",
    iconName: "leads",
    emptyDesc: "No leads currently in the pipeline. Register new prospective car buyers to start sales follow-ups.",
    columns: [
      { label: "ID", render: s("id") },
      { label: "Prospect Name", render: (r) => h("strong", {}, r.leadName) },
      {
        label: "Contact Information",
        render: (r) => h("div", { class: "contact-cell" },
          h("div", {}, r.leadEmail),
          h("small", { class: "subtext" }, r.leadPhone)),
      },
      { label: "Lead Status", render: bd("leadStatus") },
      { label: "Inquiry Channel", render: bd("leadSource") },
      { label: "Assigned Sales Rep", render: (r) => r.leadAssignedTo || "Unassigned" },
    ],
    fields: [
      { name: "leadName", label: "Prospect Full Name", type: "text", required: true },
      { name: "leadEmail", label: "Email Address", type: "email", required: true },
      { name: "leadPhone", label: "Phone Number", type: "tel", required: true },
      { name: "leadStatus", label: "Lead Status", type: "select", options: LEAD_STATUS, required: true },
      { name: "leadSource", label: "Acquisition Channel", type: "select", options: LEAD_SOURCE, required: true },
      { name: "leadAssignedTo", label: "Assigned Sales Representative", type: "text" },
      { name: "leadCreatedAt", label: "Inquiry Timestamp", type: "datetime", default: "now" },
      { name: "requirement", label: "Vehicle Preferences & Requirements", type: "list", full: true, help: "Comma-separated, e.g. SUV, All-Wheel Drive, Leather Trim, Hybrid" },
    ],
    view: (r) => h("div", {},
      detailList([
        ["Prospect ID", `#${r.id}`],
        ["Full Name", r.leadName],
        ["Email", r.leadEmail],
        ["Phone Number", r.leadPhone],
        ["Qualification Status", badge(r.leadStatus)],
        ["Inquiry Channel", badge(r.leadSource)],
        ["Assigned Representative", r.leadAssignedTo || "Unassigned"],
        ["Inquiry Date", fmtDate(r.leadCreatedAt)],
        ["Vehicle Preferences", (r.requirement || []).join(", ") || "No specific preferences specified."],
      ]),
      list("Pipeline Opportunities", r.opportunities, (o) => `#${o.id} ${o.title} (${o.status}) — ${fmtPrice(o.value)}`)),
  }),

  // 4. SALES PIPELINE (formerly Opportunities)
  opportunities: crudPage({
    title: "Sales Pipeline",
    singular: "Deal Opportunity",
    endpoint: "/opportunities",
    iconName: "pipeline",
    emptyDesc: "Sales pipeline is empty. Create deal opportunities to track vehicle negotiations and closes.",
    columns: [
      { label: "ID", render: s("id") },
      { label: "Deal Title", render: (r) => h("strong", {}, r.title) },
      { label: "Deal Value", render: (r) => h("strong", { class: "price-highlight" }, fmtPrice(r.value)) },
      { label: "Deal Stage", render: bd("status") },
      { label: "Expected Close", render: dt("expectedCloseDate") },
      { label: "Created", render: dt("createdAt") },
    ],
    fields: [
      { name: "title", label: "Deal Title / Vehicle Reference", type: "text", required: true, help: "e.g. 2026 Apex GT Purchase - John Smith" },
      { name: "value", label: "Estimated Deal Value ($)", type: "integer", required: true, min: 0 },
      { name: "status", label: "Pipeline Stage", type: "select", options: OPP_STATUS, required: true },
      { name: "expectedCloseDate", label: "Anticipated Close Date", type: "datetime" },
      { name: "createdAt", label: "Creation Timestamp", type: "datetime", default: "now" },
      { name: "description", label: "Deal Terms & Negotiation Notes", type: "textarea" },
    ],
    view: (r) => detailList([
      ["Deal ID", `#${r.id}`],
      ["Deal Title", r.title],
      ["Estimated Value", fmtPrice(r.value)],
      ["Current Pipeline Stage", badge(r.status)],
      ["Anticipated Close", fmtDate(r.expectedCloseDate)],
      ["Created Timestamp", fmtDate(r.createdAt)],
      ["Negotiation Notes", r.description || "No notes entered."],
    ]),
  }),

  // 5. DEALERSHIP CAMPAIGNS (formerly Campaigns)
  campaigns: crudPage({
    title: "Dealership Campaigns",
    singular: "Campaign",
    endpoint: "/campaigns",
    iconName: "campaigns",
    emptyDesc: "No promotional campaigns currently active. Launch seasonal or financing campaigns to drive showroom traffic.",
    columns: [
      { label: "ID", render: s("id") },
      { label: "Campaign Name", render: (r) => h("strong", {}, r.campaignName) },
      { label: "Schedule", render: (r) => `${r.campaignStartDate || "—"} → ${r.campaignEndDate || "—"}` },
      { label: "Marketing Budget", render: (r) => fmtPrice(r.campaignBudget) },
      { label: "Campaign Status", render: bd("campaignStatus") },
    ],
    fields: [
      { name: "campaignName", label: "Campaign Name", type: "text", required: true, help: "e.g. Summer Lease Event, Year-End Clearance" },
      { name: "campaignStatus", label: "Campaign Status", type: "select", options: CAMPAIGN_STATUS, required: true },
      { name: "campaignStartDate", label: "Launch Date", type: "date", required: true },
      {
        name: "campaignEndDate", label: "End Date", type: "date", required: true,
        validate: (v, get) => (get("campaignStartDate") && v < get("campaignStartDate") ? "End date must be after launch date" : ""),
      },
      { name: "campaignBudget", label: "Allocated Budget ($)", type: "integer", required: true, min: 0 },
      { name: "campaignDescription", label: "Campaign Targets & Strategy", type: "textarea" },
    ],
    view: (r) => h("div", {},
      detailList([
        ["Campaign ID", `#${r.id}`],
        ["Campaign Title", r.campaignName],
        ["Target Strategy", r.campaignDescription || "No strategy notes entered."],
        ["Start Date", r.campaignStartDate],
        ["End Date", r.campaignEndDate],
        ["Marketing Budget", fmtPrice(r.campaignBudget)],
        ["Current Status", badge(r.campaignStatus)],
      ]),
      list("Campaign Leads & Prospects", r.leads, (l) => `#${l.id} ${l.leadName}`)),
  }),

  // 6. ACTIVITIES & TEST DRIVES (formerly Activities)
  activities: crudPage({
    title: "Activities & Test Drives",
    singular: "Activity / Test Drive",
    endpoint: "/activities",
    iconName: "activities",
    emptyDesc: "No activities or test drives scheduled. Schedule appointments, follow-ups, or vehicle test drives.",
    columns: [
      { label: "ID", render: s("id") },
      { label: "Activity Type", render: bd("activityTitle") },
      { label: "Details / Notes", render: s("activityDescription") },
      { label: "Scheduled For", render: (r) => r.activityScheduledAt || "—" },
      { label: "Status", render: bd("activityStatus") },
      {
        label: "Vehicles Involved",
        render: (r) => (r.products || []).map((p) => p.productName).join(", ") || "—",
      },
    ],
    fields: [
      { name: "activityTitle", label: "Appointment Type", type: "select", options: ACTIVITY_TITLE, required: true },
      { name: "activityStatus", label: "Status", type: "select", options: ACTIVITY_STATUS, required: true },
      { name: "activityScheduledAt", label: "Scheduled Date", type: "date", required: true },
      { name: "activityDescription", label: "Activity Notes / Test Drive Route", type: "textarea", required: true },
      {
        name: "products", label: "Associated Inventory Vehicles", type: "multiselect", full: true,
        help: "Hold Ctrl/Cmd to select vehicles for this appointment (optional)",
        loadOptions: async () => {
          const res = await api.get("/products");
          const list = normalizeList(res);
          return list.map((p) => ({ value: p.id, label: `${p.productName} — ${fmtPrice(p.productPrice)} (#${p.id})` }));
        },
      },
    ],
    // Spring Boot expects products as array of { id } objects
    transform: (v) => ({ ...v, products: (v.products || []).map((id) => ({ id })) }),
    view: (r) => h("div", {},
      detailList([
        ["Activity ID", `#${r.id}`],
        ["Appointment Type", badge(r.activityTitle)],
        ["Scheduled Date", r.activityScheduledAt],
        ["Execution Status", badge(r.activityStatus)],
        ["Appointment Notes", r.activityDescription],
      ]),
      list("Vehicles Involved", r.products, (p) => `#${p.id} ${p.productName} — ${fmtPrice(p.productPrice)}`)),
  }),

  // 7. SALES STAFF (formerly Users)
  users: crudPage({
    title: "Sales Staff",
    singular: "Staff Member",
    endpoint: "/users",
    iconName: "staff",
    emptyDesc: "No sales staff registered. Add dealership advisors, sales executives, and managers.",
    columns: [
      { label: "Staff ID", render: s("id") },
      { label: "Name", render: (r) => h("strong", {}, r.userName) },
      { label: "Email Address", render: s("userEmail") },
      { label: "Direct Phone", render: (r) => r.userPhone || "—" },
      { label: "Dealership Role", render: bd("userRole") },
      { label: "Active Status", render: (r) => badge(r.userActive ? "Active" : "Inactive") },
    ],
    fields: [
      { name: "userName", label: "Staff Full Name", type: "text", required: true },
      { name: "userEmail", label: "Dealership Email Address", type: "email", required: true },
      { name: "userPassword", label: "Account Password", type: "password", required: true, minLength: 6 },
      { name: "userPhone", label: "Direct Contact Phone", type: "tel", required: true },
      { name: "userRole", label: "Dealership Role", type: "select", options: USER_ROLE },
      { name: "userActive", label: "Active Staff Status", type: "checkbox", default: true },
    ],
    view: (r) => h("div", {},
      detailList([
        ["Staff ID", `#${r.id}`],
        ["Full Name", r.userName],
        ["Email", r.userEmail],
        ["Phone Number", r.userPhone],
        ["Dealership Role", badge(r.userRole)],
        ["Active Account", badge(r.userActive ? "Active" : "Inactive")],
      ]),
      list("Assigned Potential Buyers", r.leads, (l) => `#${l.id} ${l.leadName} (${l.leadStatus})`),
      list("Active Pipeline Deals", r.opportunities, (o) => `#${o.id} ${o.title} (${o.status})`),
      list("Scheduled Activities & Drives", r.activities, (a) => `#${a.id} ${a.activityTitle}`)),
  }),
};

export const navItems = [
  ["dashboard", "Overview & KPIs", "dashboard"],
  ["products", "Vehicle Inventory", "car"],
  ["customers", "Buyers", "buyers"],
  ["leads", "Potential Buyers", "leads"],
  ["opportunities", "Sales Pipeline", "pipeline"],
  ["activities", "Activities & Test Drives", "activities"],
  ["campaigns", "Dealership Campaigns", "campaigns"],
  ["users", "Sales Staff", "staff"],
];
