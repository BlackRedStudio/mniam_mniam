import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils/utils';
import H3 from '@/components/ui/H3';
import { Icons } from '@/components/modules/Icons';

type TStarRatingProps = {
    rating: number;
    setRating?: Dispatch<SetStateAction<number>>;
    showHeader?: boolean;
    bigStars?: boolean;
    className?: string;
};

type TRatingColorClassMap = {
    [key: number]: string;
};

const ratingColorClassMap: TRatingColorClassMap = {
    1: 'fill-destructive',
    2: 'fill-orange',
    3: 'fill-yellow',
    4: 'fill-success',
    5: 'fill-blue',
};

function StarRating({
    rating,
    setRating,
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
        <div className={cn(
            'flex w-full mb-4',
            className
        )}>
            {showHeader && <H3 className="mr-2 w-24">Ocena:</H3>}
            {stars}
        </div>
    );
}

export default StarRating;
