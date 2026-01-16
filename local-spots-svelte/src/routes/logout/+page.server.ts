import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies, locals }) => {
        
        cookies.delete('token', { path: '/' });

       
        locals.user = undefined;

        throw redirect(303, '/login');
    }
};