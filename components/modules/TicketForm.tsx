'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitTicket__Action } from '@/server/actions/ticket-actions';

import { useToast } from '@/lib/hooks/use-toast';
import { TTicketValidatorErrors } from '@/lib/validators/ticket-validator';

import { Button } from '../ui/Button';
import FormError from '../ui/FormError';
import { Label } from '../ui/Label';
import Loader from '../ui/Loader';
import { Textarea } from '../ui/Textarea';
import ImageUploadField from './ImageUploadField';

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

        if (attachment) {
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

    return (
        <form className="mt-5 space-y-3">
            <ImageUploadField
                formErrorImage={formErrors?.attachment}
                image={attachment}
                name="attachment"
                imageHeight={900}
                imageWidth={900}
                setImage={setAttachment}
                beforeInputElement={
                    <Label>Opcjonalnie dołącz screenshot lub obrazek</Label>
                }
            />
            <Textarea
                name="message"
                placeholder="Opisz czego dokładnie dotyczy zgłoszenie."
                className="min-h-[150px]"
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
            <FormError formErrors={formErrors?.message} />
            {loading && <Loader className="mt-4" />}
            <Button
                onClick={submitTicket}
                className="w-full"
                disabled={loading}>
                Wyślij
            </Button>
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
