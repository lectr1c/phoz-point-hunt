'use server'
import {db} from "~/server/db";
import {eq} from "drizzle-orm";
import {coupons, points, teams, users} from "~/server/db/schema";
import {currentUser} from "@clerk/nextjs/server";
import * as console from "node:console";

export default async function registerPoints(prevState: {title: string, description: string, success: boolean}, formData: FormData) {

    const rawFormData = {
        coupon: formData.get('code') as string,
        teamId: formData.get('team') as unknown as number,
        username: formData.get('username') as string,
        userId: formData.get('userId') as string,
    }

    if (rawFormData.teamId) {
        console.log(rawFormData.teamId);
        await db.insert(users).values({
            id: rawFormData.userId,
            teamId: rawFormData.teamId,
            username: rawFormData.username,
        })
    }

    if (rawFormData.coupon == null) return { title: 'Fel inträffat', description: 'Kod fältet är tom', success: false };

    const coupon = await db.query.coupons.findFirst({
        where: eq(coupons.couponCode, rawFormData.coupon)
    })
    if (!coupon?.couponWorth || !coupon) return { title: 'Fel inträffat', description: 'Kupongen hittades inte', success: false };

    if (coupon.claimed) return { title: 'Fel inträffat', description: 'Koden användes redan!', success: false };



    const user = await currentUser();
    if (!user) return { title: 'Fel inträffat', description: 'Du är inte inloggad', success: false };

    if (rawFormData.teamId) {
        await db.insert(users).values({
            id: rawFormData.userId,
            teamId: rawFormData.teamId,
            username: rawFormData.username,
        })
    }

    const dbUserTeams = await db.select().from(users).innerJoin(teams, eq(users.teamId, teams.id)).where(eq(users.id, user.id));
    if (!dbUserTeams[0]) return { title: 'Fel Inträffat', description: 'Du är inte med i nån lag', success: false };

    const dbUserTeam = dbUserTeams[0];

    const newPoints = dbUserTeam.teams.totalPoints + coupon.couponWorth;



    await db.insert(points).values({
        teamId: dbUserTeam.teams.id, couponId: coupon.id, currTeamTotalPoints: newPoints, userId: user.id
    })

    await db.update(teams).set({ totalPoints: newPoints }).where(eq(teams.id, dbUserTeam.teams.id));

    await db.update(coupons).set({ claimed: true }).where(eq(coupons.couponCode, rawFormData.coupon));


    return { title: `${coupon.couponWorth} Poäng Registrerades!`, description: `Ditt lag ${dbUserTeam.teams.teamName} har nu ${newPoints} poäng!`, success: true };
}