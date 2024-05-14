import { Button } from "~/components/ui/button";
import DialogParent from "~/components/DialogParent";
import {
  deleteUser,
  changeUserRole,
} from "~/app/dashboard/_forms/UserController";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { TTeam, TUser } from "~/server/types";
import ChangeRoleButtons from "~/app/dashboard/_components/ChangeRoleButtons";

export default function UserActionsForm({
  user,
}: {
  user: {
    users: TUser;
    teams: TTeam;
  };
}) {
  // const { toast } = useToast();
  //
  // toast({
  //   title: state.title,
  //   description: state.description,
  // });

  const router = useRouter();

  return (
    <>
      <DialogParent
        triggerButton={
          <Button type={"button"} className="bg-red-600">
            Ta bort
          </Button>
        }
        title="Är du säker du vill ta bort användaren?"
        description={`Vill du ta bort ${user.users.username}?`}
      >
        <Button
          className="float-right w-fit bg-red-600"
          type="submit"
          onClick={() => deleteUser(user.users.id)}
        >
          Ta bort
        </Button>
      </DialogParent>
      <DropdownMenuSeparator />
      <ChangeRoleButtons user={user} />
    </>
  );
}
