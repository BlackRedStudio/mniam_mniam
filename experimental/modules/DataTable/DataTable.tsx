'use client';

import { useState } from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/Button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';

import { Icons } from '../../../components/modules/Icons';
import DataTablePagination from './DataTablePagination';
import FilterInput from './FilterInput';
import FilterSelect from './FilterSelect';
import { FilterType } from '@/types/types';

type TDataTableProps<TData, TValue> = {
    filters?: FilterType[];
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

function DataTable<TData, TValue>({
    filters,
    columns,
    data,
}: TDataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            columnFilters,
        },
    });

    let filtersTemplate;
    const isFiltered =
        table.getPreFilteredRowModel().rows.length >
        table.getFilteredRowModel().rows.length;

    if (filters) {
        filtersTemplate = filters.map(
            ({ type, id, placeholder, options }, index) => {
                if (type === 'input') {
                    return (
                        <FilterInput
                            key={index}
                            table={table}
                            id={id}
                            placeholder={placeholder}
                        />
                    );
                } else if (type === 'select' && options) {
                    const column = table.getColumn(id);
                    return (
                        <FilterSelect
                            key={index}
                            column={column}
                            title={placeholder}
                            options={options}
                        />
                    );
                }
            },
        );
    }

    return (
        <>
            <div className="flex">
                {filters && (
                    <div className="flex space-x-4 pb-4">
                        {filtersTemplate}
                        {isFiltered && (
                            <Button
                                variant="ghost"
                                onClick={() => table.resetColumnFilters()}
                                className="h-8 px-2 lg:px-3">
                                Reset
                                <Icons.x className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div className="rounded-md border w-[calc(100vw-32px)]">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    Brak wyników.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </>
    );
}

export default DataTable;
