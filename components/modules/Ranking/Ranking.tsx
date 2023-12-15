'use client';

import { useState } from 'react';

import { TRankingType, TUserRankingCounter } from '@/types/types';
import { rankingTypes } from '@/lib/config/config';
import H3 from '@/components/ui/H3';

import RankingTable from './RankingTable';
import RankingTypeSelector from './RankingTypeSelector';
import { useSession } from 'next-auth/react';

type TRankingProps = {
    ranking: TUserRankingCounter[];
};

function Ranking({ ranking }: TRankingProps) {

    const {data: session} = useSession();

    const [type, setType] = useState<TRankingType['type']>('total');

    const currentRankingType = rankingTypes.find(v => v.type === type);

    if (!currentRankingType || !session) return null;

    return (
        <>
            <div className="mb-4 mt-6">
                <RankingTypeSelector type={type} setType={setType} />
                <H3 className="mt-4 text-center">{currentRankingType.name}</H3>
            </div>
            <RankingTable
                currentRankingType={currentRankingType}
                session={session}
                ranking={ranking
                    .filter(user => user[currentRankingType.key] > 0)
                    .sort(
                        (a, b) =>
                            b[currentRankingType.key] -
                            a[currentRankingType.key],
                    )}
            />
        </>
    );
}

export default Ranking;
