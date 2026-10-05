// Generic Dealership CRUD Engine with robust list normalization,
// live search, skeleton loading, and polished empty states.
import { api, normalizeList } from "./api.js";
import { h, button, skeletonTable, errorBox, modal, confirmDialog, table, toast, emptyState, icon } from "./ui.js";
import { buildForm } from "./form.js";

/**
 * Creates a generic CRUD page module.
 * @param {Object} cfg
 *  - title: Page heading
 *  - singular: Entity label (e.g. "Buyer", "Vehicle", "Lead")
 *  - endpoint: Backend API path (e.g. "/customers", "/products")
 *  - iconName: Icon key for empty states & buttons
 *  - emptyDesc: Custom empty description
 *  - columns: Column definitions
 *  - fields: Form field definitions
 *  - view: Function returning view details DOM
 *  - transform: Optional payload transformation function
 */
export function crudPage(cfg) {
  return async function render(container) {
    let allRows = [];
    let filterQuery = "";

    const holder = h("div", { class: "crud-content" });
    const countBadge = h("span", { class: "count-pill" }, "…");

    const searchInput = h("input", {
      type: "search",
      class: "search-input",
      placeholder: `Search ${cfg.title.toLowerCase()}...`,
      onInput: (e) => {
        filterQuery = e.target.value.toLowerCase().trim();
        renderRows();
      },
    });

    const searchWrap = h("div", { class: "search-box" },
      icon("search", "search-icon"),
      searchInput);

    const head = h("div", { class: "page-head" },
      h("div", { class: "page-title-group" },
        h("div", { class: "page-title-row" },
          h("h2", { class: "page-title" }, cfg.title),
          countBadge),
        h("p", { class: "page-subtitle" }, `Manage and view dealership ${cfg.title.toLowerCase()}`)),
      h("div", { class: "page-actions" },
        searchWrap,
        button(`+ Add ${cfg.singular}`, openAdd, "btn-primary")));

    container.replaceChildren(head, holder);

    function getFilteredRows() {
      if (!filterQuery) return allRows;
      return allRows.filter((r) => {
        return Object.values(r).some((val) => {
          if (val == null) return false;
          if (typeof val === "object") return false;
          return String(val).toLowerCase().includes(filterQuery);
        });
      });
    }

    function renderRows() {
      const rows = getFilteredRows();
      countBadge.textContent = `${allRows.length} ${allRows.length === 1 ? "record" : "records"}`;

      if (!rows.length) {
        if (filterQuery) {
          holder.replaceChildren(emptyState({
            iconName: "search",
            title: "No matching records",
            description: `No ${cfg.title.toLowerCase()} match your filter "${filterQuery}".`,
            action: button("Clear Filter", () => {
              searchInput.value = "";
              filterQuery = "";
              renderRows();
            }, "btn-secondary"),
          }));
        } else {
          holder.replaceChildren(emptyState({
            iconName: cfg.iconName || "car",
            title: `No ${cfg.title} in the System`,
            description: cfg.emptyDesc || `Get started by adding your first ${cfg.singular.toLowerCase()} to the dealership CRM.`,
            action: button(`+ Add ${cfg.singular}`, openAdd, "btn-primary"),
          }));
        }
        return;
      }

      holder.replaceChildren(table(cfg.columns, rows, (r) => [
        button("View", () => openView(r.id), "btn-sm btn-secondary"),
        button("Delete", () => askDelete(r), "btn-sm btn-danger"),
      ]));
    }

    async function load() {
      holder.replaceChildren(skeletonTable(cfg.columns.length + 1, 6));
      try {
        const res = await api.get(cfg.endpoint);
        // Robust handling of either raw arrays or Spring Data Page objects
        allRows = normalizeList(res);
        renderRows();
      } catch (e) {
        if (e.status !== 401) {
          holder.replaceChildren(errorBox(e.message || "Failed to load records from the server."));
        }
      }
    }

    async function openView(id) {
      const body = h("div", { class: "view-modal-content" }, skeletonTable(2, 4));
      modal(`${cfg.singular} Record #${id}`, body);
      try {
        const row = await api.get(`${cfg.endpoint}/${id}`);
        body.replaceChildren(row ? cfg.view(row) : errorBox(`${cfg.singular} not found.`));
      } catch (e) {
        body.replaceChildren(errorBox(e.message));
      }
    }

    function askDelete(row) {
      confirmDialog(
        `Are you sure you want to remove ${cfg.singular.toLowerCase()} #${row.id}? This operation cannot be reversed.`,
        async () => {
          await api.del(`${cfg.endpoint}/${row.id}`);
          toast(`${cfg.singular} #${row.id} removed successfully`, "success");
          load();
        },
        { title: `Delete ${cfg.singular}`, confirmLabel: "Delete Record" }
      );
    }

    function openAdd() {
      const m = modal(`New ${cfg.singular}`, buildForm(cfg.fields, {
        submitLabel: `Create ${cfg.singular}`,
        onCancel: () => m.close(),
        onSubmit: async (values) => {
          await api.post(cfg.endpoint, cfg.transform ? cfg.transform(values) : values);
          m.close();
          toast(`${cfg.singular} created successfully`, "success");
          load();
        },
      }));
    }

    load();
  };
}
