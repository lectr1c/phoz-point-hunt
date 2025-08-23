import PointsTableView from "~/components/common/PointsTableView";
import { db } from "~/lib/db";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/lib/db/schema";
import { asc, desc, eq, gt } from "drizzle-orm";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import LineChart from "~/components/common/LineChart";
import * as console from "node:console";
import Image from "next/image";
import TeamColorCircle from "~/components/common/TeamColorCircle";
import NewsFeed from "~/components/common/NewsFeed";

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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background racing elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl rotate-12">🏎️</div>
        <div className="absolute top-32 right-20 text-4xl -rotate-45">🏁</div>
        <div className="absolute bottom-32 left-32 text-5xl rotate-45">🏆</div>
        <div className="absolute bottom-20 right-10 text-6xl -rotate-12">🏎️</div>
        <div className="absolute top-1/2 left-1/4 text-3xl rotate-90">⚡</div>
        <div className="absolute top-1/3 right-1/3 text-3xl -rotate-90">⚡</div>
      </div>
      
      {/* Racing stripes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="h-2 bg-gradient-to-r from-red-500 to-yellow-500 absolute top-0 left-0 w-full"></div>
        <div className="h-1 bg-gradient-to-r from-yellow-500 to-red-500 absolute top-2 left-0 w-full"></div>
        <div className="h-2 bg-gradient-to-r from-red-500 to-yellow-500 absolute bottom-0 left-0 w-full"></div>
        <div className="h-1 bg-gradient-to-r from-yellow-500 to-red-500 absolute bottom-2 left-0 w-full"></div>
      </div>
      
      <div className="mt-10 flex w-screen max-w-[1100px] flex-wrap items-center justify-center relative z-10">
        <Image
          src="/heroes.png"
          height={374}
          width={525}
          alt={"Superheroes"}
          priority
        />
        <div>
          <div className="space-y-4">
            {teamlist.map((value, index) => {
              // Create gradient from team's secondary to main color
              const teamGradient = `from-[${value.borderColor}] to-[${value.backgroundColor}]`;
              
              return (
                <div
                  key={value.teamName}
                  className={`group relative flex w-[100%] min-w-[400px] max-w-[525px] items-center justify-between bg-gradient-to-r ${teamGradient} rounded-2xl px-6 py-5 shadow-lg hover:shadow-xl transform hover:scale-102 transition-all duration-300 border-2 overflow-hidden`}
                  style={{
                    background: `linear-gradient(to right, ${value.borderColor}, ${value.backgroundColor})`,
                    borderColor: value.borderColor,
                  }}
                >
                  {/* Racing stripes background effect */}
                  <div className="absolute inset-0 opacity-15">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/50"></div>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-lg font-bold border-2 border-white/40 shadow-lg relative">
                      <span className="text-white drop-shadow-md">{index + 1}</span>
                      {/* Minimal medal accent */}
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 text-xs">🥇</div>
                      )}
                      {index === 1 && (
                        <div className="absolute -top-1 -right-1 text-xs">🥈</div>
                      )}
                      {index === 2 && (
                        <div className="absolute -top-1 -right-1 text-xs">🥉</div>
                      )}
                    </div>
                    <TeamColorCircle
                      mainColor={value.backgroundColor}
                      secondaryColor={value.borderColor}
                      size="lg"
                    />
                    <span className="font-bold text-white drop-shadow-lg text-lg">{value.teamName}</span>
                  </div>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-3xl font-black text-white drop-shadow-lg">{value.totalPoints}</span>
                    <span className="text-sm font-semibold text-white/80">pts</span>
                  </div>
                  
                  {/* Checkered flag pattern for 1st place */}
                  {index === 0 && (
                    <div className="absolute top-2 right-2 text-2xl animate-pulse opacity-80">
                      🏁
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-10 w-screen max-w-[1100px]">
        <NewsFeed />
      </div>
      <div className="mt-10 w-screen max-w-[1100px]">
        <PointsTableView pointRows={query} />
      </div>
      <Card className="my-10 w-screen max-w-[1100px] shadow-xl border-4 border-gradient-to-r from-red-500 to-orange-500 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader className="pb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <h2 className="text-3xl font-bold text-center tracking-wide drop-shadow-lg relative z-10">
            🏁 Poänghistorik 🏁
          </h2>
          <div className="absolute top-2 left-4 text-2xl opacity-50">🏆</div>
          <div className="absolute top-2 right-4 text-2xl opacity-50">🏆</div>
        </CardHeader>
        <CardContent className="bg-gradient-to-br from-white to-orange-50">
          <LineChart options={options} data={data} height={350} />
        </CardContent>
      </Card>
    </main>
  );
}
