'use client';

import { SyntheticEvent, useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { openFoodFactsProductStore } from '@/store/products-store';
import { useAtomValue } from 'jotai';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import H3 from '@/components/ui/H3';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/Icons';

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
        const starRating = parseInt(
            e.currentTarget.getAttribute('data-rating') ?? '0',
        );
        setRating(starRating);
    };

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
                <CardFooter className="flex-col">
                    <div className="mb-7 text-center w-full">
                        <H3 className="mr-2 pb-0">
                            Ocena społeczności: <strong>4,27</strong>
                        </H3>
                        <H3 className="text-md">
                            (1500 osób oceniło ten produkt)
                        </H3>
                    </div>
                    <div className="flex w-full mb-4">
                        <H3 className="mr-2 w-24">Ocena:</H3>
                        <Icons.star
                            data-rating="1"
                            onClick={e => handleRating(e)}
                            className={cn(
                                'w-[30px] h-[30px] ml-1 mr-1',
                                ratingColorClass,
                            )}
                        />
                        <Icons.star
                            data-rating="2"
                            onClick={e => handleRating(e)}
                            className={cn(
                                'w-[30px] h-[30px] ml-1 mr-1',
                                rating > 1 ? ratingColorClass : '',
                            )}
                        />
                        <Icons.star
                            data-rating="3"
                            onClick={e => handleRating(e)}
                            className={cn(
                                'w-[30px] h-[30px] ml-1 mr-1',
                                rating > 2 ? ratingColorClass : '',
                            )}
                        />
                        <Icons.star
                            data-rating="4"
                            onClick={e => handleRating(e)}
                            className={cn(
                                'w-[30px] h-[30px] ml-1 mr-1',
                                rating > 3 ? ratingColorClass : '',
                            )}
                        />
                        <Icons.star
                            data-rating="5"
                            onClick={e => handleRating(e)}
                            className={cn(
                                'w-[30px] h-[30px] ml-1 mr-1',
                                rating > 4 ? ratingColorClass : '',
                            )}
                        />
                    </div>
                    <div className="flex items-center mb-4 w-full">
                        <H3 className="mr-2 w-24">Kategoria:</H3>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Rozwiń listę" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jelly">Żelki</SelectItem>
                                <SelectItem value="chocolate">
                                    Czekolada
                                </SelectItem>
                                <SelectItem value="bakes">Wypieki</SelectItem>
                                <SelectItem value="sugars">Cukierki</SelectItem>
                                <SelectItem value="cookies">Ciastka</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center w-full">
                        <H3 className="mr-2 w-24">Cena:</H3>{' '}
                        <Input type="number" className="max-w-[100px]" defaultValue={'0.00'} /> <span className='pl-1'>zł</span>
                    </div>
                    <div className="mt-8">
                        <Button className="mb-4 w-full">Zapisz ocenę</Button>
                        <Button className='w-full' variant={'outline'}>
                            Zapisz ocenę i dodaj do mojej listy
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default rateProductPage;
