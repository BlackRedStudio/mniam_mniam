import { Dispatch, SetStateAction, SyntheticEvent } from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import H3 from '@/components/ui/H3';

type TStarRatingProps = {
    rating: number;
    setRating: Dispatch<SetStateAction<number>>;
}

function StarRating({rating, setRating}: TStarRatingProps) {

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

    const handleRating = (e: SyntheticEvent) => {
        const starRating = parseInt(
            e.currentTarget.getAttribute('data-rating') ?? '0',
        );
        if (starRating > 0 && starRating < 6) {
            setRating(starRating);
        }
    };

    return (
        <div className="flex w-full mb-4">
            <H3 className="mr-2 w-24">Ocena:</H3>
            <Icons.star
                data-rating="1"
                onClick={e => handleRating(e)}
                className={cn(
                    'w-[30px] h-[30px] ml-1 mr-1',
                    rating > 0 ? ratingColorClass : '',
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
    );
}

export default StarRating;
