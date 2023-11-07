import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

import { cn } from '@/lib/utils';
import H3 from '@/components/ui/H3';
import { Icons } from '@/components/modules/Icons';

type TStarRatingProps = {
    rating: number;
    setRating?: Dispatch<SetStateAction<number>>;
    showHeader?: boolean;
    bigStars?: boolean;
};

function StarRating({
    rating,
    setRating,
    showHeader = true,
    bigStars = true,
}: TStarRatingProps) {
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
        default:
            ratingColorClass = 'fill-blue';
            break;
    }

    const starClasses = bigStars ? 'w-[30px] h-[30px] ml-1 mr-1' : 'w-[24px] h-[24px]';

    const handleRating = (e: SyntheticEvent) => {
        if (!setRating) return false;

        const starRating = parseInt(
            e.currentTarget.getAttribute('data-rating') ?? '0',
        );
        if (starRating > 0 && starRating < 6) {
            setRating(starRating);
        }
    };

    return (
        <div className="flex w-full mb-4">
            {showHeader && <H3 className="mr-2 w-24">Ocena:</H3>}
            <Icons.star
                data-rating="1"
                onClick={e => handleRating(e)}
                className={cn(
                    starClasses,
                    rating > 0 ? ratingColorClass : '',
                )}
            />
            <Icons.star
                data-rating="2"
                onClick={e => handleRating(e)}
                className={cn(
                    starClasses,
                    rating > 1 ? ratingColorClass : '',
                )}
            />
            <Icons.star
                data-rating="3"
                onClick={e => handleRating(e)}
                className={cn(
                    starClasses,
                    rating > 2 ? ratingColorClass : '',
                )}
            />
            <Icons.star
                data-rating="4"
                onClick={e => handleRating(e)}
                className={cn(
                    starClasses,
                    rating > 3 ? ratingColorClass : '',
                )}
            />
            <Icons.star
                data-rating="5"
                onClick={e => handleRating(e)}
                className={cn(
                    starClasses,
                    rating > 4 ? ratingColorClass : '',
                )}
            />
        </div>
    );
}

export default StarRating;
