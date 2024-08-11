"use client";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast";
import { useFormState, useFormStatus } from "react-dom";
import registerPoints from "~/app/reg-points/_registerPointsAction";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Checkbox } from "~/components/ui/checkbox";

export default function RegisterPointsForm({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { toast } = useToast();

  const [state, formAction] = useFormState(registerPoints, {
    title: "",
    description: "",
    success: false,
  });

  useEffect(() => {
    if (state.title === "") return;

    toast({
      title: state.title,
      description: state.description,
    });

    if (state.success) {
      redirect("/");
    }
  }, [state, toast]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Poäng Registrering</CardTitle>
          <CardDescription>
            Registrera med den koden du fick av oss
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex h-min flex-col gap-y-2">
            {children}
            <Label htmlFor="code">Kod</Label>
            <Input
              id="code"
              name="code"
              placeholder="Points Code"
              defaultValue={params.id}
              required
            />
            <div className="flex items-center space-x-2">
              <Checkbox id="anonymous" name="anonymous" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Registrera poäng anonymt
                </label>
              </div>
            </div>

            <SubmitButton />
          </form>
          <SignedOut>
            <SignInButton>
              <Button className="mt-3 w-full">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </CardContent>
        <CardFooter>
          <SignedIn>
            Koden kan användas bara en gång!
            <SignOutButton>
              <Button className="mt-3 w-full">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>Du kan logga in eller registrera poäng anonymt.</SignedOut>
        </CardFooter>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className={
        !pending ? "disabled:cursor-progress disabled:bg-slate-600" : ""
      }
      type="submit"
    >
      {pending ? "Registrerar..." : "Registrera poäng"}
    </Button>
  );
}
