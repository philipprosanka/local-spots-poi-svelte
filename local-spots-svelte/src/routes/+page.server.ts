import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Der Hook hat bereits geprüft, ob ein Cookie da ist und 'locals.user' gefüllt.
    
    if (locals.user) {
        // Wenn User eingeloggt ist -> Sofort ab ins Dashboard!
        throw redirect(302, '/dashboard');
    }

    // Wenn NICHT eingeloggt, mach nichts (dann wird normal +page.svelte gerendert)
    return {};
};