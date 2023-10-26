import { THTTPMethod } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export async function api(url: string, method: THTTPMethod = 'GET', body?: any) {
	
    const headers = {
        'User-Agent': 'Mniam App',
        Accept: 'application/json',
    };

	if(method === 'GET' && body) {
		url += '?' + new URLSearchParams(body);
		body = null;
	}

    let response = await fetch(
        url,
        {
            method,
            body,
            headers,
        },
    );

    let data = await response.json();

	return data;
}
