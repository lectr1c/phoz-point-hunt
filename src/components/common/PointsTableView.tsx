import { Card, CardContent, CardHeader } from "~/components/ui/card";
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
      <Card className="shadow-lg border-2 border-orange-400 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-center tracking-wide drop-shadow-sm">
            🏁 Senaste registrerade poäng 🏁
          </h2>
        </CardHeader>
        <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead>Lag</TableHead>
              <TableHead className="px-0 font-semibold">Poäng</TableHead>
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
                  <TableCell className="font-medium text-gray-900">
                    <div className="max-[500px]:max-w-[200px] max-[500px]:overflow-hidden max-[500px]:text-ellipsis max-[500px]:whitespace-nowrap">
                      {pointRow.teamname}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-xl text-orange-600 drop-shadow-sm">{pointRow.couponWorth}</TableCell>
                  <TableCell className="text-right max-[600px]:hidden">
                    {timeAgo.format(
                      pointRow.addedAt ? pointRow.addedAt : new Date(),
                    )}
                  </TableCell>
                  <TableCell className="text-center min-[600px]:hidden">
                    <div className="flex justify-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 p-3 font-bold shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-yellow-400 transform hover:scale-105 transition-all duration-200">
                            <TimerIcon height={16} width={16} />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-fit text-xs bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300">
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
        </CardContent>
      </Card>
    </div>
  );
}
