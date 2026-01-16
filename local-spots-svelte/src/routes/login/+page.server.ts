import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { PageServerLoad, Actions } from './$types';

const AUTH_URL = 'https://local-spots-poi.onrender.com/api/users/authenticate';


export const load: PageServerLoad = async ({ parent, url, cookies }) => {
    
    
    const { user } = await parent();
    if (user) {
        throw redirect(303, '/dashboard');
    }


    const tokenFromUrl = url.searchParams.get('token');

    if (tokenFromUrl) {
        console.log("OAuth Token empfangen, setze Cookie...");

        cookies.set('token', tokenFromUrl, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: !dev,
            maxAge: 60 * 60 * 24 * 7 // 1 Woche
        });

      
        throw redirect(303, '/dashboard');
    }

    return {};
};

export const actions: Actions = {
    default: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return fail(400, { email, missing: true, error: 'Bitte E-Mail und Passwort eingeben' });
        }

        try {
            const response = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok || !result.token) {
                return fail(401, { email, incorrect: true, error: 'Ungültige Zugangsdaten' });
            }

            cookies.set('token', result.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: !dev,
                maxAge: 60 * 60 * 24 * 7
            });

        } catch (err) {
            console.error("Login Error:", err);
            return fail(500, { email, error: 'Verbindung zum Server fehlgeschlagen' });
        }

        throw redirect(303, '/dashboard');
    }
};