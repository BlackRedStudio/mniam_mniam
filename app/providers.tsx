'use client';

import { ReactNode } from 'react';
import { Provider } from 'jotai';
import { SessionProvider } from 'next-auth/react';

type TProviderLayoutProps = {
    children: ReactNode;
};

function Providers({ children }: TProviderLayoutProps) {
    return (
        <SessionProvider>
            <Provider>{children}</Provider>
        </SessionProvider>
    );
}

export default Providers;
