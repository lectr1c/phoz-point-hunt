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
    currTeamTotalPoints: number | null;
    couponWorth: number | null; }[]
    }) {


    return (<div className="w-fit">
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">NØllan</TableHead>
                    <TableHead>Lagnamn</TableHead>
                    <TableHead>Poäng</TableHead>
                    <TableHead className="text-right">Registrerad</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    pointRows.map((pointRow) => {
                        return (
                            <TableRow key={pointRow.pointsId}>
                                <TableCell className="font-medium">{pointRow.username}</TableCell>
                                <TableCell>{pointRow.teamname}</TableCell>
                                <TableCell>{pointRow.couponWorth}</TableCell>
                                <TableCell className="text-right">{pointRow.addedAt?.toDateString()}</TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    </div>)
}