'use client';

import { SyntheticEvent, useState } from 'react';
import {
    deleteAvatarAction,
    updateProfileAction,
} from '@/server/actions/user-actions';
import { TUser } from '@/server/schemas';
import { useSession } from 'next-auth/react';

import { useToast } from '@/lib/hooks/use-toast';
import { TProfileValidatorErrors } from '@/lib/validators/user-validator';
import { Button } from '@/components/ui/Button';
import FormError from '@/components/ui/FormError';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import SignUpButton from '@/components/ui/SignUpButton';

import { Icons } from '../Icons';
import ImageUploadField from '../ImageUploadField';

type TProfile = {
    user: TUser;
};

function Profile({ user }: TProfile) {
    const { toast } = useToast();
    const { data: session, update } = useSession();

    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<TProfileValidatorErrors>();
    const [avatar, setAvatar] = useState<File | null>(null);

    if (!session) return null;

    const handleProfileForm = async (formData: FormData) => {
        // re-set field value from binary input to controlled formatted avatar photo
        if (avatar) {
            formData.set('avatar', avatar);
        }

        const res = await updateProfileAction(formData);

        if (!res.success && res.errors) {
            setFormErrors(res.errors);
        }

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if (res.success && res.data) {
            update({
                name: res.data.name || session.user.name,
                email: res.data.email || session.user.email,
                image: res.data.image || session.user.image,
            });
        }
    };

    const handleDeleteAvatar = async (e: SyntheticEvent) => {
        e.preventDefault();
        const res = await deleteAvatarAction();

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        if (res.success) {
            update({
                image: '',
            });
        }
    };

    return (
        <form action={formData => handleProfileForm(formData)}>
            <div className="mb-4">
                <Label htmlFor="name">Nazwa użytkownika</Label>
                <Input
                    type="text"
                    name="name"
                    className="mt-1"
                    placeholder="Wpisz swój nick lub ksywę"
                    defaultValue={user.name ?? user.email}
                    required
                />
                <FormError formErrors={formErrors?.name} />
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
                <FormError formErrors={formErrors?.email} />
            </div>
            <div className="relative mb-4">
                <Label htmlFor="password">Hasło</Label>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="mt-1"
                    placeholder="Wpisz swoje hasło"
                />
                <FormError formErrors={formErrors?.password} />
                {showPassword ? (
                    <Icons.eye
                        className="absolute bottom-[7px] right-[7px]"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <Icons.eyeOff
                        className="absolute bottom-[7px] right-[7px]"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>
            <div className="relative mb-4">
                <Label htmlFor="passwordConfirm">Powtórz hasło</Label>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    name="passwordConfirm"
                    className="mt-1"
                    placeholder="Wpisz ponownie swoje hasło"
                />
                <FormError formErrors={formErrors?.passwordConfirm} />
                {showPassword ? (
                    <Icons.eye
                        className="absolute bottom-[7px] right-[7px]"
                        onClick={() => setShowPassword(false)}
                    />
                ) : (
                    <Icons.eyeOff
                        className="absolute bottom-[7px] right-[7px]"
                        onClick={() => setShowPassword(true)}
                    />
                )}
            </div>
            <Separator className="my-6" />
            <div className="mb-4">
                <Label htmlFor="avatar">Zmień swój Avatar</Label>
                <ImageUploadField
                    image={avatar}
                    name="avatar"
                    className="mt-1"
                    imageHeight={100}
                    imageWidth={100}
                    quality={95}
                    setImage={setAvatar}
                    extraPreviewClass="h-[100px]"
                    destructiveElement={
                        <div className="text-destructive">
                            (akceptowany format to jpeg/jpg/png)
                        </div>
                    }
                />
            </div>
            {user.image && (
                <Button className="mb-5" onClick={e => handleDeleteAvatar(e)}>
                    Usuń swój Avatar
                </Button>
            )}
            <SignUpButton title="Zmień dane profilowe" />
        </form>
    );
}

export default Profile;
