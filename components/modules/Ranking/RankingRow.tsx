import { Session } from 'next-auth';

import { TRankingType, TUserRankingCounter } from '@/types/types';
import { cn } from '@/lib/utils/utils';
import AvatarBlock from '@/components/ui/AvatarBlock';
import { TableCell, TableRow } from '@/components/ui/Table';

type TRankingRowProps = {
    index: number;
    user: TUserRankingCounter;
    currentRankingType: TRankingType;
    session: Session;
};

function RankingRow({
    index,
    user,
    currentRankingType,
    session,
}: TRankingRowProps) {
    const isCurrentUserRow = session.user.name === user.name;

    let positionClassName = 'font-medium';

    if (index === 0) positionClassName = 'font-bold text-3xl';
    if (index === 1) positionClassName = 'font-bold text-xl';
    if (index === 2) positionClassName = 'font-bold text-base';

    return (
        <TableRow
            className={
                isCurrentUserRow
                    ? 'bg-orange hover:bg-orange data-[state=selected]:bg-orange'
                    : ''
            }
        >
            <TableCell
                className={cn(
                    'p-3',
                    positionClassName,
                    isCurrentUserRow && 'text-white',
                )}
            >
                {index + 1}
            </TableCell>
            <TableCell className="p-3">
                <div className="flex items-center">
                    <AvatarBlock
                        name={user.name}
                        image={user.image}
                        className="h-[40px] w-[40px]"
                    />
                    <div className="max-h-[60px] w-36 overflow-hidden text-ellipsis pl-3">
                        <span className={isCurrentUserRow ? 'text-white' : ''}>
                            {user.name}
                        </span>
                    </div>
                </div>
            </TableCell>
            <TableCell
                className={cn(
                    'p-3 text-right',
                    isCurrentUserRow && 'text-white',
                )}
            >
                {user[currentRankingType.key]}
            </TableCell>
        </TableRow>
    );
}

export default RankingRow;
