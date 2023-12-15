'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { getNameInitials } from '@/lib/utils/utils';

import { Avatar as AvatarEl, AvatarFallback, AvatarImage } from '../ui/Avatar';

function Avatar() {
    const { data: session } = useSession();

    if (!session)
        return (
            <AvatarEl>
                <AvatarFallback />
            </AvatarEl>
        );

    const nameInitials = session.user?.name
        ? getNameInitials(session.user.name)
        : 'MM';

    return (
        <Link href="/profile">
            <AvatarEl>
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback>
                    {!session.user?.image ? nameInitials : null}
                </AvatarFallback>
            </AvatarEl>
        </Link>
    );
}

export default Avatar;
