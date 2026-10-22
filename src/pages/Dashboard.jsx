import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseBarChart from "../components/dashboard/ExpenseBarChart";
import ExpenseCategoryChart from "../components/dashboard/ExpenseCategoryChart";
import ExpenseMethodChart from "../components/dashboard/ExpenseMethodChart";
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import { expenseApi } from "../api/expenses.js";
import {
  getMonthOptions,
  formatMonth,
} from "../helper.js";
export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    months: [], methods: [], methodTotal: 0, categories: [], categoryTotal: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [selectedMethodMonth, setSelectedMethodMonth] = useState(() =>
    formatMonth(new Date())
  );
  const [selectedCategoryMonth, setSelectedCategoryMonth] = useState(() =>
    formatMonth(new Date())
  );
  useEffect(() => {
    let active = true;
    expenseApi
      .getDashboardAnalytics({
        trendMonth: formatMonth(new Date()),
        methodMonth: selectedMethodMonth,
        categoryMonth: selectedCategoryMonth,
      })
      .then((data) => {
        if (active) setAnalytics(data);
      })
      .catch((error) => console.error("Could not load dashboard analytics:", error));
    return () => {
      active = false;
    };
  }, [selectedMethodMonth, selectedCategoryMonth, refreshKey]);

  useEffect(() => {
    const openModal = () => setShowAddExpense(true);
    window.addEventListener("kashflow:open-expense-modal", openModal);
    return () =>
      window.removeEventListener("kashflow:open-expense-modal", openModal);
  }, []);

  function goToTransactions() {
    navigate("/transaction");
  }

  async function addExpense(entry) {
    await expenseApi.add(entry);
    setRefreshKey((current) => current + 1);
  }

  return (
    <>
      <main className="page-content dashboard-content">
        <section className="page-intro">
          <div>
            <div className="eyebrow">
              <span className="event-count">FINANCIAL OVERVIEW</span>
            </div>
            <h1>Dashboard</h1>
            <p>
              Your spending at a glance, with monthly trends and payment method
              breakdown.
            </p>
          </div>
          <div className="intro-actions">
            <button
              className="button primary"
              onClick={() => setShowAddExpense(true)}
            >
              ＋ Add Expense
            </button>
            <button className="button secondary" onClick={goToTransactions}>
              Detailed Transactions
            </button>
          </div>
        </section>

        <section className="dashboard-chart-grid" aria-label="Expense charts">
          <ExpenseBarChart months={analytics.months} />
          <ExpenseMethodChart
            methods={analytics.methods}
            totalSpend={analytics.methodTotal}
            month={selectedMethodMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedMethodMonth}
          />
          <ExpenseCategoryChart
            categories={analytics.categories}
            totalSpend={analytics.categoryTotal}
            month={selectedCategoryMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedCategoryMonth}
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
