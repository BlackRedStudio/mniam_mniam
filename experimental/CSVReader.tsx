'use client'

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// import { insertCSVProductsAction } from '@/server/actions/product-actions';
import {SyntheticEvent, useRef} from 'react';
import { csvToArray } from './experimental_utils';

function CSVReader() {

    const csvInput = useRef<HTMLInputElement>(null);

    const handleFormSubmit = (e: SyntheticEvent) => {
        if (csvInput.current && csvInput.current.files) {
            e.preventDefault();
            const input = csvInput.current.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const text = e.target?.result;

                if(text) {
                    const csvArray = csvToArray(text as string);
                    // insertCSVProductsAction(csvArray as unknown as TProductInsert[]);
                }
            };
            reader.readAsText(input);
        }
    }

    return (
            <form className='p-7' onSubmit={e => handleFormSubmit(e)}>
                <Input ref={csvInput} type="file" accept=".csv" />
                <br />
                <Button>Importuj</Button>
            </form>
    )
}

export default CSVReader;
