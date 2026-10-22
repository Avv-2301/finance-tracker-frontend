import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordField from "../components/auth/PasswordField";
import "../App.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const theme = localStorage.getItem("kashflow-theme") || "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function submit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    localStorage.setItem("kashflow-user-email", email.trim());
    navigate("/dashboard");
  }

  return (
    <main className="auth-page">
      <Link className="auth-brand" to="/dashboard"><span className="brand-mark">ϟ</span>kashflow.</Link>
      <form className="auth-card" onSubmit={submit}>
        <div className="eyebrow">GET STARTED</div>
        <h1>Create your account</h1>
        <p>Sign up to start keeping track of your finances.</p>
        <label className="auth-field" htmlFor="signup-email">
          <span>EMAIL</span>
          <input id="signup-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <PasswordField id="signup-password" label="PASSWORD" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
        <PasswordField id="confirm-password" label="CONFIRM PASSWORD" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="button primary auth-submit" type="submit">Sign up</button>
        <div className="auth-switch">Already have an account? <Link to="/login">Log in</Link></div>
      </form>
    </main>
  );
}
