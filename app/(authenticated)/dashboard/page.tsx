import { getUserRanking__Action } from '@/server/actions/user-actions';
import { getServerSession } from 'next-auth';

import H2 from '@/components/ui/H2';
import { Separator } from '@/components/ui/Separator';
import ProductScannerWrapper from '@/components/modules/ProductScanner/ProductScannerWrapper';
import ProductSearch from '@/components/modules/ProductSearch/ProductSearch';
import RankingText from '@/components/modules/RankingText';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const userName = session.user?.name?.split(' ')[0] ?? 'Użytkowniku';

    const res = await getUserRanking__Action(true);

    return (
        <section>
            <H2 className="mb-3 text-center text-ellipsis overflow-hidden max-w-xs mx-auto">
                Witaj {userName},<br />
                co dzisiaj smakujemy?
            </H2>
            <ProductScannerWrapper camera={session.user.camera} />
            <Separator className="my-8" />
            {res.ranking?.length ? <RankingText ranking={res.ranking[0]} /> : 'Dodaj nazwę użytkownika aby wziąć udział w rankingu'}
            {session.user.role === 'admin' && (
                <>
                    <Separator className="my-8" />
                    <ProductSearch />
                </>
            )}
        </section>
    );
}

export default DashboardPage;
