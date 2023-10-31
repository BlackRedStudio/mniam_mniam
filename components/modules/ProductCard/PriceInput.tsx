import { Dispatch, SetStateAction } from 'react';

import H3 from '@/components/ui/H3';
import { Input } from '@/components/ui/input';

type TPriceInputProps = {
    price: number;
    setPrice: Dispatch<SetStateAction<number>>;
};

function PriceInput({ price, setPrice }: TPriceInputProps) {
    return (
        <div className="flex items-center w-full">
            <H3 className="mr-2 w-24">Cena:</H3>{' '}
            <Input
                type="number"
                className="max-w-[100px]"
                onChange={e => {
                    const val = e.target.value || ''
                    setPrice(parseFloat(val))
                }}
                placeholder='0.00'
                value={price || ''}
            />{' '}
            <span className="pl-1">zł</span>
        </div>
    );
}

export default PriceInput;
