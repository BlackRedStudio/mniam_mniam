'use client';

import { useState } from 'react';
import { TRegisterUserReturn, updateProfile } from '@/actions/user-actions';
import { TUser } from '@/schema';

import { useToast } from '@/hooks/use-toast';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SignUpButton from '@/components/ui/SignUpButton';

type TProfile = {
    user: TUser;
};

function Profile({ user }: TProfile) {
    const { toast } = useToast();

    const [profileFormState, setProfileFormState] =
        useState<TRegisterUserReturn>();

    const handleProfileForm = async (formData: FormData) => {
        const res = await updateProfile(formData);

        setProfileFormState(res);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });
    };

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
            {/* <div className="mb-4">
                <Label htmlFor="avatar">Zmień swój Avatar</Label>
                <Input
                    type="file"
                    name="avatar"
                    className="mt-1"
                    placeholder=""
                    accept='image/jpeg,image/jpg'
                    required
                />
                {<FormError formErrors={profileFormState?.errors?.avatar} />}
            </div> */}
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
