import { formatRupees } from "../../services/helper";

export default function ExpenseBarChart({ months }) {
  const maxSpend = Math.max(...months.map((item) => item.spend), 0);

  return (
    <article className="dashboard-chart-card">
      <div className="dashboard-chart-heading">
        <div>
          <span className="dashboard-kicker">SPENDING TREND</span>
          <h2>Expenses over time</h2>
        </div>
        <span className="chart-period">LAST 6 MONTHS</span>
      </div>
      <div className="bar-chart" role="img" aria-label="Bar chart of expenses over the last six months">
        {months.map((item) => {
          const barHeight = maxSpend ? Math.max((item.spend / maxSpend) * 100, item.spend ? 5 : 0) : 0;
          return (
            <div className="bar-chart-column" key={item.month}>
              <div className="bar-chart-value">{item.spend ? formatRupees(item.spend) : "—"}</div>
              <div className="bar-chart-track">
                <div className="bar-chart-bar" style={{ height: `${barHeight}%` }} />
              </div>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
