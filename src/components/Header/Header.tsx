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
    maxWidth: "1000px",
    margin: "auto",
    padding: "1rem",
    backgroundColor: "#333",
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "0 0 0.5rem 0.5rem",
  };

  const navStyles: CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <header style={headerStyles}>
      <div>{children}</div>
      <nav style={navStyles}>
        {pages.map(
          (page, index) =>
            page.isMenu &&
            (!page.roles ||
              page.roles.includes(role)) && (
              <NavLink key={index} href={page.path}>{page.label}</NavLink>
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
    color: "#fff",
    margin: "0 0.5rem",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.3s ease",
  };
  return (
    <a href={href} style={navLinkStyles} >
      {children}
    </a>
  );
}

export default Header;
