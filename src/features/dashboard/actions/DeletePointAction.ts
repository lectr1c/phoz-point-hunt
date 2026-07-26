"use server";

import { db } from "~/lib/db";
import { eq } from "drizzle-orm";
import { coupons, points } from "~/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function deletePointRegistration(pointId: number) {
  const deleted = await db
    .delete(points)
    .where(eq(points.id, pointId))
    .returning({ couponId: points.couponId });

  const couponId = deleted[0]?.couponId;
  if (couponId != null) {
    await db.delete(coupons).where(eq(coupons.id, couponId));
  }

  revalidatePath("/");
  revalidatePath("/dashboard/ansvarig");
}
