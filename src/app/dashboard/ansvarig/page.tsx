import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";
import CreateCoupons from "~/app/dashboard/_components/CreateCoupons";
import CreateTeam from "~/app/dashboard/_components/CreateTeam";
import UserTableList from "~/app/dashboard/_components/UserTableList";
import TeamTableList from "~/app/dashboard/_components/TeamTableList";
import { db } from "~/server/db";
import { coupons, points, teams, users } from "~/server/db/schema";
import { and, count, eq, isNull } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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

  const unExportedCoupons = await db
    .select({
      count: count(),
    })
    .from(coupons)
    .leftJoin(points, eq(points.couponId, coupons.id))
    .where(and(eq(coupons.exported, false), isNull(points.id)));

  if (!canAccess) {
    redirect("/");
  } else {
    return (
      <div className="flex w-screen flex-col items-center justify-center gap-5 align-top">
        <Tabs defaultValue="manageTeams" className="w-[400px]">
          <TabsList className={"h-fit"}>
            <TabsTrigger className="max-[463px]:text-wrap" value="generatePDF">
              Generera PDF
            </TabsTrigger>
            <TabsTrigger
              className="max-[463px]:text-wrap"
              value="createCoupons"
            >
              Skapa Kuponger
            </TabsTrigger>
            <TabsTrigger className="max-[463px]:text-wrap" value="createTeam">
              Skapa Lag
            </TabsTrigger>
            <TabsTrigger className="max-[463px]:text-wrap" value="manageTeams">
              Hantera Lag
            </TabsTrigger>
          </TabsList>
          <div className={"flex h-[430px] justify-center"}>
            <TabsContent value="generatePDF">
              <GeneratePDF
                unExportedCoupons={
                  unExportedCoupons[0] ? unExportedCoupons[0].count : 0
                }
              />
            </TabsContent>
            <TabsContent value="createCoupons">
              <CreateCoupons />
            </TabsContent>
            <TabsContent value="createTeam">
              <CreateTeam />
            </TabsContent>
            <TabsContent value="manageTeams">
              <TeamTableList teamsQuery={teamsQuery} />
            </TabsContent>
          </div>
        </Tabs>
        <UserTableList usersQuery={usersQuery} />
      </div>
    );
  }
}
