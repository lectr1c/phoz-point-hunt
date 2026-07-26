import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
            P
          </span>
          Phöz Poäng Jakt
        </div>
        <SignUp
          path="/sign-up"
          appearance={{
            elements: {
              card: "shadow-soft-lg border border-border rounded-xl",
              formButtonPrimary:
                "bg-primary hover:bg-primary/90 text-sm normal-case",
              footerActionLink: "text-accent hover:text-accent/90",
            },
          }}
        />
      </div>
    </div>
  );
}
