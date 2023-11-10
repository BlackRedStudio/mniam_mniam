import { ReactNode } from 'react';

import Header from '@/components/layout/Header';
import { ScrollArea } from '@/components/ui/scroll-area';

type TAuthenticatedLayoutProps = {
    children: ReactNode;
};

async function AuthenticatedLayout({ children }: TAuthenticatedLayoutProps) {

    return (
        <>
            <Header />
            <main>
                <ScrollArea className='h-[calc(100vh-90px)]'>
                    {children}
                </ScrollArea>
            </main>
        </>
    );
}

export default AuthenticatedLayout;
