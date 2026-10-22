import { useState } from "react";
import { expenseCategories } from "../../data/categories";
import { getLocalDateInputValue } from "../../services/helper";

const paymentMethods = ["UPI", "Debit Card", "Credit Card", "Cash"];

export default function AddTransactionModal({ onClose, onAdd }) {
  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState(expenseCategories[0]);
  const [date, setDate] = useState(() => getLocalDateInputValue());
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");
  const [note, setNote] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!merchant.trim() || !date || !amount || Number(amount) <= 0) return;
    onAdd({
      merchant: merchant.trim(),
      category,
      date,
      amount: -Math.abs(Number(amount)),
      method,
      note: note.trim(),
    });
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form className="add-modal" onSubmit={submit}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW EXPENSE</span>
            <h2>Add expense</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <label>
          EXPENSE NAME
          <input
            autoFocus
            required
            value={merchant}
            onChange={(event) => setMerchant(event.target.value)}
            placeholder="e.g. Blue Tokai Coffee"
          />
        </label>
        <label>
          CATEGORY
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {expenseCategories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          DATE
          <input
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <small className="time-hint">
            Time is recorded when you add the expense.
          </small>
        </label>
        <label>
          PAYMENT METHOD
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
          >
            {paymentMethods.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          NOTE (OPTIONAL)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add a note if you want"
          />
        </label>
        <label>
          AMOUNT (INR)
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
          />
        </label>
        <button className="button primary modal-submit">Add expense</button>
      </form>
    </div>
  );
}
