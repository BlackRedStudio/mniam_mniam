'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { openFoodFactsProductStore } from '@/store/products-store';
import { useAtomValue } from 'jotai';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import StarRating from './StarRating';
import CommunityRating from './CommunityRating';
import CategorySelector from './CategorySelector';
import PriceInput from './PriceInput';
import { useState } from 'react';
import { TCategoriesIds } from '@/types/types';
import { addProductToUserList } from '@/actions/user-product-actions';

function ProductCard() {

    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState<TCategoriesIds | ''>('');
    const [price, setPrice] = useState('');

    const openFoodFactsProduct = useAtomValue(openFoodFactsProductStore);

    if (openFoodFactsProduct === null) {
        return redirect('/dashboard');
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {openFoodFactsProduct.product_name ?? 'Brak tytułu'}
                    </CardTitle>
                    <CardDescription>
                        {openFoodFactsProduct.brands ??
                            'Brak przypisanych firm'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] relative w-full">
                        {openFoodFactsProduct.image_url ? (
                            <Image
                                src={openFoodFactsProduct.image_url ?? ''}
                                fill
                                className="object-contain"
                                alt={openFoodFactsProduct.product_name ?? ''}
                            />
                        ) : (
                            <div className="text-destructive">Brak obrazka</div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col">
                    <CommunityRating />
                    <StarRating rating={rating} setRating={setRating} />
                    <CategorySelector category={category} setCategory={setCategory} />
                    <PriceInput price={price} setPrice={setPrice} />
                    <div className="mt-8">
                        <Button className="mb-4 w-full" onClick={() => addProductToUserList(openFoodFactsProduct, rating, price, category, 'invisible')}>Zapisz ocenę</Button>
                        <Button className="w-full" onClick={() => addProductToUserList(openFoodFactsProduct, rating, price, category, 'visible')} variant={'outline'}>
                            Zapisz ocenę i dodaj do mojej listy
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default ProductCard;
