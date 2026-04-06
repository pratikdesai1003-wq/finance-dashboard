import { formatCurrency, formatDate, getSummary, getFilteredTransactions, getInsights } from "./utils.js";

function getSummaryMetaText(summary) {
  if (summary.balance > 0) return "Positive balance";
  if (summary.balance < 0) return "Negative balance";
  return "Balanced state";
}

export function renderSummaryCards(state) {
  const summary = getSummary(state.transactions);
  const wrapper = document.getElementById("summaryCards");

  wrapper.innerHTML = `
    <div class="col-12 col-md-4">
      <div class="summary-card">
        <div class="summary-label">Total Balance</div>
        <div class="summary-value">${formatCurrency(summary.balance)}</div>
        <div class="summary-note">Current financial position</div>
        <div class="summary-meta">
          <span>${getSummaryMetaText(summary)}</span>
          <span>${summary.balance >= 0 ? "Healthy" : "Needs attention"}</span>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4">
      <div class="summary-card">
        <div class="summary-label">Income</div>
        <div class="summary-value">${formatCurrency(summary.income)}</div>
        <div class="summary-note">All income sources combined</div>
        <div class="summary-meta">
          <span>Salary + freelance</span>
          <span>Tracked</span>
        </div>
      </div>
    </div>

    <div class="col-12 col-md-4">
      <div class="summary-card">
        <div class="summary-label">Expenses</div>
        <div class="summary-value">${formatCurrency(summary.expense)}</div>
        <div class="summary-note">All expense categories combined</div>
        <div class="summary-meta">
          <span>Spent amount</span>
          <span>Updated live</span>
        </div>
      </div>
    </div>
  `;
}

export function renderTransactions(state) {
  const tbody = document.getElementById("transactionTableBody");
  const emptyState = document.getElementById("emptyState");
  const rows = getFilteredTransactions(state);

  tbody.innerHTML = "";

  if (!rows.length) {
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  tbody.innerHTML = rows.map(txn => `
    <tr>
      <td>${formatDate(txn.date)}</td>
      <td>${txn.category}</td>
      <td>${txn.description}</td>
      <td>
        <span class="badge-soft ${txn.type === "income" ? "badge-income" : "badge-expense"}">
          ${txn.type}
        </span>
      </td>
      <td class="text-end fw-semibold">${formatCurrency(txn.amount)}</td>
      <td class="text-end admin-only d-none">
        <div class="actions-wrap">
          <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${txn.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${txn.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");
}

export function renderInsights(state) {
  const insights = getInsights(state.transactions);
  const grid = document.getElementById("insightsGrid");

  grid.innerHTML = insights.map(item => `
    <div class="insight-card">
      <h3>${item.title}</h3>
      <p class="fw-semibold mb-1">${item.value}</p>
      <p>${item.note}</p>
    </div>
  `).join("");
}

export function renderRoleUI(state) {
  const addBtn = document.getElementById("addTransactionBtn");
  const adminColumns = document.querySelectorAll(".admin-only");

  if (state.role === "admin") {
    addBtn.classList.remove("d-none");
    adminColumns.forEach(el => el.classList.remove("d-none"));
  } else {
    addBtn.classList.add("d-none");
    adminColumns.forEach(el => el.classList.add("d-none"));
  }
}

export function renderAll(state) {
  renderSummaryCards(state);
  renderTransactions(state);
  renderInsights(state);
  renderRoleUI(state);
}