import { useEffect, useMemo, useRef, useState } from "react";
import SummaryCards from "../components/transaction/SummaryCards";
import TransactionFilters from "../components/transaction/TransactionFilters";
import TransactionList from "../components/transaction/TransactionList";
import Inspector from "../components/transaction/Inspector";
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import DeleteTransactionModal from "../components/transaction/DeleteTransactionModal";
import { expenseApi } from "../api/expenses.js";
import {
  formatExpenseRecord,
  formatMonth,
  getMonthOptions,
} from "../helper.js";

export default function Transaction() {
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [rows, setRows] = useState([]);
  const [methodCounts, setMethodCounts] = useState({});
  const [summaryStats, setSummaryStats] = useState({
    totalSpend: 0,
    expenseCount: 0,
    topMethod: undefined,
    transactionCount: 0,
  });
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const selectionRequest = useRef(0);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => formatMonth(new Date()));
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [method, setMethod] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showAdd, setShowAdd] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      const filters = {
        search,
        category: category === "all" ? "" : category,
        method: method === "all" ? "" : method,
        sort,
        month: dateRange.start || dateRange.end ? "all" : month,
        startDate: dateRange.start,
        endDate: dateRange.end,
      };
      expenseApi.getAll(filters)
        .then(({ expenses, methodCounts: counts, summaryStats: summary }) => {
          if (!active) return;
          setRows(expenses.map(formatExpenseRecord));
          setMethodCounts(counts ?? {});
          setSummaryStats(summary ?? {
            totalSpend: 0,
            expenseCount: 0,
            topMethod: undefined,
            transactionCount: 0,
          });
        })
        .catch((error) => {
          if (active) console.error("Could not load expenses:", error);
        });
    }, search ? 250 : 0);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [search, category, method, sort, month, dateRange.start, dateRange.end, refreshVersion]);

  useEffect(() => {
    const openModal = () => setShowAdd(true);
    window.addEventListener("kashflow:open-expense-modal", openModal);
    return () => window.removeEventListener("kashflow:open-expense-modal", openModal);
  }, []);

  function clearSelection() {
    selectionRequest.current += 1;
    setSelectedId(null);
    setSelectedTransaction(null);
  }

  function updateSearch(value) {
    clearSelection();
    setSearch(value);
  }

  function updateMethod(value) {
    clearSelection();
    setMethod(value);
  }

  function updateCategory(value) {
    clearSelection();
    setCategory(value);
  }

  function selectMonth(value) {
    clearSelection();
    setMonth(value);
    setDateRange({ start: "", end: "" });
  }

  function updateDateRange(key, value) {
    clearSelection();
    setDateRange((current) => ({ ...current, [key]: value }));
    if (value) setMonth("all");
  }

  async function addTransaction(entry) {
    const { expense } = await expenseApi.add(entry);
    const next = formatExpenseRecord(expense);
    setRows((current) => [next, ...current]);
    selectMonth(monthOptions.includes(next.month) ? next.month : "all");
    setMethod("all");
    setCategory("all");
    setSearch("");
    setSelectedId(next.id);
    setSelectedTransaction(next);
    selectionRequest.current += 1;
    setRefreshVersion((version) => version + 1);
  }

  async function selectTransaction(transactionId) {
    const requestId = ++selectionRequest.current;
    setSelectedId(transactionId);
    setSelectedTransaction(null);

    try {
      const { expense } = await expenseApi.getById(transactionId);
      if (selectionRequest.current === requestId) {
        setSelectedTransaction(formatExpenseRecord(expense));
      }
    } catch (error) {
      if (selectionRequest.current === requestId) {
        setSelectedId(null);
        console.error("Could not load transaction details:", error);
      }
    }
  }

  function closeInspector() {
    selectionRequest.current += 1;
    setSelectedId(null);
    setSelectedTransaction(null);
  }

  async function deleteTransaction() {
    if (!transactionToDelete || isDeleting) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await expenseApi.delete(transactionToDelete.id);
      setRows((current) => current.filter((row) => row.id !== transactionToDelete.id));
      if (selectedId === transactionToDelete.id) closeInspector();
      setRefreshVersion((version) => version + 1);
      setTransactionToDelete(null);
    } catch (error) {
      setDeleteError(error.message || "Could not delete the transaction.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <main className="page-content">
        <section className="page-intro">
          <div>
            <div className="eyebrow">
              <span className="event-count">{rows.length} EVENTS RECORDED</span>
            </div>
            <h1>Transactions Stream</h1>
            <p>
              Search, filter by payment protocol, append rich notes, and audit
              categorical capital velocity across previous cycles.
            </p>
          </div>
          <div className="intro-actions">
            <button className="button secondary">⇧ Export .CSV</button>
            <button className="button primary" onClick={() => setShowAdd(true)}>
              ▤ Log Transaction
            </button>
          </div>
        </section>
        <SummaryCards summary={summaryStats} month={month} dateRange={dateRange} />
        <TransactionFilters
          search={search}
          setSearch={updateSearch}
          month={month}
          setMonth={selectMonth}
          monthOptions={monthOptions}
          dateRange={dateRange}
          methodCounts={methodCounts}
          onDateRangeChange={updateDateRange}
          method={method}
          setMethod={updateMethod}
          category={category}
          setCategory={updateCategory}
          sort={sort}
          setSort={setSort}
        />
        <div className={`content-grid ${selectedTransaction ? "" : "inspector-hidden"}`}>
          <TransactionList
            rows={rows}
            totalTransactions={rows.length}
            selectedId={selectedId}
            onDelete={(transaction) => {
              setDeleteError("");
              setTransactionToDelete(transaction);
            }}
            month={month}
            dateRange={dateRange}
            onSelect={selectTransaction}
          />
          {selectedTransaction && (
            <Inspector
              key={selectedTransaction.id}
              transaction={selectedTransaction}
              onClose={closeInspector}
            />
          )}
        </div>
      </main>
      {showAdd && (
        <AddTransactionModal
          onClose={() => setShowAdd(false)}
          onAdd={addTransaction}
        />
      )}
      {transactionToDelete && (
        <DeleteTransactionModal
          transaction={transactionToDelete}
          isDeleting={isDeleting}
          error={deleteError}
          onCancel={() => setTransactionToDelete(null)}
          onConfirm={deleteTransaction}
        />
      )}
    </>
  );
}
