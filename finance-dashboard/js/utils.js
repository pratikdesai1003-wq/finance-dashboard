export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function getSummary(transactions) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    income,
    expense,
    balance: income - expense
  };
}

export function getFilteredTransactions(state) {
  let list = [...state.transactions];

  if (state.search.trim()) {
    const q = state.search.toLowerCase().trim();
    list = list.filter(t =>
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)
    );
  }

  if (state.typeFilter !== "all") {
    list = list.filter(t => t.type === state.typeFilter);
  }

  switch (state.sortBy) {
    case "date-asc":
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "amount-desc":
      list.sort((a, b) => b.amount - a.amount);
      break;
    case "amount-asc":
      list.sort((a, b) => a.amount - b.amount);
      break;
    default:
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return list;
}

export function getMonthlyTrend(transactions) {
  const map = new Map();

  [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(t => {
      const month = new Date(t.date).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
      });

      const previous = map.get(month) || 0;
      const delta = t.type === "income" ? Number(t.amount) : -Number(t.amount);
      map.set(month, previous + delta);
    });

  return {
    labels: [...map.keys()],
    values: [...map.values()]
  };
}

export function getCategorySummary(transactions) {
  const categoryMap = new Map();

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + Number(t.amount));
    });

  return {
    labels: [...categoryMap.keys()],
    values: [...categoryMap.values()]
  };
}

export function getInsights(transactions) {
  const expenseTxns = transactions.filter(t => t.type === "expense");
  const monthly = new Map();
  const category = new Map();

  expenseTxns.forEach(t => {
    const month = new Date(t.date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric"
    });

    monthly.set(month, (monthly.get(month) || 0) + Number(t.amount));
    category.set(t.category, (category.get(t.category) || 0) + Number(t.amount));
  });

  const highestCategory = [...category.entries()].sort((a, b) => b[1] - a[1])[0];
  const highestMonth = [...monthly.entries()].sort((a, b) => b[1] - a[1])[0];
  const summary = getSummary(transactions);
  const savingsRate = summary.income > 0
    ? Math.round((summary.balance / summary.income) * 100)
    : 0;

  return [
    {
      title: "Highest spending category",
      value: highestCategory ? highestCategory[0] : "N/A",
      note: highestCategory ? `Spent ${formatCurrency(highestCategory[1])} here.` : "No expense data yet."
    },
    {
      title: "Highest expense month",
      value: highestMonth ? highestMonth[0] : "N/A",
      note: highestMonth ? `Expenses reached ${formatCurrency(highestMonth[1])}.` : "No monthly trend yet."
    },
    {
      title: "Savings rate",
      value: `${Math.max(savingsRate, 0)}%`,
      note: `Income ${formatCurrency(summary.income)} vs expense ${formatCurrency(summary.expense)}.`
    }
  ];
}