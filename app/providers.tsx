'use client'

import { Provider } from 'jotai';
import { ReactNode } from 'react';
// import { SessionProvider } from "next-auth/react"

type TProviderLayoutProps = {
    children: ReactNode;
};

function Providers({ children }: TProviderLayoutProps) {
    return (
        <Provider>
            {children}
        </Provider>
    );
}

export default Providers;
