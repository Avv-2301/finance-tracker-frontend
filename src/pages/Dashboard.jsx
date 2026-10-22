import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseBarChart from "../components/dashboard/ExpenseBarChart";
import ExpenseMethodChart from "../components/dashboard/ExpenseMethodChart";
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import {
  createTransaction,
  getExpenseByMethod,
  getLastSixMonthExpenses,
  getMonthOptions,
  loadTransactions,
  formatMonth,
} from "../services/helper";
export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState(() => loadTransactions());
  const [showAddExpense, setShowAddExpense] = useState(false);
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [selectedMonth, setSelectedMonth] = useState(() => formatMonth(new Date()));
  const months = useMemo(() => getLastSixMonthExpenses(transactions), [transactions]);
  const methods = useMemo(() => getExpenseByMethod(transactions, selectedMonth), [transactions, selectedMonth]);

  useEffect(() => {
    const openModal = () => setShowAddExpense(true);
    window.addEventListener("kashflow:open-expense-modal", openModal);
    return () => window.removeEventListener("kashflow:open-expense-modal", openModal);
  }, []);

  function goToTransactions() {
    navigate("/transaction");
  }

  function addExpense(entry) {
    const updatedTransactions = [createTransaction(entry), ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem("kashflow-transactions", JSON.stringify(updatedTransactions));
  }

  return (
    <>
      <main className="page-content dashboard-content">
        <section className="page-intro">
          <div>
            <div className="eyebrow"><span className="event-count">FINANCIAL OVERVIEW</span></div>
            <h1>Dashboard</h1>
            <p>Your spending at a glance, with monthly trends and payment method breakdown.</p>
          </div>
          <div className="intro-actions">
            <button className="button primary" onClick={() => setShowAddExpense(true)}>
              ＋ Add Expense
            </button>
            <button className="button secondary" onClick={goToTransactions}>
              Detailed Transactions
            </button>
          </div>
        </section>

        <section className="dashboard-chart-grid" aria-label="Expense charts">
          <ExpenseBarChart months={months} />
          <ExpenseMethodChart
            methods={methods}
            month={selectedMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedMonth}
          />
        </section>
      </main>
      {showAddExpense && (
        <AddTransactionModal
          onClose={() => setShowAddExpense(false)}
          onAdd={addExpense}
        />
      )}
    </>
  );
}
