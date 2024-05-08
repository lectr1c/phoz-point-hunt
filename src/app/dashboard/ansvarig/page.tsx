import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";
import CreateCoupons from "~/app/dashboard/_components/CreateCoupons";
import CreateTeam from "~/app/dashboard/_components/CreateTeam";
import UserTableList from "~/app/dashboard/_components/UserTableList";
import TeamTableList from "~/app/dashboard/_components/TeamTableList";
import { db } from "~/server/db";
import { teams } from "~/server/db/schema";

export default async function AnsvarigDashboard() {
  const canAccess = true;

  const teamsQuery = await db.select().from(teams);

  if (!canAccess) {
    redirect("/");
  } else {
    return (
      <div className="flex h-screen w-screen flex-wrap items-center justify-center gap-20">
        <GeneratePDF />
        <CreateCoupons />
        <CreateTeam />
        <UserTableList />
        <TeamTableList teamsQuery={teamsQuery} />
      </div>
    );
  }
}
