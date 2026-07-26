"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import SignButton from "~/components/common/SignButton";
import { pages } from "./Pages";

export function Header({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <header className="dark sticky top-0 z-40 border-b border-border/80 bg-background/60 text-foreground backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-sm text-accent-foreground">
            P
          </span>
          Phöz Poäng Jakt
        </Link>

        <nav className="flex items-center gap-1">
          {pages.map(
            (page, index) =>
              page.isMenu &&
              (!page.roles || page.roles.includes(role)) && (
                <NavLink key={index} href={page.path} active={pathname === page.path}>
                  {page.label}
                </NavLink>
              ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <SignButton />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export default Header;
