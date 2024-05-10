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

export default function UserActionsForm({
  user,
}: {
  user: {
    users: {
      id: string;
      role: "nollan" | "fadder" | "ansvarig" | "phöz" | null;
      teamId: number | null;
      username: string | null;
    };
    teams: {
      id: number;
      teamName: string;
      mainColor: string;
      secondaryColor: string;
    };
  };
}) {
  // const { toast } = useToast();
  //
  // toast({
  //   title: state.title,
  //   description: state.description,
  // });

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
      <Button onClick={() => changeUserRole(user.users.id, "fadder")}>
        Sätt som fadder
      </Button>
    </>
  );
}
