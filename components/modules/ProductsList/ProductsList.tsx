'use client';

import { useState } from 'react';

import { TCategoriesIds } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import H3 from '@/components/ui/H3';
import StarRating from '@/components/ui/StarRating';

import { Icons } from '../Icons';
import CategorySelector from '../ProductCard/CategorySelector';
import PriceInput from '../ProductCard/PriceInput';
import ProductListItem from './ProductListItem';
import ProductListItemDraft from './ProductListItemDraft';
import { TProduct, TUserProductWithProduct } from '@/server/schema';

type TActiveList = {
    productsList: TUserProductWithProduct[];
    listType: 'active';
};
type TDraftList = {
    productsList: TProduct[];
    listType: 'draft';
};

type TProductsListProps = TActiveList | TDraftList;

function ProductsList({ productsList, listType }: TProductsListProps) {
    const [category, setCategory] = useState<TCategoriesIds | ''>('');
    const [priceFrom, setPriceFrom] = useState('0.00');
    const [priceTo, setPriceTo] = useState('500.00');
    const [rating, setRating] = useState(0);

    const resetFilters = () => {
        setCategory('');
        setPriceFrom('0.00');
        setPriceTo('500.00');
        setRating(0);
    };

    const handleFilters = (
        product: TUserProductWithProduct,
    ) => {
        if (rating > 0) {
            if (product.rating !== rating) {
                return null;
            }
        }
        if (category) {
            if (product.category !== category) {
                return null;
            }
        }
        if (parseFloat(product.price) < parseFloat(priceFrom)) {
            return null;
        }
        if (parseFloat(product.price) > parseFloat(priceTo)) {
            return null;
        }
        return product;
    };

    let list = null;

    if (listType === 'active') {
        list = productsList
            .filter(product => handleFilters(product))
            .map(product => (
                <ProductListItem key={product.id} userProduct={product} />
            ));
    } else {
        list = productsList.map(product => (
            <ProductListItemDraft key={product.id} product={product} />
        ));
    }

    return (
        <>
            {listType === 'active' && (
                <Collapsible className="p-3 border rounded-lg mb-5">
                    <CollapsibleTrigger className="flex items-center justify-start w-full">
                        <Icons.chevronsUpDown />
                        <H3>Filtry</H3>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <CategorySelector
                            className="mt-4"
                            category={category}
                            setCategory={setCategory}
                        />
                        <PriceInput
                            title="Cena od:"
                            className="mb-3"
                            price={priceFrom}
                            setPrice={setPriceFrom}
                        />
                        <PriceInput
                            title="Cena do:"
                            className="mb-3"
                            price={priceTo}
                            setPrice={setPriceTo}
                        />
                        <StarRating rating={rating} setRating={setRating} />
                        <Button variant={'outline'} onClick={resetFilters}>
                            Resetuj filtry
                        </Button>
                    </CollapsibleContent>
                </Collapsible>
            )}
            <div className="grid grid-cols-3 gap-2">{list}</div>
        </>
    );
}

export default ProductsList;
