import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GeneratePDF from "~/app/dashboard/_components/GeneratePDF";
import CreateCoupons from "~/app/dashboard/_components/CreateCoupons";
import CreateTeam from "~/app/dashboard/_components/CreateTeam";

export default function AnsvarigDashboard() {
  const canAccess = true;

  if (!canAccess) {
    redirect("/");
    return null;
  } else {
    return (
      <div className="flex h-screen w-screen flex-wrap items-center justify-center gap-20">
        <GeneratePDF />
        <CreateCoupons />
        <CreateTeam />
      </div>
    );
  }
}
