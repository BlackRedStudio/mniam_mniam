'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import FileResizer from 'react-image-file-resizer';

import { useToast } from '@/lib/hooks/use-toast';
import { TTicketValidatorErrors } from '@/lib/validators/ticket-validator';

import { Button } from '../ui/Button';
import FormError from '../ui/FormError';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import Loader from '../ui/Loader';
import { useRouter } from 'next/navigation';
import { submitTicket__Action } from '@/server/actions/user-actions';

function TicketForm() {
    const { toast } = useToast();

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formErrors, setFormErrors] = useState<TTicketValidatorErrors>();
    const [attachment, setAttachment] = useState<File | null>(null);

    const submitTicket = async () => {

        setLoading(true);

        const formData = new FormData();
        formData.append('message', message);

        if(attachment) {
            formData.append('attachment', attachment);
        }

        const res = await submitTicket__Action(formData);

        if (!res.success && res.errors) {
            setFormErrors(res.errors);
        }

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });

        setLoading(false);

        if (res.success) {
            router.push('/dashboard');
        }
    };

    const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setAttachment(null);
            return;
        }
        const file = e.target.files[0];

        try {
            FileResizer.imageFileResizer(
                file,
                900,
                900,
                'JPEG',
                79,
                0,
                file => {
                    if (file instanceof File) {
                        setAttachment(file);
                    } else {
                        throw new Error('Zły format pliku');
                    }
                },
                'file',
                100,
                100,
            );
        } catch (err) {
            toast({
                title: 'Problem z plikiem, spróbuj ponownie lub zmień na inny plik.',
                variant: 'destructive',
            });
        }
    };

    return (
        <form className="mt-5 space-y-3">
            {attachment && (
                <>
                    <div className="mt-5 text-center text-success">
                        Podgląd obrazka
                    </div>
                    <div className="relative h-[300px] w-full">
                        <Image
                            src={URL.createObjectURL(attachment)}
                            fill
                            className="object-contain"
                            alt="Pogląd obrazka"
                        />
                    </div>
                </>
            )}
            <Label>Opcjonalnie dołącz screenshot lub obrazek</Label>
            <Input
                type="file"
                name="attachment"
                className="mt-5"
                onChange={handleSelectImage}
                accept="image/*"
            />
            <FormError className="mb-2" formErrors={formErrors?.attachment} />
            <Textarea
                name="message"
                placeholder="Opisz czego dokładnie dotyczy zgłoszenie."
                className="min-h-[150px]"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <FormError formErrors={formErrors?.message} />
            {loading && <Loader className="mt-4" />}
            <Button onClick={submitTicket} className="w-full" disabled={loading}>Wyślij</Button>
            <p className="text-sm text-muted-foreground">
                Zgłoszenia można przesyłać także na adres email{' '}
                <strong>
                    <a href="mailto:team@blackredstudio.com">
                        team@blackredstudio.com
                    </a>
                </strong>
                .
            </p>
        </form>
    );
}

export default TicketForm;
