"use client";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { teams, users } from "~/server/db/schema";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { useFormState } from "react-dom";
import registerPoints from "~/app/reg-points/_registerPointsAction";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import DeleteTeamAction from "~/app/dashboard/_components/DeleteTeamAction";
import { Input } from "~/components/ui/input";

export default function TeamTableList({
  teamsQuery,
}: {
  teamsQuery: {
    mainColor: string;
    secondaryColor: string;
    id: number;
    teamName: string;
  }[];
}) {
  const { toast } = useToast();

  const [state, formAction] = useFormState(DeleteTeamAction, {
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
  }, [state]);

  //TODO: Update view to remove row on delete

  return (
    <div className="w-fit">
      <Card className="w-fit p-10 max-[350px]:p-5">
        <Table>
          {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead className="w-[100px]">Användarenamn</TableHead>
              <TableHead className="">Hantera</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamsQuery.map((team) => {
              return (
                <TableRow key={team.id}>
                  <TableCell className="w-fit">
                    <div
                      className="radius h-[16px] w-[16px] rounded-2xl outline outline-4"
                      style={{
                        backgroundColor: team.mainColor,
                        outlineColor: team.secondaryColor,
                      }}
                    ></div>
                  </TableCell>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell className={"font-bold opacity-70"}>
                    <form action={formAction}>
                      <Input
                        type="hidden"
                        name="id"
                        id="id"
                        defaultValue={team.id}
                      />
                      <Button className="bg-red-600">Ta bort</Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
