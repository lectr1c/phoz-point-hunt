"use server";

import { db } from "~/lib/db";
import { coupons, points, users } from "~/lib/db/schema";
import ShortUniqueId from "short-unique-id";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function RegisterPointsManAction(
  prevState: {
    title: string;
    description: string;
    success: boolean;
  },
  formData: FormData,
) {
  const { team, couponWorth } = {
    team: formData.get("team") as string,
    couponWorth: formData.get("couponWorth") as unknown as number,
  };

  if (couponWorth === 0)
    return {
      title: "Värdelösa Kuponger",
      description: `oop 0 poäng???`,
      success: false,
    };

  const idGenerator = new ShortUniqueId({
    dictionary: "alphanum_upper",
    length: 6,
  });

  const newCoupons: {
    couponWorth: number;
    couponCode: string;
    exported: boolean;
  }[] = [];

  newCoupons.push({
    couponWorth: couponWorth,
    couponCode: idGenerator.rnd(),
    exported: true,
  });

  const couponIdResult = await db
    .insert(coupons)
    .values(newCoupons)
    .returning({ id: coupons.id });

  const couponID = couponIdResult[0]!.id;

  const teamId = Number(team);

  // Every team has one shared "Anonymt" user that points get registered
  // against. Provision it on first use instead of requiring it to be
  // created by hand for every team.
  await db
    .insert(users)
    .values({
      id: `anon-team-${teamId}`,
      teamId: teamId,
      username: "Anonymt",
    })
    .onConflictDoNothing({ target: users.id });

  const anonUser = await db.query.users.findFirst({
    where: and(eq(users.teamId, teamId), eq(users.username, "Anonymt")),
  });

  await db
    .insert(points)
    .values([
      { couponId: couponID, userId: anonUser?.id, addedAt: new Date() },
    ]);

  revalidatePath("/dashboard/ansvarig");
  revalidatePath("/");

  return {
    title: "Registrerade poäng",
    description: ``,
    success: true,
  };
}
