import { formatRupees } from "../../helper.js";
import { methodChartColors } from "./chartColors.js";

export default function ExpenseMethodChart({
  methods,
  totalSpend,
  month,
  monthOptions,
  onMonthChange,
}) {
  const gradient = methods.length
    ? methods
        .map((item) => `${methodChartColors[item.method] ?? "#aeb2a2"} ${item.startPercent}% ${item.endPercent}%`)
        .join(", ")
    : "#343943 0% 100%";
  return (
    <article className="dashboard-chart-card method-chart-card">
      <div className="dashboard-chart-heading">
        <div>
          <span className="dashboard-kicker">EXPENSE BREAKDOWN</span>
          <h2>Expenses by method</h2>
        </div>
        <label className="chart-month-select">
          <span className="sr-only">Choose chart month</span>
          <select
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            aria-label="Choose pie chart month"
          >
            {monthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="method-chart-content">
        <div
          className={`method-donut${methods.length ? "" : " is-empty"}`}
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label={
            methods.length
              ? `Expenses by payment method for ${month}, total ${formatRupees(
                  totalSpend
                )}`
              : `No expenses recorded for ${month}`
          }
        >
          <div className="method-donut-center">
            <span>TOTAL SPENT</span>
            <strong>{formatRupees(totalSpend)}</strong>
          </div>
        </div>
        <div className="method-legend">
          {methods.length ? (
            methods.map((item) => (
              <div className="method-legend-item" key={item.method}>
                <span
                  className="method-legend-dot"
                  style={{
                    background: methodChartColors[item.method] ?? "#aeb2a2",
                  }}
                />
                <span className="method-legend-name">{item.method}</span>
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
