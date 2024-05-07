import PointsTableView from "~/app/_components/PointsTableView";
import { db } from "~/server/db";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/server/db/schema";
import { and, asc, desc, eq, gt, gte } from "drizzle-orm";
import { Card } from "~/components/ui/card";
import LineChart from "~/app/_components/LineChart";
import * as console from "node:console";

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

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);
  const latestPointsQuery = await db
    .select()
    .from(pointsByDateView)
    .where(gt(pointsByDateView.viewDate, date.toDateString()))
    .orderBy(asc(pointsByDateView.teamId))
    .innerJoin(teams, eq(pointsByDateView.teamId, teams.id));

  console.log(latestPointsQuery);

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
      .where(eq(pointsByDateView.teamId, team.id));

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  const data = {
    labels,
    datasets: datasets,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <PointsTableView pointRows={query} />

      <Card className="w-screen max-w-[900px] p-10">
        <LineChart options={options} data={data} />
      </Card>
    </main>
  );
}
