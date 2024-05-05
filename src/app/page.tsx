import Link from "next/link";
import PointsTableView from "~/app/_components/PointsTableView";
import {db} from "~/server/db";
import {coupons, points, teams, users} from "~/server/db/schema";
import {desc, eq} from "drizzle-orm";
import {Card} from "~/components/ui/card";

export default async function HomePage() {

  const pointRows = await db.select({
      pointsId: points.id,
      username: users.username,
      teamname: teams.teamName,
      addedAt: points.addedAt,
      currTeamTotalPoints: points.currTeamTotalPoints,
      couponWorth: coupons.couponWorth,
  })
      .from(points)
      .innerJoin(teams, eq(points.teamId, teams.id))
      .innerJoin(users, eq(points.userId, users.id))
      .innerJoin(coupons, eq(points.couponId, coupons.id)).orderBy(desc(points.addedAt));

  const teamsRes = await db.query.teams.findMany({});


  const data = [
      {
          addedAt: "Feb 24",
          Jokers: 100,
          Batmen: 200
      },
      {
          addedAt: "Feb 25",
          Jokers: 150,
          Batmen: 300
      },
      {
          addedAt: "Feb 26",
          Jokers: 200
      },
      {
          addedAt: "Feb 24",
          Jokers: 250,
          Batmen: 350
      }
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
          <PointsTableView pointRows={pointRows}/>


        <Card className="p-10 w-[700px]">
            
        </Card>


    </main>
  );
}
