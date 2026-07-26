"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import GeneratePDFAction from "~/features/dashboard/actions/GeneratePDFAction";
import { useEffect, useState } from "react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";

function base64ToPdfBlob(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "application/pdf" });
}

export default function GeneratePDF({
  unExportedCoupons,
}: {
  unExportedCoupons: number;
}) {
  const [state, formAction] = useActionState(GeneratePDFAction, {
    title: "",
    description: "",
    success: false,
  });

  const { toast } = useToast();
  const router = useRouter();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.title === "") return;

    toast({
      title: state.title,
      description: state.description,
    });

    if (state.success) {
      router.refresh();
    }

    if (state.pdfBase64) {
      const url = URL.createObjectURL(base64ToPdfBlob(state.pdfBase64));
      setDownloadUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [state, toast, router]);

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle>Kuponger PDF</CardTitle>
        <CardDescription>Max 96st åt gången</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex h-min flex-col gap-y-2">
          <SubmitButton />
        </form>
        {downloadUrl ? (
          <a href={downloadUrl} download={state.filename ?? "coupons.pdf"}>
            <Button className="mt-2 bg-green-600 hover:bg-green-500">
              Ladda ner PDF:en
            </Button>
          </a>
        ) : (
          <></>
        )}
      </CardContent>
      <CardFooter>Kvar att exportera: {unExportedCoupons}</CardFooter>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      className={
        !pending ? "disabled:cursor-progress disabled:bg-muted disabled:text-muted-foreground" : ""
      }
      type="submit"
    >
      {pending ? "Genererar..." : "Generera"}
    </Button>
  );
}
