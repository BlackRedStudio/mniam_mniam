import { Dispatch, SetStateAction, useState } from 'react';

import { TCategoriesIds } from '@/types/types';
import { categories, categoryTypes } from '@/lib/config/config';
import { cn } from '@/lib/utils/utils';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader } from '@/components/ui/Card';
import H3 from '@/components/ui/H3';
import { ScrollArea } from '@/components/ui/ScrollArea';

import { Icons } from '../Icons';

type TCategorySelectorProps = {
    className?: string;
    category: string;
    setCategory: Dispatch<SetStateAction<TCategoriesIds | ''>>;
};

function CategorySelector({
    className,
    category,
    setCategory,
}: TCategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [categoryType, setCategoryType] = useState('');

    return (
        <div className={cn('mb-4 flex w-full items-center', className)}>
            <H3 className="mr-2 w-24">Kategoria: </H3>
            <Button variant={'outline'} onClick={() => setOpen(true)}>
                {categories.find(cat => cat.id === category)?.label ||
                    `Wybierz kategorię `}
            </Button>
            <AlertDialog open={open}>
                <AlertDialogContent overlayClick={() => setOpen(false)} className='p-0 h-full'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='pt-3'>Wybierz kategorię</AlertDialogTitle>
                        <div className='p-3'>
                            <Button
                                variant={
                                    categoryType === '' ? 'default' : 'outline'
                                }
                                onClick={() => setCategoryType('')}>
                                Wszystkie
                            </Button>
                            {categoryTypes.map(catType => (
                                <Button
                                    key={catType.id}
                                    variant={
                                        catType.id === categoryType
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() => setCategoryType(catType.id)}>
                                    {catType.label}
                                </Button>
                            ))}
                        </div>
                        <ScrollArea className="h-[68vh]">
                            <AlertDialogDescription className="grid grid-cols-3 gap-2">
                                {categories
                                    .filter(cat => {
                                        if (categoryType) {
                                            if (cat.type === categoryType) {
                                                return cat;
                                            }
                                        } else {
                                            return cat;
                                        }
                                    })
                                    .map(cat => {
                                        const CategoryIcon = Icons[cat.icon];

                                        return (
                                            <Card
                                                key={cat.id}
                                                className={
                                                    cat.id === category
                                                        ? 'bg-orange fill-white text-white'
                                                        : ''
                                                }
                                                onClick={() => {
                                                    setCategory(cat.id);
                                                    setOpen(false);
                                                }}>
                                                <CardHeader className="px-1 py-3">
                                                    <CategoryIcon className="mx-auto mb-3 h-6 w-6" />
                                                    {cat.label}
                                                </CardHeader>
                                            </Card>
                                        );
                                    })}
                            </AlertDialogDescription>
                        </ScrollArea>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default CategorySelector;
