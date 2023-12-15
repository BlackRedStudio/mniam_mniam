import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';

import { Icons } from '../../../components/modules/Icons';

type TDataTablePaginationProps<TData> = {
    table: Table<TData>;
};

function DataTablePagination<TData>({
    table,
}: TDataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Wybrano {table.getFilteredSelectedRowModel().rows.length} z{' '}
                {table.getFilteredRowModel().rows.length} pozycji.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Pozycji na stronę</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={value => {
                            table.setPageSize(Number(value));
                        }}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue
                                placeholder={
                                    table.getState().pagination.pageSize
                                }
                            />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Strona {table.getState().pagination.pageIndex + 1} z{' '}
                    {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}>
                        <span className="sr-only">
                            Przejdź do pierwszej strony
                        </span>
                        <Icons.chevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}>
                        <span className="sr-only">
                            Przejdź do poprzedniej strony
                        </span>
                        <Icons.chevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}>
                        <span className="sr-only">
                            Przejdź do następnej strony
                        </span>
                        <Icons.chevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}>
                        <span className="sr-only">
                            Przejdź do ostatniej strony
                        </span>
                        <Icons.chevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DataTablePagination;
