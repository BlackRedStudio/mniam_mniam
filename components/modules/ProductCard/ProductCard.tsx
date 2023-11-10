'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    addProductToUserList,
    deleteProductFromUserList,
    TAddProductToUserListReturn,
} from '@/actions/user-product-actions';
import { TUserProduct } from '@/schema';

import {
    TCategoriesIds,
    TOpenFoodFactsProduct,
    TProductStatistics,
} from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';

import StarRating from '../../ui/StarRating';
import CategorySelector from './CategorySelector';
import CommunityRating from './CommunityRating';
import PriceInput from './PriceInput';

type TProductCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
    currentUserProduct: TUserProduct | null;
    productStatistics: TProductStatistics;
};

function ProductCard({
    product: { product_name, quantity, brands, _id, image_url },
    currentUserProduct,
    productStatistics,
}: TProductCard) {
    const { toast } = useToast();
    const router = useRouter();

    const [productFormState, setProductFormState] =
        useState<TAddProductToUserListReturn>();

    const [rating, setRating] = useState(currentUserProduct?.rating ?? 0);
    const [category, setCategory] = useState<TCategoriesIds | ''>(
        (currentUserProduct?.category as TCategoriesIds) ?? '',
    );
    const [price, setPrice] = useState(currentUserProduct?.price || '');
    const [name, setName] = useState(product_name);
    const [brandsState, setBrandsState] = useState(brands);
    const [quantityState, setQuantityState] = useState(quantity);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const isTitleMissing = !product_name;
    const areBrandsMissing = !brands;
    const isQuantityMissing = !quantity;
    const isImageMissing = !image_url;

    const handleAddProduct = async (status: 'visible' | 'invisible') => {
        setLoading(true);

        if (!name || !brandsState || (isImageMissing && !image) || !quantityState) {
            toast({
                title: 'Uzupełnij wszystkie dane zaznaczone na czerwono',
                variant: 'destructive',
            });
            setLoading(false);

            return null;
        }

        const payload = {
            ean: _id,
            rating,
            price,
            category,
            status,
            name,
            brands: brandsState,
            quantity: quantityState || '',
            // image, TODO: make email as File, send this as FormData
        }

        const res = await addProductToUserList(payload);

        setProductFormState(res);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            router.push('/dashboard');
        }
    };

    const handleDeleteProductFromList = async () => {
        if (!currentUserProduct) return false;

        setLoading(true);

        const res = await deleteProductFromUserList(currentUserProduct?.id);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);
    };

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            return;
        }
        setImage(e.target.files[0]);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    {isTitleMissing ||
                    areBrandsMissing ||
                    isQuantityMissing ||
                    isImageMissing ? (
                        <small className="text-destructive">
                            Brakuje niektórych podstawowych cech produktu, aby
                            prawidłowo zapisać produkt, uzupełnij cechy
                            oznaczone na czerwono.
                        </small>
                    ) : null}
                    <CardTitle>
                        {name || (
                            <small className="text-destructive">
                                Brak tytułu
                            </small>
                        )}
                        {isTitleMissing && (
                            <Input
                                className="mt-3"
                                placeholder="Wpisz brakujący tytuł (min 3 znaki)."
                                onChange={e => setName(e.target.value)}
                            />
                        )}
                        <small className="text-sm block mt-2">
                            ({quantityState || (
                            <small className="text-destructive">
                                Brakuje podanej ilości produktu np. 200g
                            </small>
                        )})
                        </small>
                        {isQuantityMissing && (
                            <Input
                                className="mt-3"
                                placeholder="Wpisz brakującą ilość (min 2 znaki)."
                                onChange={e => setQuantityState(e.target.value)}
                            />
                        )}
                    </CardTitle>
                    <CardDescription>
                        {brandsState || (
                            <small className="text-destructive">
                                Brak firm
                            </small>
                        )}
                        {areBrandsMissing && (
                            <Input
                                className="mt-3"
                                placeholder="Wpisz brakujące firmy (min 3 znaki)."
                                onChange={e => setBrandsState(e.target.value)}
                            />
                        )}
                        <small className="block">Numer EAN: {_id}</small>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {image_url ? (
                        <div className="h-[300px] relative w-full">
                            <Image
                                src={image_url ?? ''}
                                fill
                                className="object-contain"
                                alt={product_name ?? ''}
                            />
                        </div>
                    ) : (
                        <>
                            {image ? (
                                <>
                                    <div className="text-success">
                                        Pogląd obrazka
                                    </div>
                                    <div className="h-[300px] relative w-full">
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            fill
                                            className="object-contain"
                                            alt="Pogląd obrazka"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="text-destructive">
                                    Brak obrazka <br />
                                    (akceptowany format to jpeg/jpg)
                                </div>
                            )}
                            <Input
                                type="file"
                                name="image"
                                className="mt-1"
                                onChange={handleSelectImage}
                                accept="image/jpeg, image/jpg"
                            />
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex-col">
                    <CommunityRating productStatistics={productStatistics} />
                    {
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.rating}
                        />
                    }
                    <StarRating rating={rating} setRating={setRating} />
                    {
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.category}
                        />
                    }
                    <CategorySelector
                        category={category}
                        setCategory={setCategory}
                    />
                    {
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.price}
                        />
                    }
                    <PriceInput price={price} setPrice={setPrice} />
                    <div className="mt-8 space-y-4">
                        {loading && <Loader className="mt-4" />}
                        <Button
                            className="w-full"
                            onClick={() => handleAddProduct('invisible')}>
                            Zapisz ocenę
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => handleAddProduct('visible')}
                            variant={'outline'}>
                            Zapisz ocenę i dodaj do mojej listy
                        </Button>
                        {currentUserProduct?.status === 'visible' ? (
                            <Button
                                className="w-full"
                                onClick={() => handleDeleteProductFromList()}
                                variant={'destructive'}>
                                Usuń produkt z mojej listy
                            </Button>
                        ) : null}
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default ProductCard;
