'use client';

import { useState } from 'react';
import { TProduct, TUserProductWithProduct } from '@/server/schemas';

import { TCategoriesIds, TSortingType } from '@/types/types';

import ProductsListFilter from './ProductsListFilter';
import ProductsListItem from './ProductsListItem';
import ProductsListItemDraft from './ProductsListItemDraft';
import ProductsListSort from './ProductsListSort';

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
    const [sorting, setSorting] = useState<TSortingType>(null);
    const [sortingDirection, setSortingDirection] = useState<'ASC' | 'DESC'>(
        'ASC',
    );

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

    const handleSorting = (
        a: TUserProductWithProduct,
        b: TUserProductWithProduct,
    ) => {
        if (sorting === 'name') {
            if (sortingDirection === 'ASC') {
                return a.product.name < b.product.name ? -1 : 1;
            }
            return a.product.name > b.product.name ? -1 : 1;
        }
        if (sorting === 'price' || sorting === 'rating') {
            if (sortingDirection === 'ASC') {
                return a[sorting] < b[sorting] ? -1 : 1;
            }
            return a[sorting] > b[sorting] ? -1 : 1;
        }

        return 0;
    };

    let list = null;

    if (listType === 'active') {
        list = productsList
            .filter(product => handleFilters(product))
            .sort(handleSorting)
            .map(product => (
                <ProductsListItem key={product.id} userProduct={product} />
            ));
    } else {
        list = productsList.map(product => (
            <ProductsListItemDraft key={product.id} product={product} />
        ));
    }

    return (
        <>
            {listType === 'active' && (
                <>
                    <ProductsListFilter
                        category={category}
                        setCategory={setCategory}
                        price={price}
                        setPrice={setPrice}
                        rating={rating}
                        setRating={setRating}
                    />
                    <ProductsListSort
                        sorting={sorting}
                        setSorting={setSorting}
                        sortingDirection={sortingDirection}
                        setSortingDirection={setSortingDirection}
                    />
                </>
            )}
            <div className="grid grid-cols-3 gap-2">{list}</div>
        </>
    );
}

export default ProductsList;
