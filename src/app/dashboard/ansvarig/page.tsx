import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";

export default function AnsvarigDashboard() {
    const { has } = auth();

    const canAccess = has({ permission: "org:ansvarigdashboard:access" });

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