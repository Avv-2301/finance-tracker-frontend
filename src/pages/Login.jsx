import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PasswordField from "../components/auth/PasswordField";
import { useAuthStore } from "../store/authStore";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);
  const theme = localStorage.getItem("kashflow-theme") || "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  async function submit(event) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    setError("");
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(location.state?.from?.pathname ?? "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/dashboard">
        <span className="brand-mark">ϟ</span>kashflow.
      </Link>
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Log in</h1>
        <p>Enter your email and password to continue.</p>
        <label className="auth-field" htmlFor="login-email">
          <span>EMAIL</span>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <PasswordField
          id="login-password"
          label="PASSWORD"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button primary auth-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
        <div className="auth-switch">
          New to Kashflow? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </main>
  );
}
