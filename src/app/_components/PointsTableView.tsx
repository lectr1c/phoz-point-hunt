import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import TeamColorCircle from "~/components/TeamColorCircle";
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
      <Card className="p-10 max-[600px]:p-2">
        <Table>
          {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead className="w-[60px]">NØllan</TableHead>
              <TableHead>Lag</TableHead>
              <TableHead className="px-0">Poäng</TableHead>
              <TableHead className="text-right max-[600px]:hidden">
                Registrerad
              </TableHead>
              <TableHead className="text-right min-[600px]:hidden">
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
                  <TableCell className="font-medium">
                    <div className="max-[500px]:max-w-[60px] max-[500px]:overflow-hidden max-[500px]:text-ellipsis max-[500px]:whitespace-nowrap">
                      {pointRow.username}
                    </div>
                  </TableCell>
                  <TableCell className={"font-bold opacity-70"}>
                    <div className="max-[500px]:max-w-[160px] max-[500px]:overflow-hidden max-[500px]:text-ellipsis max-[500px]:whitespace-nowrap max-[500px]:text-sm">
                      {pointRow.teamname}
                    </div>
                  </TableCell>
                  <TableCell>{pointRow.couponWorth}</TableCell>
                  <TableCell className="text-right max-[600px]:hidden">
                    {timeAgo.format(
                      pointRow.addedAt ? pointRow.addedAt : new Date(),
                    )}
                  </TableCell>
                  <TableCell className="text-right min-[600px]:hidden">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="rounded-3xl bg-blue-600 p-2 font-bold shadow-inner">
                          <TimerIcon height={20} width={20} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit text-xs">
                        {timeAgo.format(
                          pointRow.addedAt ? pointRow.addedAt : new Date(),
                        )}
                      </PopoverContent>
                    </Popover>
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
