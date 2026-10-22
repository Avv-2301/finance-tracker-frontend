const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatMonth(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

export function getMonthOptions() {
  const now = new Date()
  const current = new Date(now.getFullYear(), now.getMonth(), 1)
  const options = []
  for (let offset = 0; offset < 12; offset += 1) {
    const date = new Date(current)
    date.setMonth(date.getMonth() - offset)
    options.push(formatMonth(date))
  }
  return options
}

export function matchesDateRange(transaction, dateRange) {
  if (!dateRange.start && !dateRange.end) return true
  const date = new Date(transaction.date.split(' · ')[0])
  if (Number.isNaN(date.getTime())) return false
  const transactionDate = date.toISOString().slice(0, 10)
  return (!dateRange.start || transactionDate >= dateRange.start)
    && (!dateRange.end || transactionDate <= dateRange.end)
}

export function getTransactionsForPeriod(transactions, month, dateRange) {
  if (dateRange.start || dateRange.end) {
    return transactions.filter((transaction) => matchesDateRange(transaction, dateRange))
  }
  return month === 'all'
    ? transactions
    : transactions.filter((transaction) => transaction.month === month)
}

export function filterTransactions({ transactions, month, dateRange, search, method, category, sort }) {
  const query = search.trim().toLowerCase()
  const filtered = getTransactionsForPeriod(transactions, month, dateRange).filter((transaction) => {
    const searchableValues = [transaction.merchant, transaction.category, transaction.note, ...(transaction.tags || [])]
    const matchesSearch = !query || searchableValues.some((value) => value.toLowerCase().includes(query))
    return matchesSearch
      && (method === 'all' || transaction.method === method)
      && (category === 'all' || transaction.category === category)
  })

  if (sort === 'highest') filtered.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
  if (sort === 'lowest') filtered.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
  return filtered
}

export function getSummaryStats(transactions) {
  const methodStats = transactions.reduce((stats, transaction) => {
    const stat = stats[transaction.method] || { count: 0, spend: 0 }
    stat.count += 1
    if (transaction.amount < 0) stat.spend += Math.abs(transaction.amount)
    stats[transaction.method] = stat
    return stats
  }, {})

  return {
    totalSpend: transactions.reduce(
      (total, transaction) => transaction.amount < 0 ? total + Math.abs(transaction.amount) : total,
      0,
    ),
    expenseCount: transactions.filter((transaction) => transaction.amount < 0).length,
    topMethod: Object.entries(methodStats).sort((a, b) => b[1].count - a[1].count)[0],
    transactionCount: transactions.length,
  }
}

export function getLocalDateInputValue(date = new Date()) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function loadTransactions() {
  try {
    const saved = localStorage.getItem('kashflow-transactions')
    const transactions = saved ? JSON.parse(saved) : []
    return Array.isArray(transactions) ? transactions : []
  } catch {
    return []
  }
}

export function getLastSixMonthExpenses(transactions, currentDate = new Date()) {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5 + index, 1)
    const month = formatMonth(date)
    const spend = transactions.reduce((total, transaction) => (
      transaction.month === month && transaction.amount < 0
        ? total + Math.abs(transaction.amount)
        : total
    ), 0)
    return { month, label: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date), spend }
  })
}

export function getExpenseByMethod(transactions, selectedMonth = formatMonth(new Date())) {
  const currentMonth = selectedMonth instanceof Date ? formatMonth(selectedMonth) : selectedMonth
  const totals = transactions.reduce((result, transaction) => {
    if (transaction.month === currentMonth && transaction.amount < 0) {
      result[transaction.method] = (result[transaction.method] || 0) + Math.abs(transaction.amount)
    }
    return result
  }, {})
  return Object.entries(totals).map(([method, amount]) => ({ method, amount }))
}

export function createTransaction(entry, now = new Date()) {
  const [year, monthIndex, day] = entry.date.split('-').map(Number)
  const transactionDate = new Date(year, monthIndex - 1, day, now.getHours(), now.getMinutes())
  const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(transactionDate)
  const timeLabel = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(now)

  return {
    id: `TXN-${now.getTime()}`,
    ...entry,
    icon: '🍽️',
    tint: 'lime',
    methodDetail: entry.method === 'UPI' ? '⚡ UPI' : entry.method === 'Cash' ? '💵 Cash' : `💳 ${entry.method}`,
    tags: [],
    date: `${dateLabel} · ${timeLabel}`,
    month: formatMonth(transactionDate),
    status: 'Settled',
    receipt: false,
  }
}

export function formatTransactionAmount(value) {
  return `${value > 0 ? '+' : ''}${rupeeFormatter.format(Math.abs(value))}`
}

export function formatRupees(value) {
  return rupeeFormatter.format(value)
}
