import { Link, useNavigate } from "@tanstack/react-router";
import {
  FolderOpen,
  Inbox,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Shapes,
  Sparkles,
  X,
  PenLine,
} from "lucide-react";
import { useState } from "react";

import { logoutAdminFn } from "../lib/cms/server-fns";

type AdminNavKey = "dashboard" | "projects" | "add" | "categories" | "pricing" | "inquiries" | "blog" | "settings";

type AdminShellProps = {
  current: AdminNavKey;
  title: string;
  subtitle?: string;
  sessionEmail?: string;
  children: React.ReactNode;
};

type NavItem = {
  key: AdminNavKey;
  label: string;
  to: string;
  Icon: typeof LayoutDashboard;
};

const navGroups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "Overview",
    items: [{ key: "dashboard", label: "Dashboard", to: "/dashboard", Icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { key: "projects", label: "Projects", to: "/projects", Icon: FolderOpen },
      { key: "add", label: "Add Project", to: "/projects/new", Icon: PlusCircle },
      { key: "blog", label: "Blog", to: "/blog", Icon: PenLine },
      { key: "categories", label: "Categories", to: "/categories", Icon: Shapes },
    ],
  },
  {
    label: "Business",
    items: [
      { key: "pricing", label: "Pricing", to: "/pricing", Icon: IndianRupee },
      { key: "inquiries", label: "Inquiries", to: "/inquiries", Icon: Inbox },
    ],
  },
  {
    label: "System",
    items: [{ key: "settings", label: "Settings", to: "/settings", Icon: Settings }],
  },
];

function initialsFromEmail(email: string) {
  const name = email.split("@")[0] ?? email;
  const parts = name.split(/[._-]+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "A";
}

export function AdminShell({ current, title, subtitle, sessionEmail, children }: AdminShellProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const email = sessionEmail ?? "admin@cyrux.local";
  const initials = initialsFromEmail(email);
  const showQuickAdd = current !== "add";

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAdminFn({ data: undefined });
      await navigate({ to: "/login" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="admin-app-root">
      {mobileOpen ? (
        <button
          type="button"
          className="admin-sidebar-scrim"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="admin-brand-row">
          <span className="admin-brand-mark" aria-hidden="true">
            C
          </span>
          <span className="admin-brand-copy">
            <span className="admin-brand-label">CYRUX</span>
            <span className="admin-brand-subtitle">Private CMS</span>
          </span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navGroups.map((group) => (
            <div className="admin-nav-group" key={group.label}>
              <p className="admin-nav-group-label">{group.label}</p>
              {group.items.map(({ key, label, to, Icon }) => (
                <Link
                  key={key}
                  to={to}
                  className={`admin-nav-link ${current === key ? "is-active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="admin-nav-icon" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <span className="admin-nav-label">{label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <span className="admin-user-avatar" aria-hidden="true">
              {initials}
            </span>
            <span className="admin-user-meta">
              <span className="admin-user-name">Administrator</span>
              <span className="admin-session-email" title={email}>
                {email}
              </span>
            </span>
          </div>
          <button type="button" className="admin-logout-btn" onClick={onLogout} disabled={loggingOut}>
            <LogOut size={15} />
            <span>{loggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </aside>

      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-mobile-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle admin navigation"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="admin-topbar-heading">
            <h1 className="admin-page-title">{title}</h1>
            {subtitle ? <p className="admin-page-subtitle">{subtitle}</p> : null}
          </div>

          {showQuickAdd ? (
            <div className="admin-topbar-actions">
              <Link to="/projects/new" className="admin-topbar-action">
                <Sparkles size={15} />
                <span className="admin-topbar-action-label">New project</span>
              </Link>
            </div>
          ) : null}
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
