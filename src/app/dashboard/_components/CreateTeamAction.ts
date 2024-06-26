"use server";
import { db } from "~/server/db";
import { teams } from "~/server/db/schema";

export default async function CreateTeamAction(
  prevState: { title: string; description: string; success: boolean },
  formData: FormData,
) {
  const { teamName, mainColor, secondaryColor } = {
    teamName: formData.get("teamname") as string,
    mainColor: formData.get("mainColor") as string,
    secondaryColor: formData.get("secondaryColor") as string,
  };

  console.log(teamName, mainColor, secondaryColor);

  await db.insert(teams).values({
    teamName: teamName,
    mainColor: mainColor,
    secondaryColor: secondaryColor,
  });

  return {
    title: "Lag Skapad",
    description: `Laget ${teamName} är skapad`,
    success: true,
  };
}
