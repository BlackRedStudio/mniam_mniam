import { Session } from 'next-auth';

import { TRankingType, TUserRankingCounter } from '@/types/types';
import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';

import RankingRow from './RankingRow';

type TRankingTableProps = {
    ranking: TUserRankingCounter[];
    currentRankingType: TRankingType;
    session: Session;
};

function RankingTable({
    ranking,
    currentRankingType,
    session,
}: TRankingTableProps) {
    return (
        <div className="w-[calc(100vw-32px)] rounded-md border">
            <Table>
                <TableCaption>
                    (Widoczni są tylko Ci użytkownicy którzy mają przynajmniej 1
                    punkt oraz uzupełnioną nazwę użytkownika)
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="p-3">Poz.</TableHead>
                        <TableHead className="p-3 text-center">
                            Użytkownik
                        </TableHead>
                        <TableHead className="p-3 text-right">Ilość</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ranking.map((user, index) => (
                        <RankingRow
                            user={user}
                            key={index}
                            index={index}
                            session={session}
                            currentRankingType={currentRankingType}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default RankingTable;
