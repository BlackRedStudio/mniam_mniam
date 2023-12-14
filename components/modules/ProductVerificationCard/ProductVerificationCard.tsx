'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    acceptProductVerificationAction,
    rejectProductVerificationAction,
} from '@/server/actions/product-actions';

import { TOpenFoodFactsProduct } from '@/types/types';
import { useToast } from '@/lib/hooks/use-toast';
import { TProductValidatorErrors } from '@/lib/validators/product-validator';
import { Button } from '@/components/ui/Button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import LegalNotice from '@/components/ui/LegalNotice';
import Loader from '@/components/ui/Loader';

import ImageUploadField from '../ImageUploadField';

type TProductVerificationCard = {
    product: NonNullable<TOpenFoodFactsProduct>;
};

function ProductVerificationCard({
    product: { product_name, quantity, brands, _id, image_url },
}: TProductVerificationCard) {
    const { toast } = useToast();
    const router = useRouter();

    const [formErrors, setFormErrors] = useState<TProductValidatorErrors>();

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

        const res = await acceptProductVerificationAction(formData);

        if (!res.success && res.errors) {
            setFormErrors(res.errors);
        }

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

        const res = await rejectProductVerificationAction(_id);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            router.push('/product-verification');
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <LegalNotice />
                    <div className="block text-center">
                        Weryfikujesz produkt o numerze EAN:
                        <br /> <strong className="text-lg">{_id}</strong>
                    </div>
                    <CardTitle className="pt-4">
                        <small className="text-xs text-muted-foreground">
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
                            formErrors={formErrors?.name}
                        />
                        <small className="mt-0 text-xs text-muted-foreground">
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
                            formErrors={formErrors?.quantity}
                        />
                        <small className="mt-0 text-xs text-muted-foreground">
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
                            formErrors={formErrors?.brands}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-2 mt-5 text-center text-blue">
                        Obrazek użytkownika
                    </div>
                    <div className={'relative h-[300px] w-full'}>
                        <Image
                            src={image_url ?? ''}
                            fill
                            className="object-contain"
                            alt={product_name ?? ''}
                        />
                    </div>
                    <ImageUploadField
                        image={imageState}
                        formErrorImage={formErrors?.image}
                        imageHeight={640}
                        imageWidth={640}
                        setImage={setImageState}
                        capture={true}
                        textSuccess="Nowy obrazek"
                    />
                </CardContent>
                <CardFooter className="flex-col">
                    <div className="mt-8 space-y-4">
                        {loading && <Loader className="mt-4" />}
                        <Button
                            className="w-full"
                            disabled={loading}
                            onClick={() => handleAcceptProduct()}>
                            Akceptuj produkt
                        </Button>
                        <Button
                            className="w-full"
                            disabled={loading}
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
