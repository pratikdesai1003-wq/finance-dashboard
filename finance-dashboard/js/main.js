import { initialTransactions } from "./data.js";
import { state } from "./state.js";
import { renderAll } from "./render.js";
import { initCharts } from "./charts.js";
import { bindEvents } from "./events.js";

function loadFromStorage() {
  const savedTransactions = localStorage.getItem("finance-transactions");
  const savedRole = localStorage.getItem("finance-role");
  const savedTheme = localStorage.getItem("finance-theme");

  try {
    state.transactions = savedTransactions ? JSON.parse(savedTransactions) : initialTransactions;
  } catch {
    state.transactions = initialTransactions;
  }

  state.role = savedRole || "viewer";
  state.theme = savedTheme || "light";

  document.documentElement.dataset.theme = state.theme;
  document.getElementById("roleSwitcher").value = state.role;
  document.getElementById("themeToggle").textContent = state.theme === "dark" ? "Light Mode" : "Dark Mode";
}

function init() {
  loadFromStorage();
  initCharts(state.transactions);
  renderAll(state);
  bindEvents();
}

init();