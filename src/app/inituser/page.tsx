import {db} from "~/server/db";
import {eq} from "drizzle-orm";
import {users} from "~/server/db/schema";
import {currentUser} from "@clerk/nextjs/server";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {redirect} from "next/navigation";

async function registerUser(formData: FormData) {
    'use server'

    const rawFormData = {
        teamId: formData.get('team') as unknown as number,
        username: formData.get('username') as string,
        userId: formData.get('userId') as string,
    }

    await db.insert(users).values({
        id: rawFormData.userId,
        teamId: rawFormData.teamId,
        username: rawFormData.username,
    })

    redirect("/");
}

export default async function InitUser(){

    const user = await currentUser();
    if (!user) return;

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id)
    })

    if (!dbUser) {
        const teams = await db.query.teams.findMany();

        return (
            <div className="flex w-full h-screen justify-center items-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Användarenamn och Lag</CardTitle>
                        <CardDescription>Skapa användarenamn och välj lag</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={registerUser} className="h-min flex flex-col gap-y-2">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="team">Lag</Label>
                                <Select name="team" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj ditt Lag"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id}
                                                        value={team.id.toString()}>{team.teamName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Label htmlFor="username">Kod</Label>
                            <Input id="username" name="username" placeholder="Användarenamn" required/>
                            <Input id="userId" name="userId" className="hidden" value={user.id}/>
                            <Button type="submit">Skicka</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    } else {
        redirect("/");
    }
}