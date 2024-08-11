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
    margin: "auto",
    padding: "1rem",
    backgroundColor: "rgba(51,51,51,0.31)",
    color: "#000000",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    color: "#000000",
    margin: "0 0.5rem",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.3s ease",
  };
  return (
    <a
      href={href}
      style={navLinkStyles}
      className="bg-amber-500 hover:bg-amber-400"
    >
      {children}
    </a>
  );
}

export default Header;
