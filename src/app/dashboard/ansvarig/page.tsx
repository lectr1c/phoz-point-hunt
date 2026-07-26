import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GeneratePDF from "~/features/dashboard/components/GeneratePDF";
import CreateCoupons from "~/features/dashboard/components/CreateCoupons";
import CreateTeam from "~/features/dashboard/components/CreateTeam";
import UserTableList from "~/features/dashboard/components/UserTableList";
import TeamTableList from "~/features/dashboard/components/TeamTableList";
import PointsTableList from "~/features/dashboard/components/PointsTableList";
import NewsTableList from "~/features/dashboard/components/NewsTableList";
import { db } from "~/lib/db";
import { coupons, news, points, teams, users } from "~/lib/db/schema";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CreateNewsPost from "~/features/dashboard/components/CreateNewsPost";
import RegisterPointsManually from "~/features/dashboard/components/RegisterPointsManually";

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

  const teamsDB = await db.query.teams.findMany();

  const pointsQuery = await db
    .select({
      pointsId: points.id,
      teamname: teams.teamName,
      teamMainColor: teams.mainColor,
      teamSecondaryColor: teams.secondaryColor,
      couponCode: coupons.couponCode,
      couponWorth: coupons.couponWorth,
      addedAt: points.addedAt,
    })
    .from(points)
    .innerJoin(users, eq(points.userId, users.id))
    .innerJoin(teams, eq(users.teamId, teams.id))
    .innerJoin(coupons, eq(points.couponId, coupons.id))
    .orderBy(desc(points.addedAt));

  const newsQuery = await db.select().from(news).orderBy(desc(news.createdAt));

  if (!canAccess) {
    redirect("/");
  } else {
    return (
      <div className="min-h-screen">
        <div className="container flex flex-col gap-8 py-10">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-300">
              Hantera lag, kuponger och nyheter
            </p>
          </div>

          <Tabs defaultValue="manageTeams">
            <TabsList className="flex h-fit flex-wrap justify-start gap-1 bg-transparent p-0 text-slate-300">
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="nyheter"
              >
                Nyheter
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="generatePDF"
              >
                Generera PDF
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="createCoupons"
              >
                Skapa Kuponger
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="createTeam"
              >
                Skapa Lag
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="registerPointsManual"
              >
                Reg. Poäng
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="manageTeams"
              >
                Hantera Lag
              </TabsTrigger>
              <TabsTrigger
                className="max-[463px]:text-wrap data-[state=active]:bg-card data-[state=active]:shadow-soft"
                value="managePoints"
              >
                Hantera Poäng
              </TabsTrigger>
            </TabsList>
            <div className="mt-4 flex justify-center">
              <TabsContent value="generatePDF" className="w-full">
                <GeneratePDF
                  unExportedCoupons={
                    unExportedCoupons[0] ? unExportedCoupons[0].count : 0
                  }
                />
              </TabsContent>
              <TabsContent value="nyheter" className="w-full">
                <div className="flex flex-col items-center">
                  <CreateNewsPost />
                  <NewsTableList newsQuery={newsQuery} />
                </div>
              </TabsContent>
              <TabsContent value="registerPointsManual" className="w-full">
                <RegisterPointsManually teams={teamsDB} />
              </TabsContent>
              <TabsContent value="createCoupons" className="w-full">
                <CreateCoupons />
              </TabsContent>
              <TabsContent value="createTeam" className="w-full">
                <CreateTeam />
              </TabsContent>
              <TabsContent value="manageTeams" className="w-full">
                <TeamTableList teamsQuery={teamsQuery} />
              </TabsContent>
              <TabsContent value="managePoints" className="w-full">
                <PointsTableList pointsQuery={pointsQuery} />
              </TabsContent>
            </div>
          </Tabs>

          <UserTableList usersQuery={usersQuery} />
        </div>
      </div>
    );
  }
}
