import { SetStateAction } from 'react';

import { TRankingType } from '@/types/types';
import { rankingTypes } from '@/lib/config/config';
import { Button } from '@/components/ui/Button';

import { Icons } from '../Icons';

type TRankingTypeSelectorProps = {
    type: TRankingType['type'];
    setType: (value: SetStateAction<TRankingType['type']>) => void;
};

function RankingTypeSelector({ type, setType }: TRankingTypeSelectorProps) {
    return (
        <div className="flex justify-center space-x-2">
            {rankingTypes.map(v => {
                const TypeIcon = Icons[v.icon];

                return (
                    <Button
                        variant={type === v.type ? 'orange' : 'outline'}
                        onClick={() => setType(v.type)}
                    >
                        <TypeIcon />
                    </Button>
                );
            })}
        </div>
    );
}

export default RankingTypeSelector;
