import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';


export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { user } = await parent();

    if (!user) throw redirect(302, '/login');

    if (!user.isAdmin) throw redirect(302, '/dashboard');

   
    const usersRes = await fetch('https://local-spots-poi.onrender.com/api/users', {
        headers: { 'Authorization': `Bearer ${user.token}` }
    });
    
    return {
         users: usersRes.ok ? await usersRes.json() : []
    };
};

export const actions: Actions = {
    
    deleteUser: async ({ request, locals, fetch }) => {
        const formData = await request.formData();
        const userId = formData.get('id');
        const token = locals.user?.token;

        if (!token || !userId) {
            return fail(400, { message: 'Daten unvollständig' });
        }

        const response = await fetch(`https://local-spots-poi.onrender.com/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            return fail(response.status, { error: 'Löschen fehlgeschlagen' });
        }

        return { success: true };
    }
};