import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

import { redirectIfAdmin } from "../lib/cms/admin-guard";
import { loginAdminFn } from "../lib/cms/server-fns";

export const Route = createFileRoute("/login")({
  beforeLoad: redirectIfAdmin,
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      await loginAdminFn({ data: { email, password } });
      await navigate({ to: "/dashboard" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-login-mark" aria-hidden="true">
            C
          </span>
          <span className="admin-login-brand-text">
            <span className="admin-login-brand-name">CYRUX</span>
            <span className="admin-login-brand-sub">Private CMS</span>
          </span>
        </div>

        <h1>Welcome back</h1>
        <p className="admin-login-subtitle">Sign in to manage projects and publishing.</p>

        <form onSubmit={onSubmit} className="admin-login-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              placeholder="admin@cyrux.local"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? <p className="admin-login-error">{error}</p> : null}

          <button type="submit" className="admin-primary-btn" disabled={loading}>
            <LogIn size={15} />
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        <p className="admin-login-footnote">Restricted access — authorised administrators only.</p>
      </div>
    </div>
  );
}
