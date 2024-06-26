import { ReactNode, Suspense } from 'react';

import Loader from '@/components/ui/Loader';
import { ScrollArea } from '@/components/ui/ScrollArea';
import Header from '@/components/layout/Header';

type TAuthenticatedLayoutProps = {
    children: ReactNode;
};

async function AuthenticatedLayout({ children }: TAuthenticatedLayoutProps) {
    return (
        <>
            <Header />
            <main>
                <ScrollArea className="h-[calc(100vh-90px)]">
                    <Suspense fallback={<Loader />}>{children}</Suspense>
                </ScrollArea>
            </main>
        </>
    );
}

export default AuthenticatedLayout;
