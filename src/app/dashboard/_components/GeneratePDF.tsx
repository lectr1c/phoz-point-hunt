"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import GeneratePDFAction from "~/app/dashboard/_components/GeneratePDFAction";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";
import { TCoupon } from "~/server/types";

export default function GeneratePDF({
  unExportedCoupons,
}: {
  unExportedCoupons: number;
}) {
  const [state, formAction] = useFormState(GeneratePDFAction, {
    title: "",
    description: "",
    success: false,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (state.title === "") return;

    toast({
      title: state.title,
      description: state.description,
    });
  }, [state]);

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Kuponger PDF</CardTitle>
        <CardDescription>Max 96st åt gången</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex h-min flex-col gap-y-2">
          <SubmitButton />
        </form>
        {state.downloadLink ? (
          <a href={state.downloadLink}>
            <Button className="mt-2 bg-green-600 hover:bg-green-500">
              Ladda ner PDF:en
            </Button>
          </a>
        ) : (
          <></>
        )}
      </CardContent>
      <CardFooter>Kvar att exportera: {unExportedCoupons}</CardFooter>
    </Card>
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
      {pending ? "Genererar..." : "Generera"}
    </Button>
  );
}
