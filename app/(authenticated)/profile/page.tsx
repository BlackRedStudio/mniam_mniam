import { checkSession } from '@/server/helpers/helpers';
import UserRepository from '@/server/repositories/UserRepository';

import Profile from '@/components/modules/Profile/Profile';

async function profilePage() {
    const session = await checkSession();

    const user = await UserRepository.first({
        id: session.user.id,
    });

    if (!user) return null;

    return (
        <>
            <Profile user={user} />
        </>
    );
}

export default profilePage;
