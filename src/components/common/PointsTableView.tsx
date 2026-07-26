import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import TeamColorCircle from "~/components/common/TeamColorCircle";
import sv from "javascript-time-ago/locale/sv";
import TimeAgo from "javascript-time-ago";
import { TimerIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function PointsTableView({
  pointRows,
}: {
  pointRows: {
    pointsId: number;
    username: string | null;
    teamname: string;
    addedAt: Date | null;
    couponWorth: number | null;
    teamMainColor: string;
    teamSecondaryColor: string;
  }[];
}) {
  TimeAgo.addLocale(sv);
  const timeAgo = new TimeAgo("sv");
  return (
    <div className="w-full">
      <Card className="p-6 shadow-soft sm:p-8">
        <CardHeader className="px-0 pb-4 pt-0 text-center">
          <CardTitle className="text-xl">Senaste registrerade poäng</CardTitle>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead>Lag</TableHead>
              <TableHead className="px-0">Poäng</TableHead>
              <TableHead className="text-right max-[600px]:hidden">
                Registrerad
              </TableHead>
              <TableHead className="text-center min-[600px]:hidden">
                Reg.
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pointRows.map((pointRow) => {
              return (
                <TableRow key={pointRow.pointsId}>
                  <TableCell className="w-fit">
                    <TeamColorCircle
                      mainColor={pointRow.teamMainColor}
                      secondaryColor={pointRow.teamSecondaryColor}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="max-[500px]:max-w-[200px] max-[500px]:overflow-hidden max-[500px]:text-ellipsis max-[500px]:whitespace-nowrap">
                      {pointRow.teamname}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">
                    {pointRow.couponWorth}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground max-[600px]:hidden">
                    {timeAgo.format(
                      pointRow.addedAt ? pointRow.addedAt : new Date(),
                    )}
                  </TableCell>
                  <TableCell className="text-center min-[600px]:hidden">
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            className="h-9 w-9 rounded-full bg-accent text-accent-foreground shadow-soft hover:bg-accent/90"
                          >
                            <TimerIcon height={16} width={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit text-xs">
                          {timeAgo.format(
                            pointRow.addedAt ? pointRow.addedAt : new Date(),
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
