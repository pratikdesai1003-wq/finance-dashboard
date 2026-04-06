import { state } from "./state.js";
import { renderAll, renderTransactions, renderRoleUI } from "./render.js";
import { refreshCharts } from "./charts.js";

export function bindEvents() {
  const roleSwitcher = document.getElementById("roleSwitcher");
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const sortBy = document.getElementById("sortBy");
  const themeToggle = document.getElementById("themeToggle");
  const addTransactionBtn = document.getElementById("addTransactionBtn");
  const form = document.getElementById("transactionForm");
  const modalEl = document.getElementById("transactionModal");
  const modal = new bootstrap.Modal(modalEl);

  roleSwitcher.addEventListener("change", () => {
    state.role = roleSwitcher.value;
    renderRoleUI(state);
    localStorage.setItem("finance-role", state.role);
  });

  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    renderTransactions(state);
  });

  typeFilter.addEventListener("change", () => {
    state.typeFilter = typeFilter.value;
    renderTransactions(state);
  });

  sortBy.addEventListener("change", () => {
    state.sortBy = sortBy.value;
    renderTransactions(state);
  });

  themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    themeToggle.textContent = state.theme === "dark" ? "Light Mode" : "Dark Mode";
    localStorage.setItem("finance-theme", state.theme);
    refreshCharts(state.transactions);
  });

  addTransactionBtn.addEventListener("click", () => {
    state.editingId = null;
    document.getElementById("modalTitle").textContent = "Add Transaction";
    form.reset();
    document.getElementById("transactionId").value = "";
    modal.show();
  });

  document.getElementById("transactionTableBody").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn || state.role !== "admin") return;

    const id = Number(btn.dataset.id);
    const txn = state.transactions.find(item => item.id === id);
    if (!txn) return;

    if (btn.dataset.action === "edit") {
      state.editingId = id;
      document.getElementById("modalTitle").textContent = "Edit Transaction";
      document.getElementById("transactionId").value = txn.id;
      document.getElementById("dateInput").value = txn.date;
      document.getElementById("amountInput").value = txn.amount;
      document.getElementById("categoryInput").value = txn.category;
      document.getElementById("txnTypeInput").value = txn.type;
      document.getElementById("descriptionInput").value = txn.description;
      modal.show();
    }

    if (btn.dataset.action === "delete") {
      const ok = confirm("Delete this transaction?");
      if (!ok) return;

      state.transactions = state.transactions.filter(item => item.id !== id);
      persistTransactions();
      refresh();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
      id: state.editingId || Date.now(),
      date: document.getElementById("dateInput").value,
      amount: Number(document.getElementById("amountInput").value),
      category: document.getElementById("categoryInput").value.trim(),
      type: document.getElementById("txnTypeInput").value,
      description: document.getElementById("descriptionInput").value.trim()
    };

    if (state.editingId) {
      state.transactions = state.transactions.map(item =>
        item.id === state.editingId ? payload : item
      );
    } else {
      state.transactions.unshift(payload);
    }

    persistTransactions();
    state.editingId = null;
    form.reset();
    modal.hide();
    refresh();
  });
}

function persistTransactions() {
  localStorage.setItem("finance-transactions", JSON.stringify(state.transactions));
}

function refresh() {
  renderAll(state);
  refreshCharts(state.transactions);
}