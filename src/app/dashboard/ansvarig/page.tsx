import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";
import CreateCoupons from "~/app/dashboard/_components/CreateCoupons";
import CreateTeam from "~/app/dashboard/_components/CreateTeam";
import UserTableList from "~/app/dashboard/_components/UserTableList";
import TeamTableList from "~/app/dashboard/_components/TeamTableList";
import { db } from "~/server/db";
import { teams, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function AnsvarigDashboard() {
  const user = await currentUser();
  if (!user) redirect(`/`);
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (dbUser?.role != "ansvarig" && dbUser?.role != "phöz") {
    redirect("/");
  }

  const canAccess = true;

  const teamsQuery = await db.select().from(teams);

  const usersQuery = await db
    .select()
    .from(users)
    .innerJoin(teams, eq(teams.id, users.teamId));

  if (!canAccess) {
    redirect("/");
  } else {
    return (
      <div className="flex h-screen w-screen flex-wrap items-center justify-center gap-20">
        <GeneratePDF />
        <CreateCoupons />
        <CreateTeam />
        <UserTableList usersQuery={usersQuery} />
        <TeamTableList teamsQuery={teamsQuery} />
      </div>
    );
  }
}
