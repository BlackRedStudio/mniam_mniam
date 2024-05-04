import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils/utils';
import H3 from '@/components/ui/H3';
import { Icons } from '@/components/modules/Icons';

type TStarRatingProps = {
    rating: number;
    setRating?: Dispatch<SetStateAction<number>>;
    hints?: boolean;
    showHeader?: boolean;
    bigStars?: boolean;
    className?: string;
};

type TRatingColorClassMap = {
    [key: number]: string;
};

const ratingColorClassMap: TRatingColorClassMap = {
    1: 'fill-destructive stroke-destructive',
    2: 'fill-orange stroke-orange',
    3: 'fill-yellow stroke-yellow',
    4: 'fill-success stroke-success',
    5: 'fill-blue stroke-blue',
};

type TStarHintsMap = {
    [key: number]: string;
};

const starHints: TStarHintsMap = {
    1: 'Fee, bardzo mi nie smakuje.',
    2: 'Nie smakuje mi.',
    3: 'Przeciętny produkt.',
    4: 'Bardzo dobry produkt.',
    5: 'Wyśmienity produkt, mój ulubiony.',
};

function StarRating({
    rating,
    setRating,
    hints = false,
    showHeader = true,
    bigStars = true,
    className,
}: TStarRatingProps) {
    const ratingColorClass = ratingColorClassMap[rating] || '';

    const starClasses = bigStars
        ? 'w-[30px] h-[30px] ml-1 mr-1'
        : 'w-[24px] h-[24px]';

    const handleRating = (starRating: number) => {
        if (!setRating) return false;

        if (starRating > 0 && starRating < 6) {
            setRating(starRating);
        }
    };

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Icons.star
                key={i}
                data-rating={i}
                onClick={() => handleRating(i)}
                className={cn(
                    starClasses,
                    rating > i - 1 ? ratingColorClass : '',
                )}
            />,
        );
    }

    return (
        <div className={cn('relative mb-4 flex w-full', className)}>
            {showHeader && <H3 className="mr-2 w-24">Ocena:</H3>}
            {hints && (
                <div className="absolute right-0 top-[-32px] text-sm">
                    {starHints[rating]}
                </div>
            )}
            {stars}
        </div>
    );
}

export default StarRating;
