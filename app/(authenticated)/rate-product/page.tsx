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
import { Icons } from '@/components/Icons';
import { MouseEvent, SyntheticEvent, useState } from 'react';
import H2 from '@/components/ui/H2';
import { cn } from '@/lib/utils';

function rateProductPage() {

    const [rating, setRating] = useState(0);

    let ratingColorClass = '';

    switch (rating) {
        case 1:
            ratingColorClass = 'fill-destructive';
            break;
        case 2:
            ratingColorClass = 'fill-orange';
            break;
        case 3:
            ratingColorClass = 'fill-yellow';
            break;
        case 4:
            ratingColorClass = 'fill-success';
            break;
        case 5:
            ratingColorClass = 'fill-blue';
            break;
        default:
            break;
    }

    const openFoodFactsProduct = useAtomValue(openFoodFactsProductStore);
    
    if (openFoodFactsProduct === null) {
        return redirect('/dashboard');
    }

    const handleRating = (e: SyntheticEvent) => {
        const starRating = parseInt( e.currentTarget.getAttribute('data-rating') ?? '0' );
        setRating( starRating );
    }

    return (
        <div className="page">
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
                    <div className="h-[250px] relative w-full">
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
                <CardFooter>
                    <div className="flex justify-center w-full">
                        <H2 className='mr-2'>Twoja ocena:</H2>
                        <Icons.star data-rating="1" onClick={e => handleRating(e)} className={cn('w-[30px] h-[30px] ml-1 mr-1', ratingColorClass)} />
                        <Icons.star data-rating="2" onClick={e => handleRating(e)} className={cn('w-[30px] h-[30px] ml-1 mr-1', rating > 1 ? ratingColorClass : '')} />
                        <Icons.star data-rating="3" onClick={e => handleRating(e)} className={cn('w-[30px] h-[30px] ml-1 mr-1', rating > 2 ? ratingColorClass : '')} />
                        <Icons.star data-rating="4" onClick={e => handleRating(e)} className={cn('w-[30px] h-[30px] ml-1 mr-1', rating > 3 ? ratingColorClass : '')} />
                        <Icons.star data-rating="5" onClick={e => handleRating(e)} className={cn('w-[30px] h-[30px] ml-1 mr-1', rating > 4 ? ratingColorClass : '')} />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default rateProductPage;
