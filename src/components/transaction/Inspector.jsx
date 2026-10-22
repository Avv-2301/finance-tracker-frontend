import { formatTransactionAmount } from "../../helper.js";

export default function Inspector({ transaction, onClose }) {
  return (
    <aside className="inspector" id="inspector">
      <div className="inspector-heading">
        <h2>
          <span>☷</span> Transaction Detail
        </h2>
        <button onClick={onClose} aria-label="Close transaction details">
          ×
        </button>
      </div>

      <div className="selected-txn">
        <i className={`merchant-icon ${transaction.tint}`}>
          {transaction.icon}
        </i>
        <div>
          <strong>{transaction.merchant}</strong>
          <small>{transaction.date}</small>
        </div>
        <div className="selected-amount">
          <b>{formatTransactionAmount(transaction.amount)}</b>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="form-label">CATEGORY</span>
          <strong>{transaction.category}</strong>
        </div>
        <div className="detail-item">
          <span className="form-label">PAYMENT METHOD</span>
          <strong>{transaction.methodDetail}</strong>
        </div>
        <div className="detail-item">
          <span className="form-label">TRANSACTION ID</span>
          <strong>{transaction.id}</strong>
        </div>
      </div>

      <section className="detail-section">
        <h3 className="form-label">TRANSACTION NOTE</h3>
        <p className="detail-note">{transaction.note || "No note added."}</p>
      </section>
    </aside>
  );
}
