import { getUserRankings__Action } from '@/server/actions/user-actions';

import H2 from '@/components/ui/H2';

async function rankingsPage() {
    const res = await getUserRankings__Action();

    return (
        <section>
            <H2 className="mb-3">Rankingi</H2>
        </section>
    );
}

export default rankingsPage;
