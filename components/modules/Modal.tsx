import { MouseEvent, ReactNode } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type AlertDialogProps = {
    children: ReactNode;
    title: string;
    description?: string;
    cancel?: (e: MouseEvent) => void;
    accept?: (e: MouseEvent) => void;
};

export default function AlertModal({
    children,
    title,
    description,
    cancel,
    accept
}: AlertDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {
                        description &&
                        <AlertDialogDescription>
                        {description}
                        </AlertDialogDescription>
                    }
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancel}>Anuluj</AlertDialogCancel>
                    <AlertDialogAction onClick={accept}>Kontynuuj</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
