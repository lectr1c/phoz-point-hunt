"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import CreateCouponsAction from "~/features/dashboard/actions/CreateCouponsAction";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateCoupons() {
  const [state, formAction] = useActionState(CreateCouponsAction, {
    title: "",
    description: "",
    success: false,
  });

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.title === "") return;

    toast({
      title: state.title,
      description: state.description,
    });

    if (state.success) {
      router.refresh();
    }
  }, [state, toast, router]);

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Skapa Kuponger</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex h-min flex-col gap-y-2">
          <Label htmlFor="couponAmt">Mängd</Label>
          <Input id="couponWorth" type="number" name="couponAmt" required />
          <Label htmlFor="couponWorth">Värde</Label>
          <Input id="couponWorth" type="number" name="couponWorth" required />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className={
        !pending ? "disabled:cursor-progress disabled:bg-muted disabled:text-muted-foreground" : ""
      }
      type="submit"
    >
      {pending ? "Genererar..." : "Generera"}
    </Button>
  );
}

//Choose Amount
//Points Worth
