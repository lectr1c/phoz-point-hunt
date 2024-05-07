import { Card } from "~/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

export default function PointsTableView({ pointRows } : { pointRows: {
    pointsId: number;
    username: string | null;
    teamname: string;
    addedAt: Date | null;
    couponWorth: number | null;
    teamMainColor: string;
    teamSecondaryColor: string;
}[];
    }) {


    return (<div className="w-fit">
        <Card className="max-[350px]:p-5 p-10 max-w-[900px] w-screen">
            <Table>
                {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[20px]"></TableHead>
                        <TableHead className="w-[100px]">NØllan</TableHead>
                        <TableHead>Lag</TableHead>
                        <TableHead className="px-0">Poäng</TableHead>
                        <TableHead className="text-right max-[400px]:hidden">Registrerad</TableHead>
                        <TableHead className="text-right min-[400px]:hidden">Reg.</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        pointRows.map((pointRow) => {
                            return (
                                <TableRow key={pointRow.pointsId}>
                                    <TableCell className="w-fit">
                                        <div className="w-[16px] h-[16px] radius rounded-2xl outline-4 outline"
                                             style={{
                                                 backgroundColor: pointRow.teamMainColor,
                                                 outlineColor: pointRow.teamSecondaryColor
                                             }}></div>
                                    </TableCell>
                                    <TableCell className="font-medium">{pointRow.username}</TableCell>
                                    <TableCell className={"font-bold opacity-70"}>{pointRow.teamname}</TableCell>
                                    <TableCell>{pointRow.couponWorth}</TableCell>
                                    <TableCell className="text-right max-[400px]:hidden">{pointRow.addedAt?.toDateString()}</TableCell>
                                    <TableCell className="text-right min-[400px]:hidden">{pointRow.addedAt?.getDate() + "/" + (pointRow.addedAt!.getMonth() + 1)}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </Card>
    </div>)
}