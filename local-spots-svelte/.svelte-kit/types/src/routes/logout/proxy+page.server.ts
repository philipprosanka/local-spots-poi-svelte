// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ cookies, locals }: import('./$types').RequestEvent) => {
        
        cookies.delete('token', { path: '/' });

       
        locals.user = undefined;

        throw redirect(303, '/login');
    }
};;null as any as Actions;