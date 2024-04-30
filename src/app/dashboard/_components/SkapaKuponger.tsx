'use client'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {Button} from "~/components/ui/button";
import {useFormState, useFormStatus} from "react-dom";
import GeneratePDFAction from "~/app/dashboard/_components/GeneratePDFAction";

export default function GeneratePDF() {

    const [state, formAction] = useFormState(GeneratePDFAction, {title: '', description: '', success: false})

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>Kuponger PDF</CardTitle>
                    <CardDescription>Max 96st åt gången</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="h-min flex flex-col gap-y-2">
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