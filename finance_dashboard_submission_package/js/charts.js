import { getMonthlyTrend, getCategorySummary } from "./utils.js";

let balanceChartInstance = null;
let categoryChartInstance = null;

function getChartColors() {
  const theme = document.documentElement.dataset.theme || "light";

  if (theme === "dark") {
    return {
      grid: "rgba(148, 163, 184, 0.18)",
      ticks: "#cbd5e1",
      line: "#60a5fa",
      fill: "rgba(96, 165, 250, 0.14)",
      categoryColors: ["#60a5fa", "#38bdf8", "#34d399", "#fbbf24", "#fb7185", "#a78bfa", "#2dd4bf"]
    };
  }

  return {
    grid: "rgba(148, 163, 184, 0.16)",
    ticks: "#64748b",
    line: "#2563eb",
    fill: "rgba(37, 99, 235, 0.12)",
    categoryColors: ["#2563eb", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"]
  };
}

function createBalanceChart(transactions) {
  const ctx = document.getElementById("balanceChart");
  const trend = getMonthlyTrend(transactions);
  const colors = getChartColors();

  balanceChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: trend.labels,
      datasets: [{
        label: "Balance Trend",
        data: trend.values,
        borderColor: colors.line,
        backgroundColor: colors.fill,
        pointBackgroundColor: colors.line,
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.ticks }
        },
        y: {
          grid: { color: colors.grid },
          ticks: {
            color: colors.ticks,
            callback: (value) => `₹${value}`
          }
        }
      }
    }
  });
}

function createCategoryChart(transactions) {
  const ctx = document.getElementById("categoryChart");
  const category = getCategorySummary(transactions);
  const colors = getChartColors();

  categoryChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: category.labels,
      datasets: [{
        label: "Expenses",
        data: category.values,
        backgroundColor: colors.categoryColors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.ticks,
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10
          }
        }
      }
    }
  });
}

export function initCharts(transactions) {
  createBalanceChart(transactions);
  createCategoryChart(transactions);
}

export function refreshCharts(transactions) {
  if (balanceChartInstance) balanceChartInstance.destroy();
  if (categoryChartInstance) categoryChartInstance.destroy();
  initCharts(transactions);
}