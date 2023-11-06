import { ReactNode } from 'react';

import { getServerSession } from 'next-auth';
import Header from '@/components/layout/Header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authOptions } from '../api/auth/[...nextauth]/route';

type TAuthenticatedLayoutProps = {
    children: ReactNode;
};

async function AuthenticatedLayout({ children }: TAuthenticatedLayoutProps) {

    const session = await getServerSession(authOptions);
    if(!session) return null;

    return (
        <>
            <Header session={session} />
            <main>
                <ScrollArea className='h-[calc(100vh-90px)]'>
                    {children}
                </ScrollArea>
            </main>
        </>
    );
}

export default AuthenticatedLayout;
