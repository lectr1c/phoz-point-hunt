'use client';
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {Button} from "~/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import { useToast } from "~/components/ui/use-toast"
import {useFormState} from "react-dom";
import registerPoints from "~/app/reg-points/_registerPointsAction";
import {useEffect} from "react";
import {redirect} from "next/navigation";

export default function RegisterPoints({ params } : { params: { id: string } }) {

    const { toast } = useToast();

    const [state, formAction] = useFormState(registerPoints, {title: '', description: '', success: false})

    useEffect(() => {
        if (state.title === "") return;

        toast({
            title: state.title,
            description: state.description
        })

        if (state.success) {
            redirect("/");
        }
    }, [state])

  return (
      <div className="flex w-full h-screen justify-center items-center">
          <Card>
              <CardHeader>
                  <CardTitle>Poäng Registrering</CardTitle>
                  <CardDescription>Registrera med den koden du fick av oss</CardDescription>
              </CardHeader>
              <CardContent>
                  <form action={formAction} className="h-min flex flex-col gap-y-2">
                      <Label htmlFor="code">Kod</Label>
                      <Input id="code" name="code" placeholder="Points Code" defaultValue={params.id} required/>
                      <Button type="submit">Registrera poäng</Button>
                  </form>
              </CardContent>
              <CardFooter>
                  Koden kan användas bara en gång!
              </CardFooter>
          </Card>
      </div>
  );
}
