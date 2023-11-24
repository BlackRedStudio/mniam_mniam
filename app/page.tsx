import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import H1 from '@/components/ui/H1';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginTab from '../components/modules/LoginTab';
import RegisterTab from '../components/modules/RegisterTab';
import { authOptions } from './api/auth/[...nextauth]/route';

async function HomePage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/dashboard');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4">
            <H1>Mniam Mniam</H1>
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="mb-5 w-full">
                    <TabsTrigger className="w-1/2" value="login">
                        Logowanie
                    </TabsTrigger>
                    <TabsTrigger className="w-1/2" value="register">
                        Rejestracja
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginTab />
                </TabsContent>
                <TabsContent value="register">
                    <RegisterTab />
                </TabsContent>
            </Tabs>
        </main>
    );
}

export default HomePage;
