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

export default async function UserTableList() {
  const usersQuery = await db
    .select()
    .from(users)
    .innerJoin(teams, eq(teams.id, users.teamId));

  return (
    <div className="w-fit">
      <Card className=" p-10 max-[350px]:p-5">
        <Table>
          {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead className="w-max-[100px]">Användarenamn</TableHead>
              <TableHead>Roll</TableHead>
              <TableHead className="">Lag</TableHead>
              <TableHead className="">Hantera</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.map((user) => {
              return (
                <TableRow key={user.users.id}>
                  <TableCell className="w-fit">
                    <div
                      className="radius h-[16px] w-[16px] rounded-2xl outline outline-4"
                      style={{
                        backgroundColor: user.teams.mainColor,
                        outlineColor: user.teams.secondaryColor,
                      }}
                    ></div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.users.username}
                  </TableCell>
                  <TableCell className={"font-bold opacity-70"}>
                    {user.users.role}
                  </TableCell>
                  <TableCell className={"font-bold opacity-70"}>
                    {user.teams.teamName}
                  </TableCell>
                  <TableCell className={"font-bold opacity-70"}>
                    <Button className="mr-5">Sätt som fadder</Button>
                    <Button className="bg-red-600">Ta bort</Button>
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
