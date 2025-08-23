"use server";

import { db } from "~/lib/db";
import { eq } from "drizzle-orm";
import { coupons, points, users } from "~/lib/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function deleteUser(id: string) {
  const couponsToDelete = await db
    .delete(points)
    .where(eq(points.userId, id))
    .returning({ couponId: points.couponId });

  for (const coupon of couponsToDelete) {
    await db.delete(coupons).where(eq(coupons.id, coupon.couponId));
  }

  await db.delete(users).where(eq(users.id, id));
}

export async function changeUserRole(
  id: string,
  role: "nollan" | "fadder" | "ansvarig" | "phöz" | null,
) {
  const loggedInUser = await currentUser();
  if (!loggedInUser) {
    return {
      title: "Fel inträffat",
      description: "Du är inte inloggad",
      success: false,
    };
  }

  const dbLoggedInUser = await db.query.users.findFirst({
    where: eq(users.id, loggedInUser.id),
  });

  if (dbLoggedInUser?.role !== "ansvarig" && dbLoggedInUser?.role !== "phöz") {
    return {
      title: "Fel inträffat",
      description: "Ingen behörighet",
      success: false,
    };
  }

  await db.update(users).set({ role: role }).where(eq(users.id, id));

  return {
    title: "Uppdaterad",
    description: `Till ${role} rollen`,
    success: false,
  };
}
