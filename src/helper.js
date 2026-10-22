const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMonth(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getMonthOptions() {
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth(), 1);
  const options = [];
  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(current);
    date.setMonth(date.getMonth() - offset);
    options.push(formatMonth(date));
  }
  return options;
}

export function getLocalDateInputValue(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function getLastSixMonthExpenses(
  transactions,
  currentDate = new Date()
) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 5 + index,
      1
    );
    const month = formatMonth(date);
    const spend = transactions.reduce(
      (total, transaction) =>
        transaction.month === month && transaction.amount > 0
          ? total + transaction.amount
          : total,
      0
    );
    return {
      month,
      label: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
      spend,
    };
  });
}

export function getExpenseByMethod(
  transactions,
  selectedMonth = formatMonth(new Date())
) {
  const currentMonth =
    selectedMonth instanceof Date ? formatMonth(selectedMonth) : selectedMonth;
  const totals = transactions.reduce((result, transaction) => {
    if (transaction.month === currentMonth && transaction.amount > 0) {
      result[transaction.method] =
        (result[transaction.method] || 0) + transaction.amount;
    }
    return result;
  }, {});
  return Object.entries(totals).map(([method, amount]) => ({ method, amount }));
}

export function getExpenseByCategory(
  transactions,
  selectedMonth = formatMonth(new Date())
) {
  const currentMonth =
    selectedMonth instanceof Date ? formatMonth(selectedMonth) : selectedMonth;
  const totals = transactions.reduce((result, transaction) => {
    if (transaction.month === currentMonth && transaction.amount > 0) {
      result[transaction.category] =
        (result[transaction.category] || 0) + transaction.amount;
    }
    return result;
  }, {});
  return Object.entries(totals).map(([category, amount]) => ({ category, amount }));
}

export function formatExpenseRecord(expense) {
  const [year, monthIndex, day] = String(expense.date)
    .slice(0, 10)
    .split("-")
    .map(Number);
  const expenseDate = new Date(year, monthIndex - 1, day);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(expenseDate);
  const createdAt = expense.createdAt ? new Date(expense.createdAt) : null;
  const timeLabel =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(createdAt)
      : "";

  return {
    ...expense,
    amount: Math.abs(Number(expense.amount)),
    id: expense.transactionId || expense.id,
    dateISO: String(expense.date).slice(0, 10),
    date: timeLabel ? `${dateLabel} · ${timeLabel}` : dateLabel,
    dateOnly: dateLabel,
    month: formatMonth(expenseDate),
    icon: (expense.merchant || "?").trim().charAt(0).toUpperCase(),
    tint: "lime",
    methodDetail:
      expense.method === "UPI"
        ? "⚡ UPI"
        : expense.method === "Cash"
        ? "💵 Cash"
        : `💳 ${expense.method}`,
  };
}

export function formatTransactionAmount(value) {
  return rupeeFormatter.format(Math.abs(value));
}

export function formatRupees(value) {
  return rupeeFormatter.format(value);
}
