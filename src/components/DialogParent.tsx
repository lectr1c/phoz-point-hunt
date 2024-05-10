import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React from "react";

export default function DialogParent({
  children,
  triggerButton,
  title,
  description,
}: {
  children: React.ReactNode;
  triggerButton: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogClose className="float-end w-full">{children}</DialogClose>
      </DialogContent>
    </Dialog>
  );
}
