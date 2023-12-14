'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    addProductToUserListAction,
    deleteProductFromUserListAction,
} from '@/server/actions/user-product-actions';
import { TUserProduct } from '@/server/schemas';

import {
    TCategoriesIds,
    TOpenFoodFactsProduct,
    TProductStatistics,
} from '@/types/types';
import { useToast } from '@/lib/hooks/use-toast';
import { TUserProductValidatorErrors } from '@/lib/validators/user-product-validator';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import LegalNotice from '@/components/ui/LegalNotice';

import StarRating from '../../ui/StarRating';
import CategorySelector from './CategorySelector';
import CommunityRating from './CommunityRating';
import PriceRating from './PriceRating';
import ProductCardBadge from './ProductCardBadge';
import ProductCardFooter from './ProductCardFooter';
import ProductCardImage from './ProductCardImage';

type TProductCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
    currentUserProduct: TUserProduct | undefined | null;
    productStatistics: TProductStatistics;
};

function ProductCard({
    product: { product_name, quantity, brands, _id, image_url },
    currentUserProduct,
    productStatistics,
}: TProductCard) {
    const { toast } = useToast();
    const router = useRouter();

    const [formErrors, setFormErrors] = useState<TUserProductValidatorErrors>();

    const [rating, setRating] = useState(currentUserProduct?.rating ?? 0);
    const [category, setCategory] = useState<TCategoriesIds | ''>(
        (currentUserProduct?.category as TCategoriesIds) ?? '',
    );
    const [price, setPrice] = useState(currentUserProduct?.price ?? 0);
    const [name, setName] = useState(product_name);
    const [brandsState, setBrandsState] = useState(brands);
    const [quantityState, setQuantityState] = useState(quantity);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const isDraft =
        currentUserProduct?.status === 'draft' ||
        currentUserProduct?.status === 'draftVisible';

    const isSomethingMissing =
        !product_name || !brands || !quantity || !image_url;

    const handleAddProduct = async (status: 'visible' | 'invisible') => {
        setLoading(true);

        if (!name || !brandsState || (!image_url && !image) || !quantityState) {
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
            image,
        };

        const formData = new FormData();

        let payloadKey: keyof typeof payload;

        for (payloadKey in payload) {
            formData.append(payloadKey, payload[payloadKey] as string);
        }

        const res = await addProductToUserListAction(formData);

        if (!res.success && res.errors) {
            setFormErrors(res.errors);
        }

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            currentUserProduct ? router.push('/my-list') : router.push('/dashboard');
        }
    };

    const handleDeleteProductFromList = async () => {
        if (!currentUserProduct) return false;

        setLoading(true);

        const res = await deleteProductFromUserListAction(
            _id,
            currentUserProduct.id,
        );

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    {isSomethingMissing && <LegalNotice />}
                    <ProductCardBadge
                        peopleRateCount={productStatistics.peopleCount}
                        isSomethingMissing={isSomethingMissing}
                        status={currentUserProduct?.status}
                    />
                    <CardTitle className="pt-4">
                        {name || (
                            <small className="text-destructive">
                                Brak tytułu
                            </small>
                        )}
                        {!product_name && (
                            <Input
                                className="mt-3"
                                placeholder="Wpisz brakujący tytuł (min 3 znaki)."
                                onChange={e => setName(e.target.value)}
                            />
                        )}
                        <small className="mt-2 block text-sm">
                            (
                            {quantityState || (
                                <small className="text-destructive">
                                    Brakuje podanej ilości produktu np. 200g
                                </small>
                            )}
                            )
                        </small>
                        {!quantity && (
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
                        {!brands && (
                            <Input
                                className="mt-3"
                                placeholder="Wpisz brakujące firmy (min 3 znaki)."
                                onChange={e => setBrandsState(e.target.value)}
                            />
                        )}
                        <small className="block">Numer EAN: {_id}</small>
                    </CardDescription>
                </CardHeader>
                <ProductCardImage
                    image_url={image_url}
                    product_name={product_name}
                    isDraft={isDraft}
                    image={image}
                    setImage={setImage}
                />
                <CardFooter className="flex-col">
                    <CommunityRating productStatistics={productStatistics} />
                    <FormError
                        className="mb-2"
                        formErrors={formErrors?.rating}
                    />
                    <StarRating rating={rating} setRating={setRating} />
                    <FormError
                        className="mb-2"
                        formErrors={formErrors?.category}
                    />
                    <CategorySelector
                        category={category}
                        setCategory={setCategory}
                    />
                    <FormError
                        className="mb-2"
                        formErrors={formErrors?.price}
                    />
                    <PriceRating price={price} setPrice={setPrice} />
                    <ProductCardFooter
                        loading={loading}
                        handleAddProduct={handleAddProduct}
                        handleDeleteProductFromList={
                            handleDeleteProductFromList
                        }
                        currentUserProduct={currentUserProduct}
                    />
                    {product_name || brands || quantity || image_url ? (
                        <div className="mt-7">
                            <a
                                href={`https://world.openfoodfacts.org/product/${_id}`}
                                target="_blank">
                                Link do produktu źrodłowego
                            </a>
                        </div>
                    ) : null}
                </CardFooter>
            </Card>
        </>
    );
}

export default ProductCard;
