'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    addProductToUserListAction,
    deleteProductFromUserListAction,
} from '@/server/actions/user-product-actions';
import ParsedError from '@/server/errors/ParsedError';
import { TUserProduct } from '@/server/schemas';
import FileResizer from 'react-image-file-resizer';

import {
    TCategoriesIds,
    TOpenFoodFactsProduct,
    TProductStatistics,
} from '@/types/types';
import { useToast } from '@/lib/hooks/use-toast';
import { cn } from '@/lib/utils/utils';
import { TUserProductValidatorErrors } from '@/lib/validators/user-product-validator';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';

import StarRating from '../../ui/StarRating';
import CategorySelector from './CategorySelector';
import CommunityRating from './CommunityRating';
import PriceInput from './PriceInput';

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

    const isDraft =
        currentUserProduct?.status === 'draft' ||
        currentUserProduct?.status === 'draftVisible';

    const isSomethingMissing =
        isTitleMissing ||
        areBrandsMissing ||
        isQuantityMissing ||
        isImageMissing;

    const handleAddProduct = async (status: 'visible' | 'invisible') => {
        setLoading(true);

        if (
            !name ||
            !brandsState ||
            (isImageMissing && !image) ||
            !quantityState
        ) {
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

        if (res instanceof ParsedError) {
            setFormErrors(res.errors);
        }

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

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            return;
        }
        const file = e.target.files[0];

        try {
            FileResizer.imageFileResizer(
                file,
                400,
                400,
                'JPEG',
                79,
                0,
                file => {
                    if (file instanceof File) {
                        setImage(file);
                    } else {
                        throw new Error('Zły format pliku');
                    }
                },
                'file',
                100,
                100,
            );
        } catch (err) {
            toast({
                title: 'Problem z plikiem, spróbuj ponownie lub zmień na inny plik.',
                variant: 'destructive',
            });
        }
    };

    let statusEl: JSX.Element = (
        <Badge variant={'destructive'}>Jakiś błąd</Badge>
    );

    if (productStatistics.peopleRateCount === 0) {
        if (isSomethingMissing) {
            statusEl = (
                <Badge variant={'destructive'}>
                    Brakuje niektórych podstawowych cech produktu, aby
                    prawidłowo zapisać produkt, uzupełnij cechy oznaczone na
                    czerwono.
                </Badge>
            );
        } else {
            statusEl = (
                <Badge variant={'success'}>
                    Jesteś pierwszym użytkownikiem oceniającym ten produkt!
                </Badge>
            );
        }
    } else if (currentUserProduct?.status === 'visible') {
        statusEl = (
            <Badge variant={'success'}>
                Produkt znajduje się na Twojej liście!
            </Badge>
        );
    } else if (currentUserProduct?.status === 'invisible') {
        statusEl = <Badge>Produktu nie ma na Twojej liście.</Badge>;
    } else if (currentUserProduct?.status === 'draft') {
        statusEl = (
            <Badge variant={'secondary'}>
                Produkt jest w trakcie weryfikacji...
            </Badge>
        );
    } else if (currentUserProduct?.status === 'draftVisible') {
        statusEl = (
            <Badge variant={'secondary'}>
                Produkt znajduje się na Twojej liście, ale jest jeszcze w
                trakcie weryfikacji...
            </Badge>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    {statusEl}
                    <CardTitle className="pt-4">
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
                        <small className="mt-2 block text-sm">
                            (
                            {quantityState || (
                                <small className="text-destructive">
                                    Brakuje podanej ilości produktu np. 200g
                                </small>
                            )}
                            )
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
                        <div className={'relative h-[300px] w-full'}>
                            <Image
                                src={image_url ?? ''}
                                fill
                                className={cn(
                                    'object-contain',
                                    isDraft ? 'opacity-50' : '',
                                )}
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
                                    <div className="relative h-[300px] w-full">
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
                                accept="image/*"
                                capture
                            />
                        </>
                    )}
                </CardContent>
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
                        {currentUserProduct?.status === 'visible' ||
                        currentUserProduct?.status === 'draftVisible' ? (
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
