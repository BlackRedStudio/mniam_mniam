import { SetStateAction } from 'react';

import { Button } from '@/components/ui/Button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';

import { Icons } from '../Icons';
import CategorySelector from '../ProductCard/CategorySelector';
import PriceRating from '../ProductCard/PriceRating';

type TProductsListFilterProps = {
    category: string;
    setCategory: (category: SetStateAction<string>) => void;
    price: number;
    setPrice: (price: SetStateAction<number>) => void;
    rating: number;
    setRating: (rating: SetStateAction<number>) => void;
};

function ProductsListFilter({
    category,
    setCategory,
    price,
    setPrice,
    rating,
    setRating,
}: TProductsListFilterProps) {
    const resetFilters = () => {
        setCategory('');
        setPrice(0);
        setRating(0);
    };

    return (
        <Collapsible className="mb-5 rounded-lg border p-3">
            <CollapsibleTrigger className="flex w-full items-center justify-start">
                <Icons.chevronsUpDown />
                <H3>Filtry</H3>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <CategorySelector
                    className="mt-4"
                    category={category}
                    setCategory={setCategory}
                />
                <PriceRating
                    title="Cena od:"
                    className="mb-3"
                    price={price}
                    setPrice={setPrice}
                />
                <StarRating rating={rating} setRating={setRating} />
                <Button variant={'outline'} onClick={resetFilters}>
                    Resetuj filtry
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default ProductsListFilter;
