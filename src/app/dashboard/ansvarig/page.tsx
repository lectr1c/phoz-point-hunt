import { auth } from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";
import CreateCoupons from "~/app/dashboard/_components/CreateCoupons";

export default function AnsvarigDashboard() {
    const canAccess = true;

    if(!canAccess){
        redirect("/");
        return null;
    } else {
        return (
            <div className="w-screen h-screen flex items-center justify-center gap-20 flex-wrap">
                <GeneratePDF/>
                <CreateCoupons/>
            </div>
        )
    }
}