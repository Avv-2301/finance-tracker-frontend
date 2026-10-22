import { formatRupees } from "../../services/helper";

const chartColors = ["#ccff00", "#4cd7f6", "#d0bcff", "#ff9f6e", "#ff6b8a"];

export default function ExpenseMethodChart({ methods, month, monthOptions, onMonthChange }) {
  const totalSpend = methods.reduce((total, item) => total + item.amount, 0);
  let gradientOffset = 0;
  const gradient = methods.length
    ? methods.map((item, index) => {
      const start = gradientOffset;
      gradientOffset += (item.amount / totalSpend) * 100;
      return `${chartColors[index % chartColors.length]} ${start}% ${gradientOffset}%`;
    }).join(", ")
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
          <select value={month} onChange={(event) => onMonthChange(event.target.value)} aria-label="Choose pie chart month">
            {monthOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <div className="method-chart-content">
        <div
          className={`method-donut${methods.length ? "" : " is-empty"}`}
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label={methods.length ? `Current month expenses by payment method, total ${formatRupees(totalSpend)}` : "No current month expenses"}
        >
          <div className="method-donut-center">
            <span>TOTAL SPENT</span>
            <strong>{formatRupees(totalSpend)}</strong>
          </div>
        </div>
        <div className="method-legend">
          {methods.length ? methods.map((item, index) => (
            <div className="method-legend-item" key={item.method}>
              <span className="method-legend-dot" style={{ background: chartColors[index % chartColors.length] }} />
              <span className="method-legend-name">{item.method}</span>
              <strong>{formatRupees(item.amount)}</strong>
            </div>
          )) : <p className="chart-empty">No expenses recorded this month yet.</p>}
        </div>
      </div>
    </article>
  );
}
