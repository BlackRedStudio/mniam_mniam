'use client'

import { ColumnDef } from '@tanstack/react-table';

import { FilterType, TUserRankingCounter } from '@/types/types';
import { getNameInitials } from '@/lib/utils/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/Avatar';
import DataTable from './DataTable/DataTable';
import SortButton from './DataTable/SortButton';

type TRankingTableProps = {
    ranking: TUserRankingCounter[];
};

type TRankingColumns = ColumnDef<TUserRankingCounter>[];

function RankingTable({ ranking }: TRankingTableProps) {
    const columns: TRankingColumns = [
        {
            accessorKey: 'position',
            header: ({ column }) => <SortButton column={column} name="Miejsce" />,
            cell: ({row}) => row.index + 1
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <SortButton column={column} name="Nazwa" />,
        },
        {
            accessorKey: 'image',
            header: () => <div>Avatar</div>,
            cell: ({ row, cell }) => {
                const name = row.getValue<string>('name');
                const avatar = cell.getValue<string>();
                let nameInitials = 'MM';

                if (!avatar && name) {
                    nameInitials = getNameInitials(name);
                }

                return (
                    <Avatar>
                        <AvatarImage src={avatar || ''} />
                        <AvatarFallback>
                            {!avatar ? nameInitials : null}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: 'firstRateCount',
            header: ({ column }) => <SortButton column={column} name="Pierwszy ocenił" />,
        },
        {
            accessorKey: 'propsAddedCount',
            header: ({ column }) => <SortButton column={column} name="Dodał atrybuty" />,
        },
        {
            accessorKey: 'imgUploadedCount',
            header: ({ column }) => <SortButton column={column} name="Przesłał zdjęcie" />,
        },
    ];

    const filters: FilterType[] = [
        {
            id: 'name',
            type: 'input',
            placeholder: 'Wyszukaj po nazwie',
        },
    ];

    return <DataTable filters={filters} columns={columns} data={ranking} />;
}

export default RankingTable;
