import { TProductStatistics } from '@/types/types';
import { handleMultiplePersonText } from '@/lib/utils/utils';
import H3 from '@/components/ui/H3';

type TCommunityRatingProps = {
    productStatistics: TProductStatistics;
};

function CommunityRating({
    productStatistics: { averageRating, averagePrice, peopleRateCount },
}: TCommunityRatingProps) {
    const textVariant = handleMultiplePersonText(peopleRateCount);

    if (isNaN(parseInt(averageRating))) {
        averageRating = 'Brak';
    }
    if (isNaN(parseInt(averagePrice))) {
        averagePrice = 'Brak';
    }

    const peopleText = ['osoba oceniła', 'osoby oceniły', 'osób oceniło'][
        textVariant
    ];

    return (
        <div className="mb-7 w-full text-center">
            <H3 className="mr-2 bg-muted p-4 pb-0 text-xl">
                Ocena społeczności: <br />
                <strong>{averageRating}</strong>
            </H3>
            <H3 className="mt-2 text-base">
                ({peopleRateCount} {peopleText} ten produkt)
            </H3>
            <H3 className="mt-4 text-base">
                Średnia cena produktu: {averagePrice} zł
                <br />
                <small>(z ostatnich 180 dni)</small>
            </H3>
        </div>
    );
}

export default CommunityRating;
