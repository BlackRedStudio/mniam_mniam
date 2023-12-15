import { TUserRankingCounter } from "@/types/types";

type TRankingTextProps = {
    ranking: TUserRankingCounter
}

function RankingText({ranking}: TRankingTextProps) {
    return (
        <>
            <div>Oceniłeś do tej pory <strong className='text-orange'>{ranking.totalProductsRateCount}</strong> produktów,</div>
            <div><strong className='text-orange'>{ranking.firstRateCount}</strong> z nich oceniłeś jako <strong>pierwszy</strong>,</div>
            <div>do <strong className='text-orange'>{ranking.propsAddedCount}</strong> dodałeś <strong>atrybuty</strong>,</div>
            <div>a do <strong className='text-orange'>{ranking.imgUploadedCount}</strong> <strong>zdjęcia</strong>.</div>
            <div className="mt-3 text-xl">Łącznie zdobyłeś <strong className='text-orange'>{ranking.mniamPoints}</strong> punkty.</div>
            <div className="mt-5 text-base text-center">Gratulujemy i dziękujęmy za Twój wkład w rozbudowę aplikacji.</div>
        </>
    )
}

export default RankingText;
