import { getServerSession } from 'next-auth';

import H2 from '@/components/ui/H2';
import { Separator } from '@/components/ui/Separator';
import ProductScannerWrapper from '@/components/modules/ProductScanner/ProductScannerWrapper';
import ProductSearch from '@/components/modules/ProductSearch/ProductSearch';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const userName = session.user?.name?.split(' ')[0] ?? 'Użytkowniku';

    return (
        <section>
            <H2 className="mb-6 text-center">
                Witaj {userName},<br />
                co dzisiaj smakujemy?
            </H2>
            <ProductScannerWrapper />
            <Separator className="my-8" />
            <ProductSearch />
        </section>
    );
}

export default DashboardPage;
