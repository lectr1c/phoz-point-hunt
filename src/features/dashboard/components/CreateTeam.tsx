"use client";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import CreateTeamAction from "~/features/dashboard/actions/CreateTeamAction";
import { useToast } from "~/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { SketchPicker } from "react-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function CreateTeam() {
  const [state, formAction] = useFormState(CreateTeamAction, {
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

  const [mainColor, setMainColor] = useState("#F00");
  const [secondaryColor, setSecondaryColor] = useState("#00F");

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Skapa Lag</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex h-min flex-col gap-y-2">
          <Label htmlFor="teamname">Lagnamn</Label>
          <Input
            id="teamname"
            name="teamname"
            placeholder="Fx-jägarna"
            required
          />
          <Label>Primär lag färg</Label>
          <Popover>
            <PopoverTrigger
              type={"button"}
              className="h-[36px] w-full rounded-[0.5rem]"
              style={{
                backgroundColor: mainColor,
              }}
            ></PopoverTrigger>
            <PopoverContent className="w-fit">
              <SketchPicker
                color={mainColor}
                onChange={(color) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
                  setMainColor(color.hex);
                }}
              />
            </PopoverContent>
          </Popover>
          <Label>Sekundär lag färg</Label>
          <Popover>
            <PopoverTrigger
              type={"button"}
              className="h-[36px] w-full rounded-[0.5rem]"
              style={{
                backgroundColor: secondaryColor,
              }}
            ></PopoverTrigger>
            <PopoverContent className="w-fit">
              <SketchPicker
                color={secondaryColor}
                onChange={(color) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
                  setSecondaryColor(color.hex);
                }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="hidden"
            id="mainColor"
            name="mainColor"
            defaultValue={mainColor}
          />
          <Input
            type="hidden"
            id="secondaryColor"
            name="secondaryColor"
            defaultValue={secondaryColor}
          />
          <SubmitButton />
        </form>
        <div
          className="mt-10 h-[36px] w-full rounded-[0.5rem] bg-blue-800"
          style={{
            outline: `solid 6px ${secondaryColor}`,
            backgroundColor: `${mainColor}`,
          }}
        ></div>
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
      {pending ? "Genererar..." : "Generera"}
    </Button>
  );
}
