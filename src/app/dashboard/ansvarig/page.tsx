import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";

export default function AnsvarigDashboard() {
    const canAccess = true;

    if(!canAccess){
        redirect("/");
        return null;
    } else {
        return (
            <>
                <GeneratePDF/>
            </>
        )
    }
}