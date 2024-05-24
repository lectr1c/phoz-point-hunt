"use client";
import { useState } from "react";
import { pages } from "./Pages";
import { Hamburger } from "./assets/Hamburger";

export function Header({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 mx-auto flex max-w-4xl flex-row items-center rounded-b-md bg-gray-800 p-4 text-white shadow-md">
      <div className="flex-1">{children}</div>
      <button
        className="ml-auto p-2 lg:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Hamburger isOpen={menuOpen} />
      </button>
      <nav
        className={`${
          menuOpen ? "max-h-96" : "max-h-0"
        } transition-max-height overflow-hidden duration-500 ease-in-out lg:ml-auto lg:flex lg:max-h-none lg:items-center`}
      >
        <div
          className={`${menuOpen ? "block" : "hidden"} lg:flex lg:items-center`}
        >
          {pages.map(
            (page, index) =>
              page.isMenu &&
              (!page.roles || page.roles.includes(role)) && (
                <NavLink key={index} href={page.path}>
                  {page.label}
                </NavLink>
              ),
          )}
        </div>
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
  return (
    <a
      href={href}
      className="mx-2 block rounded p-2 text-white transition-colors duration-300 hover:bg-gray-700 lg:inline-block"
    >
      {children}
    </a>
  );
}

export default Header;
