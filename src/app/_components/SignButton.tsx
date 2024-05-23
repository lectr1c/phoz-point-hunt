"use client";

import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function SignButton() {
  const pathname = usePathname();

  if (
    pathname.includes("sign-in") ||
    pathname.includes("sign-up") ||
    pathname.includes("reg-points")
  )
    return <></>;

  return (
    <div className="flex gap-2 p-2">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
      </SignedOut>
    </div>
  );
}
