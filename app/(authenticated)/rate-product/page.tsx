'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { openFoodFactsProductStore } from '@/store/products-store';
import { useAtomValue } from 'jotai';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

function rateProductPage() {
    const openFoodFactsProduct = useAtomValue(openFoodFactsProductStore);

    if (openFoodFactsProduct === null) {
        return redirect('/dashboard');
    }

    return (
        <div className="page">
            <Card>
                <CardHeader>
                    <CardTitle>{openFoodFactsProduct.product_name ?? 'Brak tytułu'}</CardTitle>
                    <CardDescription>
                        {openFoodFactsProduct.brands ?? 'Brak przypisanych firm'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CardContent>
                        <div className="h-[350px] relative w-full mb-5">
                            {
                                openFoodFactsProduct.image_url ?
                                <Image
                                    src={openFoodFactsProduct.image_url ?? ''}
                                    fill
                                    className="object-contain"
                                    alt={openFoodFactsProduct.product_name ?? ''}
                                /> :
                                <div className='text-destructive'>
                                    Brak obrazka
                                </div>
                            }
                        </div>
                    </CardContent>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default rateProductPage;
