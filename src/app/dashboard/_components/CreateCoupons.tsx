'use client'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {useFormState, useFormStatus} from "react-dom";
import CreateCouponsAction from "~/app/dashboard/_components/CreateCouponsAction";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {useToast} from "~/components/ui/use-toast";
import {useEffect} from "react";

export default function CreateCoupons() {

    const [state, formAction] = useFormState(CreateCouponsAction, {title: '', description: '', success: false})

    const { toast } = useToast();

    useEffect(() => {
        if (state.title === "") return;

        toast({
            title: state.title,
            description: state.description
        })
    }, [state])

    return (
        <div className="flex w-fit justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Skapa Kuponger</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="h-min flex flex-col gap-y-2">
                        <Label htmlFor="couponAmt">Mängd</Label>
                        <Input id="couponWorth" type="number" name="couponAmt" required/>
                        <Label htmlFor="couponWorth">Värde</Label>
                        <Input id="couponWorth" type="number" name="couponWorth" required/>
                        <SubmitButton/>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} className={!pending ? "disabled:cursor-progress disabled:bg-slate-600" : ""} type="submit">{pending ? "Genererar..." : "Generera"}</Button>
    )
}


//Choose Amount
//Points Worth