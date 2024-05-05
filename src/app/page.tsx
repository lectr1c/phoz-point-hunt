import Link from "next/link";
import PointsTableView from "~/app/_components/PointsTableView";
import {db} from "~/server/db";
import {coupons, points, teams, users} from "~/server/db/schema";
import {desc, eq} from "drizzle-orm";
import {Card} from "~/components/ui/card";
import {rowId} from "drizzle-orm/sqlite-core/expressions";

export default async function HomePage() {

  const query = await db.select()
      .from(points)
      .where(eq(teams.id, 2))
      .innerJoin(users, eq(points.userId, users.id))
      .innerJoin(teams, eq(users.teamId, teams.id))
      .innerJoin(coupons, eq(points.couponId, coupons.id))

  const teamsRes = await db.query.teams.findMany({});

  const  res = query
      .map((row) => { return row.coupons.couponWorth; })
      .reduce((acc, row) => {
          if (acc != null && row != null) {
              return acc + row;
          }
          return 0;
  })

    console.log(res);


  console.log(query);

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
          {/*<PointsTableView pointRows={pointRows}/>*/}


        <Card className="p-10 w-[700px]">
            
        </Card>


    </main>
  );
}
