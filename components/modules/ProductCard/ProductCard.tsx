'use client';

import { useState } from 'react';
import Image from 'next/image';
import { addProductToUserList } from '@/actions/user-product-actions';
import { TUserProduct } from '@/schema';

import { TCategoriesIds, TOpenFoodFactsProduct, TProductStatistics } from '@/types/types';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

type TProductCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
    currentUserProduct: TUserProduct | null;
    productStatistics: TProductStatistics;
};

function ProductCard({
    product: { product_name, quantity, brands, _id, image_url },
    currentUserProduct,
    productStatistics
}: TProductCard) {
    const { toast } = useToast();
    const router = useRouter();
    const [rating, setRating] = useState(currentUserProduct?.rating ?? 0);
    const [category, setCategory] = useState<TCategoriesIds | ''>(
        (currentUserProduct?.category as TCategoriesIds) ?? '',
    );
    const [price, setPrice] = useState(currentUserProduct?.price || '');
    const [loading, setLoading] = useState(false);

    const handleAddProduct = async (status: 'visible' | 'invisible') => {
        setLoading(true);
        const res = await addProductToUserList(
            _id,
            rating,
            price,
            category,
            status,
        );

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if(res.success) {
            router.push('/dashboard');
        }
    }

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
                    <CommunityRating productStatistics={productStatistics} />
                    <StarRating rating={rating} setRating={setRating} />
                    <CategorySelector
                        category={category}
                        setCategory={setCategory}
                    />
                    <PriceInput price={price} setPrice={setPrice} />
                    <div className="mt-8">
                        {loading && <Loader className="mt-4" />}
                        <Button
                            className="mb-4 w-full"
                            onClick={() => handleAddProduct('invisible')}>
                            Zapisz ocenę
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => handleAddProduct('visible')}
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
