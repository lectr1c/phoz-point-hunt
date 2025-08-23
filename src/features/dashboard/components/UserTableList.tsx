"use client";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import TeamColorCircle from "~/components/common/TeamColorCircle";
import DropDownButton from "~/components/common/DropDownButton";
import UserActionsForm from "~/features/dashboard/components/UserActionsForm";

export default function UserTableList({
  usersQuery,
}: {
  usersQuery: {
    users: {
      id: string;
      role: "nollan" | "fadder" | "ansvarig" | "phöz" | null;
      teamId: number | null;
      username: string | null;
    };
    teams: {
      id: number;
      teamName: string;
      mainColor: string;
      secondaryColor: string;
    };
  }[];
}) {
  return (
    <Card className="w-fit p-10 max-[350px]:p-5">
      <Table>
        {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
        <TableHeader>
          <TableRow>
            <TableHead className="w-max-[100px]">Användarenamn</TableHead>
            <TableHead>Roll</TableHead>
            <TableHead className="w-[20px]"></TableHead>
            <TableHead className="">Lag</TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersQuery.map((user) => {
            return (
              <TableRow key={user.users.id}>
                <TableCell className="font-medium">
                  {user.users.username}
                </TableCell>
                <TableCell className={"font-bold opacity-70"}>
                  {user.users.role}
                </TableCell>
                <TableCell className="w-fit">
                  <TeamColorCircle
                    mainColor={user.teams.mainColor}
                    secondaryColor={user.teams.secondaryColor}
                  />
                </TableCell>
                <TableCell className={"font-bold opacity-70"}>
                  {user.teams.teamName}
                </TableCell>
                <TableCell className={"font-bold opacity-70"}>
                  <DropDownButton text={`${user.users.username}`}>
                    <UserActionsForm user={user} />
                  </DropDownButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
