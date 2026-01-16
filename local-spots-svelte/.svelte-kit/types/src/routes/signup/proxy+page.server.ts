// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// URL wieder als Konstante oder via $env
const REGISTER_URL = 'https://local-spots-poi.onrender.com/api/users';

export const actions = {
    default: async ({ request, fetch }: import('./$types').RequestEvent) => {
        const formData = await request.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const password = formData.get('password');

        // 1. Strenge Validierung (Typen prüfen)
        if (
            typeof firstName !== 'string' || !firstName ||
            typeof lastName !== 'string' || !lastName ||
            typeof email !== 'string' || !email ||
            typeof password !== 'string' || !password
        ) {
            return fail(400, { 
                missing: true,
                
                firstName, lastName, email 
            });
        }

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password })
            });
            
            // Wir lesen den Body nur einmal
            let result;
            try {
                result = await response.json();
            } catch (e) {
                result = {}; // Fallback, falls Body leer/kein JSON
            }

            // 2. Fehlerbehandlung via HTTP Status
            if (!response.ok) {
                const errorMessage = result.message || 'Registrierung fehlgeschlagen. Versuche es erneut.';
                
                return fail(response.status, { 
                    error: errorMessage,
                    firstName, lastName, email 
                });
            }

            

        } catch (err) {
            console.error("Register Error:", err);
         
            return fail(500, { 
                error: 'Verbindung zum Server fehlgeschlagen.',
                firstName, lastName, email 
            });
        }

        // 3. Erfolg -> Redirect
        // Dieser Code wird nur erreicht, wenn kein 'return fail(...)' ausgelöst wurde.
        throw redirect(303, '/login');
    }
};;null as any as Actions;