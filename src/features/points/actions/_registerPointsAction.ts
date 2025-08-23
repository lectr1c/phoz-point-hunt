"use server";
import { db } from "~/lib/db";
import { and, desc, eq, gte } from "drizzle-orm";
import {
  coupons,
  points,
  pointsByDateView,
  teams,
  users,
} from "~/lib/db/schema";
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

  const anonUser = await db.query.users.findFirst({
    where: and(
      eq(users.teamId, rawFormData.teamId),
      eq(users.username, "Anonymt"),
    ),
  });

  if (anonUser) {
    await db.insert(points).values({
      couponId: coupon.id,
      userId: anonUser.id,
    });
  }

  return {
    title: `${coupon.couponWorth} Poäng Registrerades!`,
    description: `Grattis!`,
    success: true,
  };
}
