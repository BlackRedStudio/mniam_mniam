import { TProductStatistics } from '@/types/types';
import H2 from '@/components/ui/H2';
import H3 from '@/components/ui/H3';
import { handleMultiplePersonText } from '@/lib/utils';

type TCommunityRatingProps = {
    productStatistics: TProductStatistics;
};

function CommunityRating({
    productStatistics: { averageRating, averagePrice, peopleRateCount },
}: TCommunityRatingProps) {

    const textVariant = handleMultiplePersonText(peopleRateCount);

    const peopleText = [
        'osoba oceniła', 'osoby oceniły', 'osób oceniło'
    ][textVariant];

    return (
        <div className="mb-7 text-center w-full">
            <H3 className="mr-2 pb-0 bg-muted p-4 text-xl">
                Ocena społeczności: <br />
                <strong>{averageRating}</strong>
            </H3>
            <H3 className="text-md mt-4">
                Średnia cena produktu: {averagePrice} zł
            </H3>
            <H3 className="text-md">
                ({peopleRateCount} {peopleText} ten produkt)
            </H3>
        </div>
    );
}

export default CommunityRating;
