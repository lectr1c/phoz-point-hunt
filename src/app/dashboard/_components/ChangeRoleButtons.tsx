import { changeUserRole } from "~/app/dashboard/_forms/UserController";
import { toast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import type { TTeam, TUser } from "~/server/types";

export default function ChangeRoleButtons({
  user,
}: {
  user: { users: TUser; teams: TTeam };
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      {user.users.role !== "nollan" ? (
        <Button
          onClick={async () => {
            const res = await changeUserRole(user.users.id, "nollan");
            toast({ title: res.title, description: res.description });
            router.refresh();
          }}
        >
          Sätt som nollan
        </Button>
      ) : (
        <></>
      )}
      {user.users.role !== "fadder" ? (
        <Button
          onClick={async () => {
            const res = await changeUserRole(user.users.id, "fadder");
            toast({ title: res.title, description: res.description });
            router.refresh();
          }}
        >
          Sätt som fadder
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
