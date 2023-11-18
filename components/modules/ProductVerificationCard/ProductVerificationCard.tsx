'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    acceptProductVerification,
    rejectProductVerification,
    TAcceptProductVerificationReturn,
} from '@/actions/product-actions';

import FileResizer from 'react-image-file-resizer';

import { TOpenFoodFactsProduct } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import Loader from '@/components/ui/Loader';

type TProductVerificationCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
};

function ProductVerificationCard({
    product: { product_name, quantity, brands, _id, image_url },
}: TProductVerificationCard) {
    const { toast } = useToast();
    const router = useRouter();

    const [productFormState, setProductFormState] =
        useState<TAcceptProductVerificationReturn>();

    const [nameState, setNameState] = useState(product_name);
    const [brandsState, setBrandsState] = useState(brands);
    const [quantityState, setQuantityState] = useState(quantity);
    const [imageState, setImageState] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAcceptProduct = async () => {
        setLoading(true);

        const payload = {
            ean: _id,
            name: nameState,
            brands: brandsState,
            quantity: quantityState || '',
            image: imageState,
        };

        const formData = new FormData();

        let payloadKey: keyof typeof payload;

        for (payloadKey in payload) {
            formData.append(payloadKey, payload[payloadKey] as string);
        }

        const res = await acceptProductVerification(formData);

        setProductFormState(res);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            router.push('/product-verification');
        }
    };

    const handleRejectVerification = async () => {
        setLoading(true);

        const res = await rejectProductVerification(_id);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            router.push('/product-verification');
        }
    };

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImageState(null);
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
                        setImageState(file);
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

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="block text-center">
                        Weryfikujesz produkt o numerze EAN:
                        <br /> <strong className="text-lg">{_id}</strong>
                    </div>
                    <CardTitle className="pt-4">
                        <small className="text-muted-foreground text-xs">
                            Bazowy tytuł:
                        </small>
                        <div className="text-blue">{product_name}</div>
                        <Input
                            className="mt-3"
                            placeholder="Nazwa produktu"
                            value={nameState}
                            onChange={e => setNameState(e.target.value)}
                        />
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.name}
                        />
                        <small className="text-muted-foreground mt-0 text-xs">
                            Bazowa ilość:
                        </small>
                        <div className="text-blue">{quantity}</div>
                        <Input
                            className="mt-3"
                            placeholder="Ilosć"
                            value={quantityState ?? undefined}
                            onChange={e => setQuantityState(e.target.value)}
                        />
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.quantity}
                        />
                        <small className="text-muted-foreground mt-0 text-xs">
                            Bazowe nazwy firm:
                        </small>
                        <div className="text-blue">{brands}</div>
                        <Input
                            className="mt-3"
                            placeholder="Firmy"
                            value={brandsState}
                            onChange={e => setBrandsState(e.target.value)}
                        />
                        <FormError
                            className="mb-2"
                            formErrors={productFormState?.errors?.brands}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-blue mt-5 mb-2 text-center">
                        Obrazek użytkownika
                    </div>
                    <div className={'h-[300px] relative w-full'}>
                        <Image
                            src={image_url ?? ''}
                            fill
                            className="object-contain"
                            alt={product_name ?? ''}
                        />
                    </div>
                    {imageState && (
                        <>
                            <div className="text-success mt-5 text-center">
                                Nowy obrazek
                            </div>
                            <div className="h-[300px] relative w-full">
                                <Image
                                    src={URL.createObjectURL(imageState)}
                                    fill
                                    className="object-contain"
                                    alt="Pogląd obrazka"
                                />
                            </div>
                        </>
                    )}
                    <Input
                        type="file"
                        name="image"
                        className="mt-5"
                        onChange={handleSelectImage}
                        accept="image/*"
                        capture
                    />
                    <FormError
                        className="mb-2"
                        formErrors={productFormState?.errors?.image}
                    />
                </CardContent>
                <CardFooter className="flex-col">
                    <div className="mt-8 space-y-4">
                        {loading && <Loader className="mt-4" />}
                        <Button
                            className="w-full"
                            onClick={() => handleAcceptProduct()}>
                            Akceptuj produkt
                        </Button>
                        <Button
                            className="w-full"
                            onClick={() => handleRejectVerification()}
                            variant={'destructive'}>
                            Odrzuć produkt
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}

export default ProductVerificationCard;