import { formatRupees } from "../../helper.js";

export default function SummaryCards({ summary, month, dateRange }) {
  const { totalSpend, expenseCount, topMethod, transactionCount } = summary;

  return (
    <section className="summary-grid" aria-label="Transaction summary">
      <article className="summary-card outflow">
        <div className="summary-label">
          TOTAL SPEND ·{" "}
          {dateRange.start || dateRange.end
            ? "DATE RANGE"
            : month === "all"
            ? "ALL MONTHS"
            : month.toUpperCase()}{" "}
          <span>▣</span>
        </div>
        <div className="summary-value">{formatRupees(totalSpend)}</div>
        <div className="summary-foot">
          <span>
            {expenseCount}{" "}
            EXPENSE TRANSACTIONS
          </span>
        </div>
      </article>
      <article className="summary-card rail">
        <div className="summary-label">
          MOST USED METHOD <span>ϟ</span>
        </div>
        <div className="rail-stat">
          <strong>{topMethod?.[0] || "No transactions"}</strong>
          <b>{formatRupees(topMethod?.[1].spend || 0)}</b>
        </div>
        <div className="summary-foot">
          <span>SPEND BY METHOD</span>
          <span>{topMethod?.[1].count || 0} TXNS</span>
        </div>
      </article>
      <article className="summary-card context">
        <div className="summary-label">
          TOTAL TRANSACTIONS <span>▣</span>
        </div>
        <div className="context-stat">
          <strong>{transactionCount}</strong>
          <b>transactions</b>
        </div>
        <div className="summary-foot">
          <span>
            {dateRange.start || dateRange.end
              ? "DATE RANGE"
              : month === "all"
              ? "ALL MONTHS"
              : month.toUpperCase()}
          </span>
        </div>
      </article>
    </section>
  );
}
