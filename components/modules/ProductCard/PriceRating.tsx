import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils/utils';
import H3 from '@/components/ui/H3';

import { Icons } from '../Icons';

type TPriceRatingProps = {
    title?: string;
    className?: string;
    price: number;
    setPrice: Dispatch<SetStateAction<number>>;
};

function PriceRating({ title, className, price, setPrice }: TPriceRatingProps) {
    const handleClick = (priceValue: number) => {
        if (priceValue > 0 && priceValue < 4) {
            setPrice(priceValue);
        }
    };

    const priceIcons = [];
    for (let i = 1; i <= 3; i++) {
        priceIcons.push(
            <Icons.dollarSign
                key={i}
                className={cn('h-9 w-9', price < i ? 'text-gray-400' : '')}
                onClick={() => handleClick(i)}
            />,
        );
    }

    return (
        <div className={cn('flex w-full items-center', className)}>
            <H3 className="mr-2 w-24">{title || 'Cena: '}</H3>
            {priceIcons}
        </div>
    );
}

export default PriceRating;
