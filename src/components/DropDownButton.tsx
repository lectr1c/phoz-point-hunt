import { type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

export default function DropDownButton({
  children,
  text,
}: {
  children: ReactNode;
  text: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="mr-1 h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{text}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col">{children}</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
