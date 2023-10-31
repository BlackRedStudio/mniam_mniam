import { Dispatch, SetStateAction } from 'react';

import { TCategoriesIds } from '@/types/types';
import { categories } from '@/lib/config';
import H3 from '@/components/ui/H3';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type TCategorySelectorProps = {
    category: string;
    setCategory: Dispatch<SetStateAction<TCategoriesIds | ''>>;
};

function CategorySelector({ category, setCategory }: TCategorySelectorProps) {
    return (
        <div className="flex items-center mb-4 w-full">
            <H3 className="mr-2 w-24">Kategoria:</H3>
            <Select
                onValueChange={e => setCategory(e as TCategoriesIds)}
                defaultValue={category}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rozwiń listę" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default CategorySelector;
