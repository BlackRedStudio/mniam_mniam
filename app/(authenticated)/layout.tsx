import { ReactNode } from "react";

type TAuthenticatedLayoutProps = {
    children: ReactNode;
};

function AuthenticatedLayout({ children }: TAuthenticatedLayoutProps) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {children}
        </main>
    )
}

export default AuthenticatedLayout;
