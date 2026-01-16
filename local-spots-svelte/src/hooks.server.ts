import type { Handle } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode'; // Viel sauberer

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('token');

    // Standard: Kein User
    event.locals.user = undefined; // 'undefined' ist in SvelteKit oft besser als 'null' für optionale Props

    if (token) {
        try {
            // 1. Token Decodieren (ersetzt den komplexen Base64 Block)
            // Wir definieren hier ein Interface für den Payload, damit TS glücklich ist
            const decoded: any = jwtDecode(token);

            // Prüfen, ob der Token abgelaufen ist (optional, aber gut)
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                // Token abgelaufen -> Fehler werfen, um in den Catch-Block zu springen
                throw new Error('Token expired');
            }

            // 2. User Objekt bauen
            event.locals.user = {
                token: token,
                email: decoded.email,
                id: decoded.id || decoded._id,
                
                isAdmin: decoded.scope?.includes('admin') || false,
                firstName: decoded.firstName,
                lastName: decoded.lastName
            };

        } catch (err) {
            console.error("Session ungültig:", err);
            
            event.cookies.delete('token', { path: '/' });
            event.locals.user = undefined;
        }
    }

    return resolve(event);
};