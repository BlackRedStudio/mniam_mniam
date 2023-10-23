'use client'

import { ReactNode } from 'react';
import { SessionProvider } from "next-auth/react"

type TProviderLayoutProps = {
    children: ReactNode;
};

export default function Providers({ children }: TProviderLayoutProps) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
