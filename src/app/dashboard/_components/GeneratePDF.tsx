'use client'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "~/components/ui/card";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";
import {useFormState} from "react-dom";
import GeneratePDFAction from "~/app/dashboard/_components/GeneratePDFAction";

export default function GeneratePDF() {

    const [state, formAction] = useFormState(GeneratePDFAction, {title: '', description: '', success: false})

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Generera Kupong PDF</CardTitle>
                    <CardDescription>Generera en PDF med alla kuponger som inte ä</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="h-min flex flex-col gap-y-2">
                        <Button type="submit">Generera</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    Alla kuponger som redan är i ett PDF är i Google Drive:n
                </CardFooter>
            </Card>
    )
}