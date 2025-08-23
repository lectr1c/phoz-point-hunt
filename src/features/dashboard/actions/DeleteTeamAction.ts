"use server";

import { db } from "~/lib/db";
import { teams, users } from "~/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function DeleteTeamAction(
  prevState: { title: string; description: string; success: boolean },
  formData: FormData,
) {
  const { id } = {
    id: formData.get("id") as unknown as number,
  };

  await db.update(users).set({ teamId: null }).where(eq(users.teamId, id));
  await db.delete(teams).where(eq(teams.id, id));

  return { title: "", description: "", success: true };
}
