'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type TProviderLayoutProps = {
    children: ReactNode;
};

function Providers({ children }: TProviderLayoutProps) {
    return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
