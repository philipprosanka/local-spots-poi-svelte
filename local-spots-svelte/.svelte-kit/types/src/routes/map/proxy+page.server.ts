// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, fetch }: Parameters<PageServerLoad>[0]) => {
    // 1. User vom Parent holen (das ist sicher, da im Layout geprüft)
    const { user } = await parent();

    if (!user) {
        throw redirect(302, '/login');
    }

    try {
        // 2. Spots laden (Backend Call mit Token)
        
        const response = await fetch('https://local-spots-poi.onrender.com/api/localspots', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        const catResponse = await fetch('https://local-spots-poi.onrender.com/api/categories', {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });

        return {
            spots: response.ok ? await response.json() : [],
            categories: catResponse.ok ? await catResponse.json() : []
        };
    } catch (e) {
        console.error("Map Load Error", e);
        return { spots: [], categories: [] };
    }
};