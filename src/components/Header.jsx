import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard", page: "dashboard" },
  { label: "All Transactions", to: "/transaction", page: "transaction" },
];

export default function Header({ onAdd, theme, onToggleTheme, activePage, user, isAuthInitializing, onLogout }) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (!isProfileMenuOpen) return undefined;

    function closeOnOutsideClick(event) {
      if (!profileMenuRef.current?.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isProfileMenuOpen]);

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
        {isAuthInitializing ? null : user ? (
          <div className="account-section" aria-label="Profile section">
            <div className="profile-menu-anchor" ref={profileMenuRef}>
              <button
                className="avatar profile-trigger"
                type="button"
                title="Open profile menu"
                aria-label="Open profile menu"
                aria-expanded={isProfileMenuOpen}
                aria-controls="profile-menu"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5.5 20c.4-3.7 2.7-5.8 6.5-5.8s6.1 2.1 6.5 5.8" />
                </svg>
              </button>
              {isProfileMenuOpen && (
                <div className="profile-menu" id="profile-menu">
                  <span className="profile-menu-label">Signed in as</span>
                  <span className="profile-menu-email">{user.email}</span>
                  <button
                    className="profile-menu-logout"
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
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
