import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { THTTPMethod } from '@/types/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getNameInitials(userName: string) {
    const userNameArr = userName.split(' ');

    let nameInitials = userNameArr[0][0] + userNameArr[0][1];

    if (userNameArr.length > 1) {
        nameInitials = userNameArr[0][0] + userNameArr[1][0];
    }

    return nameInitials.toUpperCase();
}

export function splitWords(sentence: string) {
    return sentence
        .split(/(?=[A-Z])/)
        .join(' ')
        .toLowerCase();
}

export async function api<Res>(
    url: string,
    method: THTTPMethod = 'GET',
    body?: Record<string, string | File> | FormData | null,
): Promise<Res> {
    const headers = {
        'User-Agent': 'Mniam App',
        Accept: 'application/json',
    };

    if (method === 'GET' && body) {
        url += '?' + new URLSearchParams(body as Record<string, string>);
        body = null;
    }

    let bodyContent = undefined;

    if (body) {
        bodyContent = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, {
        method,
        body: bodyContent as BodyInit,
        headers,
    });

    const data = await response.json();

    return data;
}

export function handleMultiplePersonText(persons: number) {
    let textVariant = 2;

    if (persons === 1) {
        textVariant = 0;
    } else if (persons > 1) {
        const lastNumber = parseInt(String(persons).slice(-1));
        if (lastNumber > 1 && lastNumber < 5) {
            textVariant = 1;
        }
    }

    return textVariant;
}
