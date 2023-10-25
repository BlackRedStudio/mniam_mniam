import { ReactNode } from 'react';

import { getServerSession } from 'next-auth';
import Header from '@/components/layout/Header';

type TAuthenticatedLayoutProps = {
    children: ReactNode;
};

async function AuthenticatedLayout({ children }: TAuthenticatedLayoutProps) {

    const session = await getServerSession();
    if(!session) return null;

    return (
        <>
            <Header session={session} />
            <main className="flex min-h-screen flex-col items-center justify-start p-4">
                {children}
            </main>
        </>
    );
}

export default AuthenticatedLayout;
