"use client";

import { usePathname } from "next/navigation";
import { SignedIn, UserButton } from "@clerk/nextjs";

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
    </div>
  );
}
