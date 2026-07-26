"use server";

import { db } from "~/lib/db";
import { eq } from "drizzle-orm";
import { news } from "~/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function deleteNews(newsId: number) {
  await db.delete(news).where(eq(news.id, newsId));

  revalidatePath("/");
  revalidatePath("/dashboard/ansvarig");
}
