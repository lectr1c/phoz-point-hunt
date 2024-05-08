import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";

export default async function FreshUserInit() {
  const user = await currentUser();
  if (!user) return;

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (dbUser?.teamId == null) {
    const teams = await db.query.teams.findMany();

    //TODO: Fix duplicate key in database

    return (
      <>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="team">Lag</Label>
          <Select name="team" required>
            <SelectTrigger>
              <SelectValue placeholder="Välj ditt Lag" />
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
        <Label htmlFor="username">Användarenamn</Label>
        <Input
          id="username"
          name="username"
          placeholder="Användarenamn"
          defaultValue={user.username ? user.username + "" : ""}
        />
        <Input
          type="hidden"
          id="userId"
          name="userId"
          placeholder="userId"
          defaultValue={user.id}
        />
      </>
    );
  }

  return <></>;
}
