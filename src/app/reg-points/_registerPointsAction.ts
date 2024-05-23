"use server";
import { db } from "~/server/db";
import { and, desc, eq, gte } from "drizzle-orm";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export default async function registerPoints(
  prevState: { title: string; description: string; success: boolean },
  formData: FormData,
) {
  const rawFormData = {
    coupon: formData.get("code") as string,
    teamId: formData.get("team") as unknown as number,
    username: formData.get("username") as string,
    userId: formData.get("userId") as string,
  };

  if (rawFormData.teamId != null && rawFormData.username != null) {
    await db.insert(users).values({
      id: rawFormData.userId,
      teamId: rawFormData.teamId,
      username: rawFormData.username,
    });
  }

  if (rawFormData.teamId != null && rawFormData.username == null) {
    await db
      .update(users)
      .set({
        teamId: rawFormData.teamId,
      })
      .where(eq(users.id, rawFormData.userId));
  }

  if (rawFormData.coupon == null)
    return {
      title: "Fel inträffat",
      description: "Kod fältet är tom",
      success: false,
    };

  const coupon = await db.query.coupons.findFirst({
    where: eq(coupons.couponCode, rawFormData.coupon),
  });
  if (!coupon?.couponWorth || !coupon)
    return {
      title: "Fel inträffat",
      description: "Kupongen hittades inte",
      success: false,
    };

  const pointsQuery = await db.query.points.findFirst({
    where: eq(points.couponId, coupon.id),
  });

  if (pointsQuery)
    return {
      title: "Fel inträffat",
      description: "Koden användes redan!",
      success: false,
    };

  const user = await currentUser();
  if (!user)
    return {
      title: "Fel inträffat",
      description: "Du är inte inloggad",
      success: false,
    };

  const dbUserTeams = await db
    .select()
    .from(users)
    .innerJoin(teams, eq(users.teamId, teams.id))
    .where(eq(users.id, user.id));
  if (!dbUserTeams[0])
    return {
      title: "Fel Inträffat",
      description: "Du är inte med i nån lag",
      success: false,
    };

  const dbUserTeam = dbUserTeams[0];

  await db.insert(points).values({
    couponId: coupon.id,
    userId: user.id,
  });

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const newPoints = await db
    .select()
    .from(pointsByDateView)
    .where(
      and(
        gte(pointsByDateView.viewDate, date.toDateString()),
        eq(pointsByDateView.teamId, dbUserTeam.teams.id),
      ),
    )
    .orderBy(desc(pointsByDateView.viewDate));

  return {
    title: `${coupon.couponWorth} Poäng Registrerades!`,
    description: `Ditt lag ${dbUserTeam.teams.teamName} har ${newPoints[0]!.totalPointsByDate} poäng!`,
    success: true,
  };
}
