import { Column } from '@tanstack/react-table';

import { cn } from '@/lib/utils/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/Popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';

import { Icons } from '../../../components/modules/Icons';
import { FilterOptionType } from '@/types/types';

type TFilterSelectProps<TData, TValue> = {
    column?: Column<TData, TValue>;
    title?: string;
    options: FilterOptionType[];
};

function FilterSelect<TData, TValue>({
    column,
    title,
    options,
}: TFilterSelectProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as string[]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed">
                    <Icons.plusCircle className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <div className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal">
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter(option =>
                                            selectedValues.has(option.value),
                                        )
                                        .map(option => (
                                            <Badge
                                                variant="secondary"
                                                key={'dfg'}
                                                className="rounded-sm px-1 font-normal">
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Select>
                    <SelectTrigger className="mb-5 w-full">
                        <SelectValue placeholder="Rozwiń listę" />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option, index) => {
                            const isSelected = selectedValues.has(option.value);
                            return (
                                <SelectItem
                                    key={index}
                                    value={option.value}
                                    onSelect={() => {
                                        if (isSelected) {
                                            selectedValues.delete(option.value);
                                        } else {
                                            selectedValues.add(option.value);
                                        }
                                        const filterValues =
                                            Array.from(selectedValues);

                                        column?.setFilterValue(
                                            filterValues.length
                                                ? filterValues
                                                : undefined,
                                        );
                                    }}>
                                    <div
                                        className={cn(
                                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'opacity-50 [&_svg]:invisible',
                                        )}>
                                        <Icons.check
                                            className={cn('h-4 w-4')}
                                        />
                                    </div>
                                    {option.icon && (
                                        <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span>{option.label}</span>
                                    {facets?.get(option.value) && (
                                        <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                            {facets.get(option.value)}
                                        </span>
                                    )}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                {selectedValues.size > 0 && (
                    <Button
                        onClick={() => column?.setFilterValue(undefined)}
                        className="justify-center text-center">
                        Clear filters
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}

export default FilterSelect;
