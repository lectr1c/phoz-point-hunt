import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import Header from "./Header";

export async function HeaderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  let role = "";

  if (user) {
    const e = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });
    if (e?.role) {
      role = e.role;
    }
  }

  return <Header role={role}>{children}</Header>;
}
