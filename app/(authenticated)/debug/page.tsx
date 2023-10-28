'use client';

import { uploadProductPhoto } from '@/controllers/product-controller';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function Upload() {
    const { toast } = useToast();

    async function sendUploadForm(formData: FormData) {
        const res = await uploadProductPhoto(formData);

        toast({
            title: res.message,
            variant: res.success ? 'success' : 'destructive',
        });
    }

    return (
        <>
            <form action={formData => sendUploadForm(formData)}>
                <p>Upload a .png or .jpg image (max 1MB).</p>
                <input
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg"
                />
                <Button type="submit">Wyślij</Button>
            </form>
        </>
    );
}
