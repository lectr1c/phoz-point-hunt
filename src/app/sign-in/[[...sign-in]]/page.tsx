import { SignIn } from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server";

export default function Page() {



    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <SignIn path="/sign-in" />
        </div>
    );
}