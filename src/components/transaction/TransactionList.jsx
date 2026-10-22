import { formatTransactionAmount } from "../../helper.js";

export default function TransactionList({ rows, totalTransactions, selectedId, onSelect, onDelete, month, dateRange }) {
  return (
    <section className="list-wrap">
      <div className="list-head">
        <span>TRANSACTION</span>
        <span>PAYMENT METHOD</span>
        <span>TRANSACTION NOTE</span>
        <span>AMOUNT</span>
        <span>ACTION</span>
      </div>
      <div className="transaction-list">
        {rows.map((txn) => (
          <div
            key={txn.id}
            className={`transaction-row ${
              selectedId === txn.id ? "is-selected" : ""
            }`}
            onClick={() => onSelect(txn.id)}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(txn.id);
              }
            }}
            role="group"
            tabIndex={0}
            aria-label={`${txn.merchant} transaction`}
          >
            <span className="entity">
              <i className={`merchant-icon ${txn.tint}`}>{txn.icon}</i>
              <span className="entity-copy">
                <strong>{txn.merchant}</strong>
                <small>
                  {txn.category}
                  <b>·</b>
                  {txn.dateOnly || txn.date}
                </small>
              </span>
            </span>
            <span className={`payment-chip ${txn.tint}`}>
              {txn.methodDetail}
            </span>
            <span className="memo">
              <span className="memo-line">
                <i>{txn.note?.trim() || "No note"}</i>
              </span>
            </span>
            <span className="amount">
              <strong>{formatTransactionAmount(txn.amount)}</strong>
            </span>
            <button
              className="transaction-delete"
              type="button"
              aria-label={`Delete ${txn.merchant} transaction`}
              title="Delete transaction"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(txn);
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="empty-state">
          <strong>{totalTransactions === 0 ? "No expenses yet" : "No transactions found"}</strong>
          <span>{totalTransactions === 0
            ? "Add your first expense to see it here."
            : "Try changing your search or filters."}</span>
        </div>
      ) : (
        <div className="list-pagination">
          <span>
            SHOWING {rows.length} TRANSACTIONS · {dateRange.start || dateRange.end
              ? "DATE RANGE"
              : month === "all"
                ? "ALL MONTHS"
                : month.toUpperCase()}
          </span>
          <div>
            ‹ <b>1</b> ›
          </div>
        </div>
      )}
    </section>
  );
}
