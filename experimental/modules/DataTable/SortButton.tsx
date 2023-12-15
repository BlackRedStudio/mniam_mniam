import { Column } from '@tanstack/react-table';

import { Button } from '@/components/ui/Button';

import { Icons } from '../../../components/modules/Icons';

type TSortButtonProps = {
    column: Column<any>;
    name: string;
};

function SortButton({ column, name }: TSortButtonProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3"
            onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
            }>
            {name}
            <Icons.arrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
}

export default SortButton;
