import PointsTableView from "~/app/_components/PointsTableView";
import {db} from "~/server/db";
import {coupons, points, teams, users} from "~/server/db/schema";
import { desc, eq, sql} from "drizzle-orm";
import {Card} from "~/components/ui/card";
import LineChart from "~/app/_components/LineChart";

export default async function HomePage() {

  const query = await db.select({
      pointsId: points.id,
      username: users.username,
      teamname: teams.teamName,
      couponWorth: coupons.couponWorth,
      addedAt: points.addedAt
  })
      .from(points)
      .innerJoin(users, eq(points.userId, users.id))
      .innerJoin(teams, eq(users.teamId, teams.id))
      .innerJoin(coupons, eq(points.couponId, coupons.id))
      .orderBy(desc(points.addedAt))
      .limit(10);

  const teamsRes = await db.query.teams.findMany();

  const teamDatePoints:{view_date: Date, team_id: number, total_points_up_to_date: string}[][] = [];

  for (const team of teamsRes) {
      const datePoints : {view_date: Date, team_id: number, total_points_up_to_date: string}[] = await db.execute(sql`SELECT * FROM "points_by_date" WHERE team_id=${team.id}`)
      teamDatePoints.push(datePoints);
  }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    if (teamDatePoints.length === 0 && teamDatePoints[0]!.length === 0) {
        return <></>;
    }

    const labels = teamDatePoints[0]!
        .map((datePoint) => datePoint.view_date.getDate() + "/" + (datePoint.view_date.getMonth() + 1))

    const datasets = teamDatePoints.map((teamPoints, index) => {
        return {
            label: teamsRes[index]!.teamName,
            data: teamPoints.map((teamPoint) => teamPoint.total_points_up_to_date),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
    })

    const data = {
        labels,
        datasets: datasets,
    };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
        <PointsTableView pointRows={query}/>

        <Card className="p-10 w-[700px]">
            <LineChart
                options={options}
                data={data}
            />
        </Card>


    </main>
  );
}
