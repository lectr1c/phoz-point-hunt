import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <SignUp path="/sign-up"/>
        </div>
    );
}