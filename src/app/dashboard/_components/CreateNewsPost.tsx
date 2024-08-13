"use client";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { useEffect } from "react";
import CreateNewsAction from "~/app/dashboard/_components/CreateNewsAction";
import { Textarea } from "~/components/ui/textarea";

export default function CreateNewsPost() {
  const [state, formAction] = useFormState(CreateNewsAction, {
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
  }, [state, toast]);

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Skapa Nyhet</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="flex h-min w-[95vw] flex-col gap-y-2 sm:w-[70vw]"
        >
          <Label htmlFor="title">Titel</Label>
          <Input id="title" type="text" name="title" required />
          <Label htmlFor="Text">Text</Label>
          <Textarea id="text" name="text" required />
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
        !pending ? "disabled:cursor-progress disabled:bg-slate-600" : ""
      }
      type="submit"
    >
      {pending ? "Skapar..." : "Skapa"}
    </Button>
  );
}

//Choose Amount
//Points Worth
