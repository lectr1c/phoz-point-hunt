import PointsTableView from "~/components/common/PointsTableView";
import { db } from "~/lib/db";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/lib/db/schema";
import { and, desc, eq, lte } from "drizzle-orm";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import LineChart from "~/components/common/LineChart";
import Image from "next/image";
import TeamColorCircle from "~/components/common/TeamColorCircle";
import NewsFeed from "~/components/common/NewsFeed";
import { cn } from "~/lib/utils";

export default async function HomePage() {
  const query = await db
    .select({
      pointsId: points.id,
      username: users.username,
      teamname: teams.teamName,
      couponWorth: coupons.couponWorth,
      addedAt: points.addedAt,
      teamMainColor: teams.mainColor,
      teamSecondaryColor: teams.secondaryColor,
    })
    .from(points)
    .innerJoin(users, eq(points.userId, users.id))
    .innerJoin(teams, eq(users.teamId, teams.id))
    .innerJoin(coupons, eq(points.couponId, coupons.id))
    .orderBy(desc(points.addedAt))
    .limit(10);


  const teamsQuery = await db.query.teams.findMany();

  let labels: string[] = [];

  const datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[] = [];

  for (const team of teamsQuery) {
    const index = teamsQuery.indexOf(team);

    const pointsQuery = await db
      .select()
      .from(pointsByDateView)
      .where(
        and(
          eq(pointsByDateView.teamId, team.id),
          lte(pointsByDateView.viewDate, "2025-08-30"),
        ),
      );

    if (index == 0) {
      labels = pointsQuery.map((pointTeamRow) => {
        const date = new Date(pointTeamRow.viewDate);
        return date.getDate() + "/" + (date.getMonth() + 1);
      });
    }

    datasets.push({
      label: team.teamName,
      data: pointsQuery.map((point) => point.totalPointsByDate),
      backgroundColor: team.mainColor,
      borderColor: team.secondaryColor,
    });
  }

  const data = {
    labels,
    datasets: datasets,
  };

  const teamlist = datasets
    .map((value) => {
      return {
        teamName: value.label,
        totalPoints: value.data[value.data.length - 1],
        backgroundColor: value.backgroundColor,
        borderColor: value.borderColor,
      };
    })
    .sort((a, b) => {
      if (!a.totalPoints) return -1;
      if (!b.totalPoints) return 1;

      return a.totalPoints < b?.totalPoints ? 1 : -1;
    });

  return (
    <main className="min-h-screen">
      <div className="container flex flex-col gap-16 py-12">
        <section className="flex flex-wrap items-center justify-center gap-10 lg:justify-between">
          <Image
            src="/heroes.png"
            height={374}
            width={525}
            alt={"Superheroes"}
            priority
            className="h-auto w-full max-w-[420px] lg:max-w-[480px]"
          />
          <div className="w-full max-w-[520px]">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-300">
              Topplistan
            </h2>
            <div className="space-y-2">
              {teamlist.map((value, index) => {
                const isLeader = index === 0;
                return (
                  <div
                    key={value.teamName}
                    className={cn(
                      "flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3.5 shadow-soft transition-shadow hover:shadow-soft-lg",
                      isLeader && "ring-1 ring-accent/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-5 text-sm font-semibold tabular-nums",
                          isLeader ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        {index + 1}
                      </span>
                      <TeamColorCircle
                        mainColor={value.backgroundColor}
                        secondaryColor={value.borderColor}
                      />
                      <span className="font-semibold text-foreground">
                        {value.teamName}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums text-foreground">
                      {value.totalPoints}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <NewsFeed />

        <PointsTableView pointRows={query} />

        <Card className="p-8 shadow-soft sm:p-10">
          <CardHeader className="px-0 pb-6 pt-0 text-center">
            <CardTitle className="text-xl">Poänghistorik</CardTitle>
          </CardHeader>
          <LineChart data={data} height={350} />
        </Card>
      </div>
    </main>
  );
}
