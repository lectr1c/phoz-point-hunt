"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useToast } from "~/components/ui/use-toast";
import { useEffect, useState } from "react";
import type { TTeam } from "~/types/types";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import RegisterPointsManAction from "~/features/dashboard/actions/RegisterPointsManAction";
import { Card } from "~/components/ui/card";
import { redirect } from "next/navigation";

export default function RegisterPointsManually({ teams }: { teams: TTeam[] }) {
  const [state, formAction] = useFormState(RegisterPointsManAction, {
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

    if (state.success) {
      redirect("/");
    }
  }, [state, toast]);

  const [date, setDate] = useState(new Date());

  return (
    <Card className={"w-[300px] p-3"}>
      <form action={formAction}>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="team">Lag</Label>
          <Select name="team" required>
            <SelectTrigger>
              <SelectValue placeholder="Välj Lag" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.teamName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Label htmlFor="couponWorth">Poäng</Label>
        <Input id="couponWorth" type="number" name="couponWorth" required />
        <SubmitButton />
      </form>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className={
        !pending ? "mt-3 disabled:cursor-progress disabled:bg-slate-600" : ""
      }
      type="submit"
    >
      {pending ? "Registrerar..." : "Registrera"}
    </Button>
  );
}
