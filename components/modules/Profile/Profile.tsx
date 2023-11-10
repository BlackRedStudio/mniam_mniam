'use client';

import { useState, SyntheticEvent } from 'react';
import { TProfileUserReturn, deleteAvatar, updateProfile } from '@/actions/user-actions';
import { TUser } from '@/schema';
import { useSession } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SignUpButton from '@/components/ui/SignUpButton';
import { Button } from '@/components/ui/button';

type TProfile = {
    user: TUser;
};

function Profile({ user }: TProfile) {
    const { toast } = useToast();
    const { data: session, update } = useSession();

    const [profileFormState, setProfileFormState] =
        useState<TProfileUserReturn>();

    if (!session) return null;

    const handleProfileForm = async (formData: FormData) => {
        const res = await updateProfile(formData);

        setProfileFormState(res);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if (res.data) {
            update({
                name: res.data.name || session.user.name,
                email: res.data.email || session.user.email,
                image: res.data.image || session.user.image,
            });
        }
    };

    const handleDeleteAvatar = async (e: SyntheticEvent) => {
        e.preventDefault();
        const res = await deleteAvatar();

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if (res.success) {
            update({
                image: '',
            });
        }
    }

    return (
        <form action={formData => handleProfileForm(formData)}>
            <div className="mb-4">
                <Label htmlFor="name">Nazwa użytkownika</Label>
                <Input
                    type="text"
                    name="name"
                    className="mt-1"
                    placeholder="Wpisz swoje imię oraz nazwisko"
                    defaultValue={user.name ?? user.email}
                    required
                />
                {<FormError formErrors={profileFormState?.errors?.name} />}
            </div>
            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                    type="email"
                    name="email"
                    className="mt-1"
                    placeholder="Wpisz swój email"
                    defaultValue={user.email}
                    required
                />
                {<FormError formErrors={profileFormState?.errors?.email} />}
            </div>
            <div className="mb-4">
                <Label htmlFor="avatar">Zmień swój Avatar</Label>
                <Input
                    type="file"
                    name="avatar"
                    className="mt-1"
                    accept="image/jpeg, image/jpg"
                />
                {<FormError formErrors={profileFormState?.errors?.image} />}
            </div>
            {
                user.image &&
                <Button className='mb-5' onClick={e => handleDeleteAvatar(e)}>Usuń swój Avatar</Button>
            }
            <div className="mb-4">
                <Label htmlFor="password">Hasło</Label>
                <Input
                    type="password"
                    name="password"
                    className="mt-1"
                    placeholder="Wpisz swoje hasło"
                />
                {<FormError formErrors={profileFormState?.errors?.password} />}
            </div>
            <div className="mb-4">
                <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
                <Input
                    type="password"
                    name="passwordConfirm"
                    className="mt-1"
                    placeholder="Wpisz ponownie swoje hasło"
                />
                {
                    <FormError
                        formErrors={profileFormState?.errors?.passwordConfirm}
                    />
                }
            </div>
            <SignUpButton title="Zmień dane profilowe" />
        </form>
    );
}

export default Profile;
