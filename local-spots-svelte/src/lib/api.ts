import { auth } from './runes.svelte';
import { PUBLIC_API_URL } from '$env/static/public';

const BASE_URL = PUBLIC_API_URL;

async function send(method: string, path: string, data?: unknown, isMultipart = false) {
    const headers: Record<string, string> = {};

    // JWT aus dem Store holen!
    const token = auth.token;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }

    const opts: RequestInit = {
        method,
        headers,
        credentials: 'include'
    };

    if (data) {
        opts.body = isMultipart ? (data as FormData) : JSON.stringify(data);
    }

    const res = await fetch(`${BASE_URL}/${path}`, opts);

    if (!res.ok) {
        const errText = await res.text();
        console.error("API Error Body:", errText);
        if (res.status === 401) {
            auth.logout();
        }
        throw new Error(`API Error: ${res.statusText} (${res.status})`);
    }

    if (res.status === 204) return true;

    return res.json();
}

export const api = {
    get: (path: string) => send('GET', path),
    post: (path: string, data: unknown) => send('POST', path, data),
    postMultipart: (path: string, formData: FormData) => send('POST', path, formData, true),
    delete: (path: string) => send('DELETE', path),
};