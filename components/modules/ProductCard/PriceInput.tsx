import { Dispatch, SetStateAction } from 'react';

import { handleCurrencyInput } from '@/lib/utils';
import H3 from '@/components/ui/H3';
import { Input } from '@/components/ui/input';

type TPriceInputProps = {
    price: string;
    setPrice: Dispatch<SetStateAction<string>>;
};

function PriceInput({ price, setPrice }: TPriceInputProps) {
    return (
        <div className="flex items-center w-full">
            <H3 className="mr-2 w-24">Cena:</H3>{' '}
            <Input
                type="text"
                className="max-w-[100px]"
                onChange={e => {
                    const value = handleCurrencyInput(e.target.value);
                    if (value !== null) {
                        setPrice(value);
                    }
                }}
                placeholder="0.00"
                value={price}
            />{' '}
            <span className="pl-1">zł</span>
        </div>
    );
}

export default PriceInput;
