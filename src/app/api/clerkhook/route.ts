import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import * as console from "node:console";

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: TUserEvent = await request.json();

  const secret = process.env.CLERK_WEBHOOK_SECRET!;
  const headers = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };
  const wh = new Webhook(secret);

  try {
    const verifyPayload = wh.verify(JSON.stringify(data), headers);
    console.log(verifyPayload);
  } catch (e) {
    return new NextResponse("signature error", {
      status: 500,
    });
  }

  try {
    switch (data.type) {
      case "user.created":
        await db.insert(users).values({
          username: data.data.username,
          id: data.data.id,
          role: "nollan",
        });
        break;
      case "user.updated":
        await db
          .update(users)
          .set({
            username: data.data.username,
            role: "nollan",
          })
          .where(eq(users.id, data.data.id));
        break;
      case "user.deleted":
        if (data.data.deleted) {
          await db.delete(users).where(eq(users.id, data.data.id));
        }
        break;
    }
  } catch (e) {
    return new NextResponse("db error occured", {
      status: 500,
    });
  }

  return new NextResponse(data.data.username, {
    status: 200,
  });
}

type TUserEvent = {
  data: {
    deleted?: boolean;
    id: string;
    object: string;
    username?: string;
  };
  object: string;
  type: string;
};
