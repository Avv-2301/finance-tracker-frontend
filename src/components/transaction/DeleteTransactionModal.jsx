import { formatTransactionAmount } from "../../helper.js";

export default function DeleteTransactionModal({
  transaction,
  isDeleting,
  error,
  onCancel,
  onConfirm,
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && !isDeleting && onCancel()}
    >
      <section
        className="add-modal confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-transaction-title"
        aria-describedby="delete-transaction-description"
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">DELETE TRANSACTION</span>
            <h2 id="delete-transaction-title">Confirm deletion</h2>
          </div>
          <button type="button" onClick={onCancel} disabled={isDeleting} aria-label="Close">
            ×
          </button>
        </div>
        <p id="delete-transaction-description">
          Delete <strong>{transaction.merchant}</strong> ({formatTransactionAmount(transaction.amount)})? This action cannot be undone.
        </p>
        {error && <p className="delete-error" role="alert">{error}</p>}
        <div className="confirm-actions">
          <button className="button secondary" type="button" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="button danger" type="button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting…" : "Delete transaction"}
          </button>
        </div>
      </section>
    </div>
  );
}
