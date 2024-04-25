import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export default function FadderDashboard() {
    const { has } = auth();

    const canAccess = has({ permission: "org:fadderdashboard:access" });

    if(!canAccess){
        redirect("/");
        return null;
    } else {
        return (
            <>
                Dashboard
            </>
        )
    }
}