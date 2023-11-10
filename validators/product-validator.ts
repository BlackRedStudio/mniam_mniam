import { z } from 'zod';
import { imageValidator } from './image-validator';

export const imageUploadValidator = z.object({
    image: imageValidator,
});

export type TImageUploadValidator = z.infer<typeof imageUploadValidator>;
