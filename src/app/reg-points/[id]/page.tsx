import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"

import { db } from "~/server/db";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {coupons, points, teams} from "~/server/db/schema";
import {eq} from "drizzle-orm";
import {SignedIn, SignedOut} from "@clerk/nextjs";
import {auth, currentUser} from "@clerk/nextjs/server";

async function registerPoints(formData: FormData) {
    'use server'

    const rawFormData = {
        teamId: formData.get('team') as unknown as number,
        coupon: formData.get('code') as string,
    }

    if (rawFormData.coupon == null || rawFormData.teamId == null) return;

    const coupon = await db.query.coupons.findFirst({
        where: eq(coupons.couponCode, rawFormData.coupon)
    })
    if (!coupon?.couponWorth || !coupon) return;

    if (coupon.claimed) return;

    const team = await db.query.teams.findFirst({
        where: eq(teams.id, rawFormData.teamId)
    })
    if (!team) return;


    const newPoints = team?.totalPoints + coupon.couponWorth;
    await db.insert(points).values({
        teamId: rawFormData.teamId, couponId: coupon.id, currTeamTotalPoints: newPoints, userId: 1
    })


    await db.update(teams).set({ totalPoints: newPoints }).where(eq(teams.id, rawFormData.teamId));

    await db.update(coupons).set({ claimed: true }).where(eq(coupons.couponCode, rawFormData.coupon));

    console.log(rawFormData);
}

export default async function RegisterPoints({ params } : { params: { id: string } }) {

    const teams = await db.query.teams.findMany();

    const user = await currentUser();

  return (
      <div className="flex w-full h-screen justify-center items-center">
          <Card>
              <CardHeader>
                  <CardTitle>Poäng Registrering</CardTitle>
                  <CardDescription>Registrera med den koden du fick av oss</CardDescription>
              </CardHeader>
              <CardContent>
                  <form action={registerPoints} className="h-min flex flex-col gap-y-2">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="team">Lag</Label>
                          <Select name="team" required>
                              <SelectTrigger>
                                  <SelectValue placeholder="Välja Lag"/>
                              </SelectTrigger>
                              <SelectContent>
                                  {teams.map((team) => (
                                      <SelectItem key={team.id} value={team.id.toString()}>{team.teamName}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                      <Label htmlFor="code">Kod</Label>
                      <Input id="code" name="code" placeholder="Points Code" defaultValue={params.id} required/>
                      <Button type="submit">Registrera poäng</Button>
                  </form>
              </CardContent>
              <CardFooter>
                  Koden kan användas bara en gång!
                  <SignedIn>
                      SIGNED IN
                      <br/>
                      <br/>
                  </SignedIn>
                  <SignedOut>
                      SIGNED OUT
                  </SignedOut>
              </CardFooter>
          </Card>
      </div>
  );
}
