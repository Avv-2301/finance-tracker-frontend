import { formatTransactionAmount } from "../../services/helper";

export default function TransactionList({ rows, totalTransactions, selectedId, onSelect, month, dateRange }) {
  return (
    <section className="list-wrap">
      <div className="list-head">
        <span>TRANSACTION / ENTITY</span>
        <span>PAYMENT RAIL</span>
        <span>CONTEXTUAL MEMO & TAGS</span>
        <span>MAGNITUDE</span>
      </div>
      <div className="transaction-list">
        {rows.map((txn) => (
          <button
            key={txn.id}
            className={`transaction-row ${
              selectedId === txn.id ? "is-selected" : ""
            }`}
            onClick={() => onSelect(txn.id)}
          >
            <span className="entity">
              <i className={`merchant-icon ${txn.tint}`}>{txn.icon}</i>
              <span className="entity-copy">
                <strong>{txn.merchant}</strong>
                <small>
                  {txn.category}
                  <b>·</b>
                  {txn.date}
                </small>
              </span>
            </span>
            <span className={`payment-chip ${txn.tint}`}>
              {txn.methodDetail}
            </span>
            <span className="memo">
              <span className="memo-line">
                ≡ <i>“{txn.note.split("#")[0].trim()}”</i>
              </span>
              <span className="tags">
                {txn.tags.map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
                {txn.receipt && <em>▣ Receipt Attached</em>}
              </span>
            </span>
            <span className="amount">
              <strong className={txn.amount > 0 ? "income" : ""}>
                {formatTransactionAmount(txn.amount)}
              </strong>
              <small className={txn.status === "Pending" ? "pending" : ""}>
                {txn.status}
              </small>
            </span>
          </button>
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
