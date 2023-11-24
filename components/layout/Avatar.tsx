'use client';

import { useSession } from 'next-auth/react';

import { getNameInitials } from '@/lib/utils/utils';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
        <Avatar>
            <AvatarImage src={session.user.image || ''} />
            <AvatarFallback>
                {!session.user?.image ? nameInitials : null}
            </AvatarFallback>
        </Avatar>
    );
}

export default AvatarElement;
