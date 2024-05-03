import Link from "next/link";
import PointsTableView from "~/app/_components/PointsTableView";
import {db} from "~/server/db";
import {coupons, points, teams, users} from "~/server/db/schema";
import {desc, eq} from "drizzle-orm";
import { LineChart } from '@tremor/react';

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


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-900">
          <PointsTableView pointRows={pointRows}/>


        {/*<LineChart*/}
        {/*className="mt-4 h-72"*/}
        {/*data={pointRows}*/}
        {/*index="addedAt"*/}
        {/*yAxisWidth={65}*/}
        {/*categories={teamsRes.map((team) => team.teamName)}*/}
        {/*colors={['indigo', 'cyan']}*/}
        {/*/>*/}


    </main>
  );
}
