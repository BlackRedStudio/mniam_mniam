import { TProductStatistics } from '@/types/types';
import { handleMultiplePersonText } from '@/lib/utils/utils';
import H3 from '@/components/ui/H3';
import { Icons } from '../Icons';
import { Separator } from '@/components/ui/Separator';

type TCommunityRatingProps = {
    productStatistics: TProductStatistics;
};

function CommunityRating({
    productStatistics: { averageRating, averagePrice, peopleCount },
}: TCommunityRatingProps) {
    const textVariant = handleMultiplePersonText(peopleCount);
    const priceIcons = [];

    if (isNaN(parseInt(averageRating))) {
        averageRating = 'Brak';
    }
    if (!isNaN(parseInt(averagePrice))) {

        let roundedPrice = Math.round(parseFloat(averagePrice));
        for(roundedPrice; roundedPrice > 0; roundedPrice--) {
            priceIcons.push(<Icons.dollarSign className='mr-[-4px]' />)
        }
    }

    const peopleText = ['osoba oceniła', 'osoby oceniły', 'osób oceniło'][
        textVariant
    ];

    return (
        <div className="w-full text-center">
            <H3 className="mr-2 bg-muted p-4 pb-3 text-xl">
                Ocena społeczności: <br />
                <strong>{averageRating}</strong>
            </H3>
            <H3 className="mt-2 text-base">
                ({peopleCount} {peopleText} ten produkt)
            </H3>
            <H3 className="mt-4 text-base flex justify-center">
                Średnia cena: {priceIcons.length > 0 ? priceIcons : 'Brak'}
            </H3>
            <Separator className='my-9' />

        </div>
    );
}

export default CommunityRating;
