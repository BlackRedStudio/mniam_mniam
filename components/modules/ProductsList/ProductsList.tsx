'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TProduct, TUserProductWithProduct } from '@/server/schemas';

import { TCategoriesIds, TSortingDirection, TSortingType } from '@/types/types';

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
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [category, setCategory] = useState<TCategoriesIds | ''>(
        searchParams.get('category') || '',
    );
    const [price, setPrice] = useState(
        parseInt(searchParams.get('price') || '0'),
    );
    const [rating, setRating] = useState(
        parseInt(searchParams.get('rating') || '0'),
    );
    const [sorting, setSorting] = useState<TSortingType>(
        (searchParams.get('sorting') as TSortingType) || null,
    );
    const [sortingDirection, setSortingDirection] = useState<TSortingDirection>(
        (searchParams.get('sortingDirection') as TSortingDirection) || 'ASC',
    );

    useEffect(() => {
        const URLParams = new URLSearchParams(searchParams);
        URLParams.set('rating', String(rating));
        URLParams.set('price', String(price));
        URLParams.set('category', category);
        URLParams.set('sorting', sorting || '');
        URLParams.set('sortingDirection', sortingDirection);

        router.replace(`${pathName}?${URLParams}`, { scroll: false });
    }, [rating, price, category, sorting, sortingDirection]);

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
