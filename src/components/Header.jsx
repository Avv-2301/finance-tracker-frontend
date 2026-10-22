import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard", page: "dashboard" },
  { label: "All Transactions", to: "/transaction", page: "transaction" },
];

export default function Header({ onAdd, theme, onToggleTheme, activePage, userEmail, onLogout }) {
  return (
    <header className="topbar">
      <Link className="brand" to="/dashboard">
        <span className="brand-mark">ϟ</span>
        <span>kashflow.</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          item.to ? (
            <Link
              key={item.page}
              className={`nav-item${activePage === item.page ? " active" : ""}`}
              to={item.to}
              aria-current={activePage === item.page ? "page" : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <button key={item.page} className="nav-item" type="button">
              {item.label}
            </button>
          )
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        {userEmail ? (
          <div className="account-section">
            <div className="avatar" title={userEmail}>
              {userEmail.slice(0, 2).toUpperCase()}
            </div>
            <span className="account-email">{userEmail}</span>
            <button className="account-logout" type="button" onClick={onLogout}>Log out</button>
            <button className="button primary" onClick={onAdd}>＋ Add Finance</button>
          </div>
        ) : (
          <div className="header-auth-actions">
            <Link className="button secondary" to="/login">Log in</Link>
            <Link className="button primary" to="/signup">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
