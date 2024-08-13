"use server";

import { db } from "~/server/db";
import { news } from "~/server/db/schema";

export default async function CreateNewsAction(
  prevState: { title: string; description: string; success: boolean },
  formData: FormData,
) {
  const { title, text } = {
    title: formData.get("title") as string,
    text: formData.get("text") as string,
  };

  if (title.length === 0 || text.length === 0) {
    return {
      title: "toma textfält",
      description: `försök igen`,
      success: false,
    };
  }

  try {
    await db.insert(news).values({ title: title, text: text });
  } catch (err) {
    return {
      title: "Något gick fel",
      description: `databas`,
      success: false,
    };
  }

  return {
    title: "Succé",
    description: `Nyhet skapad`,
    success: true,
  };
}
