import { getUserRanking__Action } from '@/server/actions/user-actions';

import H2 from '@/components/ui/H2';
import Ranking from '@/components/modules/Ranking/Ranking';

async function rankingPage() {
    const res = await getUserRanking__Action();

    return (
        <section>
            <H2 className="mb-3">Ranking użytkowników:</H2>
            {res.ranking && <Ranking ranking={res.ranking} />}
        </section>
    );
}

export default rankingPage;
