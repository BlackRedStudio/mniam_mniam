'use client';

import { useState } from 'react';
import Image from 'next/image';
import { addProductToUserList } from '@/actions/user-product-actions';
import { TUserProduct } from '@/schema';

import { TCategoriesIds, TOpenFoodFactsProduct } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import CategorySelector from './CategorySelector';
import CommunityRating from './CommunityRating';
import PriceInput from './PriceInput';
import StarRating from './StarRating';

type TProductCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
    userProduct: TUserProduct | undefined;
};

function ProductCard({
    product: { product_name, quantity, brands, _id, image_url },
    userProduct,
}: TProductCard) {
    const [rating, setRating] = useState(userProduct?.rating ?? 0);
    const [category, setCategory] = useState<TCategoriesIds | ''>(
        (userProduct?.category as TCategoriesIds) ?? '',
    );
    const [price, setPrice] = useState(userProduct?.price || '');

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {product_name ?? 'Brak tytułu'}
                        <small className="text-sm ml-3">
                            ({quantity})
                        </small>
                    </CardTitle>
                    <CardDescription>
                        {brands ?? 'Brak przypisanych firm'}
                        <small className="block">
                            Numer EAN: {_id}
                        </small>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] relative w-full">
                        {image_url ? (
                            <Image
                                src={image_url ?? ''}
                                fill
                                className="object-contain"
                                alt={product_name ?? ''}
                            />
                        ) : (
                            <div className="text-destructive">Brak obrazka</div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col">
                    <CommunityRating />
                    <StarRating rating={rating} setRating={setRating} />
                    <CategorySelector
                        category={category}
                        setCategory={setCategory}
                    />
                    <PriceInput price={price} setPrice={setPrice} />
                    <div className="mt-8">
                        <Button
                            className="mb-4 w-full"
                            onClick={() =>
                                addProductToUserList(
                                    _id,
                                    rating,
                                    price,
                                    category,
                                    'invisible',
                                )
                            }>
                            Zapisz ocenę
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() =>
                                addProductToUserList(
                                    _id,
                                    rating,
                                    price,
                                    category,
                                    'visible',
                                )
                            }
                            variant={'outline'}>
                            Zapisz ocenę i dodaj do mojej listy
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default ProductCard;
