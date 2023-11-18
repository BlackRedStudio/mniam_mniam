import { Dispatch, SetStateAction } from 'react';

import { cn, handleCurrencyInput } from '@/lib/utils';
import H3 from '@/components/ui/H3';
import { Input } from '@/components/ui/input';

type TPriceInputProps = {
    title?: string;
    className?: string;
    price: string;
    setPrice: Dispatch<SetStateAction<string>>;
};

function PriceInput({ title, className, price, setPrice }: TPriceInputProps) {
    return (
        <div className={cn(
            'flex items-center w-full',
            className
        )}>
            <H3 className="mr-2 w-24">{title || 'Cena: '}</H3>
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
