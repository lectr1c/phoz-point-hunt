import PointsTableView from "~/app/_components/PointsTableView";
import { db } from "~/server/db";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/server/db/schema";
import { asc, desc, eq, gt } from "drizzle-orm";
import { Card } from "~/components/ui/card";
import LineChart from "~/app/_components/LineChart";
import * as console from "node:console";
import Image from "next/image";
import TeamColorCircle from "~/components/TeamColorCircle";
import NewsFeed from "~/app/_components/NewsFeed";

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
        display: false,
        text: "Phöz-poängjakt",
      },
    },
  };

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
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="mt-10 flex w-screen max-w-[1100px] flex-wrap items-center justify-center">
        <Image
          src="/heroes.png"
          height={374}
          width={525}
          alt={"Superheroes"}
        ></Image>
        <div>
          {teamlist.map((value) => {
            return (
              <div
                key={value.teamName}
                className="m-2 flex w-[100%] min-w-[400px] max-w-[525px] flex-nowrap items-center justify-between bg-neutral-300 px-10 py-3 font-bold"
              >
                <TeamColorCircle
                  mainColor={value.backgroundColor}
                  secondaryColor={value.borderColor}
                />
                <span>{value.teamName}</span>
                <span>{value.totalPoints}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-10 w-screen max-w-[1100px]">
        <NewsFeed />
      </div>
      <div className="mt-10 w-screen max-w-[1100px]">
        <PointsTableView pointRows={query} />
      </div>
      <Card className=" my-10 w-screen max-w-[1100px] p-10">
        <div className="flex justify-center text-3xl underline">
          Poänghistorik
        </div>
        <LineChart options={options} data={data} />
      </Card>
    </main>
  );
}
