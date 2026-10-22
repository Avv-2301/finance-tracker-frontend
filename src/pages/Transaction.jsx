import { useEffect, useMemo, useState } from "react";
import SummaryCards from "../components/transaction/SummaryCards";
import TransactionFilters from "../components/transaction/TransactionFilters";
import TransactionList from "../components/transaction/TransactionList";
import Inspector from "../components/transaction/Inspector";
import AddTransactionModal from "../components/transaction/AddTransactionModal";
import {
  createTransaction,
  filterTransactions,
  formatMonth,
  getMonthOptions,
  loadTransactions,
} from "../services/helper";

export default function Transaction() {
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const [rows, setRows] = useState(() => loadTransactions());
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => formatMonth(new Date()));
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [method, setMethod] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showAdd, setShowAdd] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem("kashflow-transactions", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    const openModal = () => setShowAdd(true);
    window.addEventListener("kashflow:open-expense-modal", openModal);
    return () => window.removeEventListener("kashflow:open-expense-modal", openModal);
  }, []);

  function selectMonth(value) {
    setMonth(value);
    setDateRange({ start: "", end: "" });
  }

  function updateDateRange(key, value) {
    setDateRange((current) => ({ ...current, [key]: value }));
    if (value) setMonth("all");
  }

  const filteredRows = useMemo(
    () => filterTransactions({ transactions: rows, month, dateRange, search, method, category, sort }),
    [rows, search, month, dateRange, method, category, sort]
  );

  const selected = rows.find((txn) => txn.id === selectedId) || rows[0];

  function addTransaction(entry) {
    const next = createTransaction(entry);
    setRows((current) => [next, ...current]);
    setSelectedId(next.id);
    selectMonth(monthOptions.includes(next.month) ? next.month : "all");
    setMethod("all");
    setCategory("all");
    setSearch("");
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
        <SummaryCards transactions={rows} month={month} dateRange={dateRange} />
        <TransactionFilters
          search={search}
          setSearch={setSearch}
          month={month}
          setMonth={selectMonth}
          monthOptions={monthOptions}
          dateRange={dateRange}
          transactions={rows}
          onDateRangeChange={updateDateRange}
          method={method}
          setMethod={setMethod}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />
        <div className={`content-grid ${inspectorOpen ? "" : "inspector-hidden"}`}>
          <TransactionList
            rows={filteredRows}
            totalTransactions={rows.length}
            selectedId={selectedId}
            month={month}
            dateRange={dateRange}
            onSelect={(id) => {
              setSelectedId(id);
              setInspectorOpen(true);
            }}
          />
          {inspectorOpen && selected && (
            <Inspector
              key={selected.id}
              transaction={selected}
              onClose={() => setInspectorOpen(false)}
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
    </>
  );
}
