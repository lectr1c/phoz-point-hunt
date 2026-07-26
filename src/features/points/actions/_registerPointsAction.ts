"use server";
import { db } from "~/lib/db";
import { and, eq } from "drizzle-orm";
import { coupons, points, users } from "~/lib/db/schema";

export default async function registerPoints(
  prevState: { title: string; description: string; success: boolean },
  formData: FormData,
) {
  const rawFormData = {
    coupon: formData.get("code") as string,
    teamId: Number(formData.get("team")),
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

  if (!rawFormData.teamId)
    return {
      title: "Fel inträffat",
      description: "Inget lag valdes",
      success: false,
    };

  // Every team has one shared "Anonymt" user that points get registered
  // against. Provision it on first use instead of requiring it to be
  // created by hand for every team.
  await db
    .insert(users)
    .values({
      id: `anon-team-${rawFormData.teamId}`,
      teamId: rawFormData.teamId,
      username: "Anonymt",
    })
    .onConflictDoNothing({ target: users.id });

  const anonUser = await db.query.users.findFirst({
    where: and(
      eq(users.teamId, rawFormData.teamId),
      eq(users.username, "Anonymt"),
    ),
  });

  if (!anonUser)
    return {
      title: "Fel inträffat",
      description: "Kunde inte hitta eller skapa laget",
      success: false,
    };

  await db.insert(points).values({
    couponId: coupon.id,
    userId: anonUser.id,
  });

  return {
    title: `${coupon.couponWorth} Poäng Registrerades!`,
    description: `Grattis!`,
    success: true,
  };
}
