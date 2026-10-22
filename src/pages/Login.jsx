import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../components/auth/PasswordField";
import "../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = localStorage.getItem("kashflow-theme") || "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function submit(event) {
    event.preventDefault();
    if (!email.trim() || !password) return;
    localStorage.setItem("kashflow-user-email", email.trim());
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/dashboard"><span className="brand-mark">ϟ</span>kashflow.</Link>
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Log in</h1>
        <p>Enter your email and password to continue.</p>
        <label className="auth-field" htmlFor="login-email">
          <span>EMAIL</span>
          <input id="login-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <PasswordField id="login-password" label="PASSWORD" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
        <button className="button primary auth-submit" type="submit">Log in</button>
        <div className="auth-switch">New to Kashflow? <Link to="/signup">Create an account</Link></div>
      </form>
    </main>
  );
}
