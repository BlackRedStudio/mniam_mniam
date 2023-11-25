'use client';

import { useState } from 'react';
import { TProduct, TUserProductWithProduct } from '@/server/schemas';

import { TCategoriesIds } from '@/types/types';
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
import ProductListItem from './ProductListItem';
import ProductListItemDraft from './ProductListItemDraft';

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
    const [price, setPrice] = useState(0);
    const [rating, setRating] = useState(0);

    const resetFilters = () => {
        setCategory('');
        setPrice(0);
        setRating(0);
    };

    const handleFilters = (product: TUserProductWithProduct) => {
        if (rating > 0) {
            if (product.rating !== rating) {
                return null;
            }
        }
        if (price > 0) {
            if (product.price !== price) {
                return null;
            }
        }
        if (category) {
            if (product.category !== category) {
                return null;
            }
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
            )}
            <div className="grid grid-cols-3 gap-2">{list}</div>
        </>
    );
}

export default ProductsList;
