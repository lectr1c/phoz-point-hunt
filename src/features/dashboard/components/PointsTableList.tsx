"use client";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import DialogParent from "~/components/common/DialogParent";
import TeamColorCircle from "~/components/common/TeamColorCircle";
import { deletePointRegistration } from "~/features/dashboard/actions/DeletePointAction";
import TimeAgo from "javascript-time-ago";
import sv from "javascript-time-ago/locale/sv";
import { useRouter } from "next/navigation";

TimeAgo.addLocale(sv);
const timeAgo = new TimeAgo("sv");

export default function PointsTableList({
  pointsQuery,
}: {
  pointsQuery: {
    pointsId: number;
    teamname: string;
    teamMainColor: string;
    teamSecondaryColor: string;
    couponCode: string;
    couponWorth: number | null;
    addedAt: Date | null;
  }[];
}) {
  const router = useRouter();

  return (
    <Card className="w-fit p-10 max-[350px]:p-5">
      <CardHeader className="px-0 pb-4 pt-0">
        <CardTitle>Hantera Poäng</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20px]"></TableHead>
            <TableHead>Lag</TableHead>
            <TableHead>Kod</TableHead>
            <TableHead>Poäng</TableHead>
            <TableHead>Registrerad</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pointsQuery.map((row) => (
            <TableRow key={row.pointsId}>
              <TableCell className="w-fit">
                <TeamColorCircle
                  mainColor={row.teamMainColor}
                  secondaryColor={row.teamSecondaryColor}
                />
              </TableCell>
              <TableCell className="font-medium">{row.teamname}</TableCell>
              <TableCell className="font-mono text-sm">
                {row.couponCode}
              </TableCell>
              <TableCell className="font-semibold tabular-nums">
                {row.couponWorth}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {row.addedAt ? timeAgo.format(row.addedAt) : ""}
              </TableCell>
              <TableCell>
                <DialogParent
                  triggerButton={
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-500"
                    >
                      Ta bort
                    </Button>
                  }
                  title="Ta bort registreringen?"
                  description={`Detta tar bort poängen och kupongen "${row.couponCode}" permanent.`}
                >
                  <Button
                    className="float-right w-fit bg-red-600 hover:bg-red-500"
                    type="button"
                    onClick={async () => {
                      await deletePointRegistration(row.pointsId);
                      router.refresh();
                    }}
                  >
                    Ta bort
                  </Button>
                </DialogParent>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
