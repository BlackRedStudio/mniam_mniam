import { SetStateAction } from 'react';

import { TSortingDirection, TSortingType } from '@/types/types';
import { Button } from '@/components/ui/Button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import H3 from '@/components/ui/H3';

import { Icons } from '../Icons';

type TProductsListSortProps = {
    sorting: TSortingType;
    setSorting: (sortingType: SetStateAction<TSortingType>) => void;
    sortingDirection: TSortingDirection;
    setSortingDirection: (
        sortingDirection: SetStateAction<TSortingDirection>,
    ) => void;
};

function ProductsListSort({
    sorting,
    setSorting,
    sortingDirection,
    setSortingDirection,
}: TProductsListSortProps) {
    return (
        <Collapsible className="mb-5 rounded-lg border p-3">
            <CollapsibleTrigger className="flex w-full items-center justify-start">
                <Icons.chevronsUpDown />
                <H3>Sortowanie</H3>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="my-4 flex justify-center space-x-2">
                    <Button
                        variant={sorting === 'name' ? 'orange' : 'outline'}
                        onClick={() => setSorting('name')}>
                        <Icons.wholeWord />
                    </Button>
                    <Button
                        variant={sorting === 'rating' ? 'orange' : 'outline'}
                        onClick={() => setSorting('rating')}>
                        <Icons.star />
                    </Button>
                    <Button
                        variant={sorting === 'price' ? 'orange' : 'outline'}
                        onClick={() => setSorting('price')}>
                        <Icons.dollarSign />
                    </Button>
                </div>
                <div>
                    <strong>Kierunek:</strong>
                    <div className="my-4 flex justify-center space-x-2">
                        <Button
                            variant={
                                sortingDirection === 'ASC'
                                    ? 'orange'
                                    : 'outline'
                            }
                            onClick={() => setSortingDirection('ASC')}>
                            <Icons.arrowUpWideNarrow />
                        </Button>
                        <Button
                            variant={
                                sortingDirection === 'DESC'
                                    ? 'orange'
                                    : 'outline'
                            }
                            onClick={() => setSortingDirection('DESC')}>
                            <Icons.arrowDownWideNarrow />
                        </Button>
                    </div>
                </div>
                <Button variant={'outline'} onClick={() => setSorting(null)}>
                    Resetuj sortowanie
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default ProductsListSort;
