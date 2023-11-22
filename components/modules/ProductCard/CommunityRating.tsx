import { TProductStatistics } from '@/types/types';

import H3 from '@/components/ui/H3';
import { handleMultiplePersonText } from '@/lib/utils/utils';

type TCommunityRatingProps = {
    productStatistics: TProductStatistics;
};

function CommunityRating({
    productStatistics: { averageRating, averagePrice, peopleRateCount },
}: TCommunityRatingProps) {
    const textVariant = handleMultiplePersonText(peopleRateCount);

    if(isNaN(parseInt(averageRating))) {
        averageRating = 'Brak';
    }
    if(isNaN(parseInt(averagePrice))) {
        averagePrice = 'Brak';
    }

    const peopleText = [
        'osoba oceniła', 'osoby oceniły', 'osób oceniło'
    ][textVariant];

    return (
        <div className="mb-7 text-center w-full">
            <H3 className="mr-2 pb-0 bg-muted p-4 text-xl">
                Ocena społeczności: <br />
                <strong>{averageRating}</strong>
            </H3>
            <H3 className="text-md mt-2">
                ({peopleRateCount} {peopleText} ten produkt)
            </H3>
            <H3 className="text-md mt-4">
                Średnia cena produktu: {averagePrice} zł
                <br /><small>(z ostatnich 180 dni)</small>
            </H3>
        </div>
    );
}

export default CommunityRating;
