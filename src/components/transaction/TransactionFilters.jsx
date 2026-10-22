import { methods } from "../../data/paymentMethods";
import { expenseCategories } from "../../data/categories";

export default function TransactionFilters({
  search,
  setSearch,
  month,
  setMonth,
  monthOptions,
  dateRange,
  methodCounts,
  onDateRangeChange,
  method,
  setMethod,
  category,
  setCategory,
  sort,
  setSort,
}) {
  return (
    <section className="filters-panel">
      <div className="filter-top">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchants, categories, or notes..."
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">Category: All Categories</option>
          {expenseCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort transactions"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="highest">Sort: Highest Amount</option>
          <option value="lowest">Sort: Lowest Amount</option>
        </select>
      </div>
      <div className="cycle-row">
        <span className="cycle-label">▦ CYCLE:</span>
        <div className="month-pills">
          {monthOptions.slice(0, 3).map((value) => (
            <button
              key={value}
              onClick={() => setMonth(value)}
              className={month === value ? "selected" : ""}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="date-range">
        <span className="cycle-label">DATE RANGE:</span>
        <label>
          <span>FROM</span>
          <input
            type="date"
            value={dateRange.start}
            max={dateRange.end || undefined}
            onChange={(event) => onDateRangeChange("start", event.target.value)}
            aria-label="Start date"
          />
        </label>
        <label>
          <span>TO</span>
          <input
            type="date"
            value={dateRange.end}
            min={dateRange.start || undefined}
            onChange={(event) => onDateRangeChange("end", event.target.value)}
            aria-label="End date"
          />
        </label>
        {(dateRange.start || dateRange.end) && (
          <button
            className="clear-date-range"
            type="button"
            onClick={() => setMonth(monthOptions[0])}
          >
            Clear dates
          </button>
        )}
      </div>
      <div className="method-section">
        <span className="cycle-label">TRANSACTION TYPE:</span>
        <div className="method-pills">
          {methods.map((item) => (
            <button
              key={item.id}
              onClick={() => setMethod(item.id)}
              className={method === item.id ? "selected" : ""}
            >
              <span>{item.icon}</span>
              {item.label}
              <small>{methodCounts[item.id] ?? 0}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
