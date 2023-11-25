'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { getNameInitials } from '@/lib/utils/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

function AvatarElement() {
    const { data: session } = useSession();

    if (!session)
        return (
            <Avatar>
                <AvatarFallback />
            </Avatar>
        );

    const nameInitials = session.user?.name
        ? getNameInitials(session.user.name)
        : 'MM';

    return (
        <Link href="/profile">
            <Avatar>
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback>
                    {!session.user?.image ? nameInitials : null}
                </AvatarFallback>
            </Avatar>
        </Link>
    );
}

export default AvatarElement;
