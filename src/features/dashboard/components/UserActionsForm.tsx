import { Button } from "~/components/ui/button";
import DialogParent from "~/components/common/DialogParent";
import { deleteUser } from "~/features/dashboard/components/UserController";
import { DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import type { TTeam, TUser } from "~/types/types";
import ChangeRoleButtons from "~/features/dashboard/components/ChangeRoleButtons";

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

  // const router = useRouter();

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
