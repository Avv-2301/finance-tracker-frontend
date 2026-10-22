import { formatRupees } from "../../helper.js";
import { categoryChartColors } from "./chartColors.js";

export default function ExpenseCategoryChart({
  categories,
  totalSpend,
  month,
  monthOptions,
  onMonthChange,
}) {
  const gradient = categories.length
    ? categories
        .map((item) => `${categoryChartColors[item.category] ?? "#aeb2a2"} ${item.startPercent}% ${item.endPercent}%`)
        .join(", ")
    : "#343943 0% 100%";

  return (
    <article className="dashboard-chart-card category-chart-card">
      <div className="dashboard-chart-heading">
        <div>
          <span className="dashboard-kicker">CATEGORY BREAKDOWN</span>
          <h2>Expenses by category</h2>
        </div>
        <label className="chart-month-select">
          <span className="sr-only">Choose chart month</span>
          <select
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            aria-label="Choose category chart month"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="category-chart-content">
        <div
          className={`category-pie${categories.length ? "" : " is-empty"}`}
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label={categories.length
            ? `Expenses by category for ${month}, total ${formatRupees(totalSpend)}`
            : `No expenses recorded for ${month}`}
        />
        <div className="category-legend">
          {categories.length ? (
            categories.map((item) => (
              <div className="method-legend-item" key={item.category}>
                <span
                  className="method-legend-dot"
                  style={{ background: categoryChartColors[item.category] ?? "#aeb2a2" }}
                />
                <span className="method-legend-name" title={item.category}>{item.category}</span>
                <strong>{formatRupees(item.amount)}</strong>
              </div>
            ))
          ) : (
            <p className="chart-empty">No expenses recorded this month yet.</p>
          )}
        </div>
      </div>
    </article>
  );
}
