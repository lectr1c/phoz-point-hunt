"use server";

import { db } from "~/server/db";
import { coupons, points, users } from "~/server/db/schema";
import ShortUniqueId from "short-unique-id";
import { and, eq } from "drizzle-orm";

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

  const anonUser = await db.query.users.findFirst({
    where: and(eq(users.teamId, Number(team)), eq(users.username, "Anonymt")),
  });

  await db
    .insert(points)
    .values([
      { couponId: couponID, userId: anonUser?.id, addedAt: new Date() },
    ]);

  return {
    title: "Registrerade poäng",
    description: ``,
    success: true,
  };
}
