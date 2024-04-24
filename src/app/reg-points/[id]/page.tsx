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

async function registerPoints(formData: FormData) {
    'use server'

    const rawFormData = {
        teamId: formData.get('team'),
        coupon: formData.get('code'),
    }

    console.log(rawFormData);
}

export default async function RegisterPoints({ params } : { params: { id: string } }) {

    const teams = await db.query.teams.findMany();

  return (
      <div className="flex w-full h-screen justify-center items-center">
          <form action={registerPoints} className="h-min flex flex-col gap-y-2">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="team">Team</Label>
                  <Select name="team">
                      <SelectTrigger>
                          <SelectValue placeholder="Choose Team"/>
                      </SelectTrigger>
                      <SelectContent>
                          {teams.map((team) => (
                              <SelectItem key={team.id} value={team.id.toString()}>{team.teamName}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" name="code" placeholder="Points Code"/>
              <Button type="submit">Register Points</Button>
          </form>
      </div>
  );
}
