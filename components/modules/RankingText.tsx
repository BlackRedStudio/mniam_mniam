import { TUserRankingCounter } from '@/types/types';
import { handleMultiplePersonText } from '@/lib/utils/utils';

type TRankingTextProps = {
    ranking: TUserRankingCounter;
};

function RankingText({ ranking }: TRankingTextProps) {
    const totalProductsTextVariant = handleMultiplePersonText(
        ranking.totalProductsRateCount,
    );
    const mniamPointsTextVariant = handleMultiplePersonText(
        ranking.mniamPoints,
    );

    const productsText = ['produkt', 'produkty', 'produktów'][
        totalProductsTextVariant
    ];

    const pointsText = ['punkt', 'punkty', 'punktów'][mniamPointsTextVariant];

    return (
        <>
            <div>
                Oceniłeś do tej pory{' '}
                <strong className="text-orange">
                    {ranking.totalProductsRateCount}
                </strong>{' '}
                {productsText},
            </div>
            <div>
                <strong className="text-orange">
                    {ranking.firstRateCount}
                </strong>{' '}
                z nich oceniłeś jako <strong>pierwszy</strong>,
            </div>
            <div>
                do{' '}
                <strong className="text-orange">
                    {ranking.propsAddedCount}
                </strong>{' '}
                dodałeś <strong>atrybuty</strong>,
            </div>
            <div>
                do{' '}
                <strong className="text-orange">
                    {ranking.imgUploadedCount}
                </strong>{' '}
                przesłałeś <strong>zdjęcie</strong>.
            </div>
            <div className="mt-3 text-xl">
                Łącznie zdobyłeś{' '}
                <strong className="text-orange">{ranking.mniamPoints}</strong>{' '}
                {pointsText}.
            </div>
            <div className="mt-5 text-center text-base">
                Gratulujemy i dziękujęmy za Twój wkład w rozbudowę aplikacji.
            </div>
        </>
    );
}

export default RankingText;
