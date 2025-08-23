"use client";
import { CSSProperties } from "react";
import { pages } from "./Pages";

export function Header({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const headerStyles: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "auto",
    padding: "1rem 2rem",
    background: "#ffffff",
    color: "#1f2937",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    borderBottom: "1px solid #e5e7eb",
    position: "relative" as const,
  };

  const navStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const logoStyles: CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#dc2626",
  };

  return (
    <header style={headerStyles}>
      <div style={logoStyles}>
        <span>🏁</span>
      </div>
      <div>{children}</div>
      <nav style={navStyles}>
        {pages.map(
          (page, index) =>
            page.isMenu &&
            (!page.roles || page.roles.includes(role)) && (
              <NavLink key={index} href={page.path}>
                {page.label}
              </NavLink>
            ),
        )}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const navLinkStyles: CSSProperties = {
    textDecoration: "none",
    color: "#374151",
    margin: "0 0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    fontWeight: "500",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
  };
  
  return (
    <a
      href={href}
      style={navLinkStyles}
      className="hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
    >
      {children}
    </a>
  );
}

export default Header;
