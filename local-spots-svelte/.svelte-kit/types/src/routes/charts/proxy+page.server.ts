// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ parent, fetch }: Parameters<PageServerLoad>[0]) => {
    // 1. Wir holen uns die Daten vom Layout (Parent)
    const { user } = await parent();
    
    // 2. Falls kein User da ist (nicht eingeloggt), ab zum Login
    if (!user) {
        throw redirect(302, '/login');
    }

    // 3. Wir nutzen den Token aus dem User-Objekt
    const token = user.token;

    try {
        // Wir laden Spots UND Kategorien parallel
        const [spotsRes, catsRes] = await Promise.all([
            fetch('https://local-spots-poi.onrender.com/api/localspots', {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch('https://local-spots-poi.onrender.com/api/categories', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        return {
            spots: spotsRes.ok ? await spotsRes.json() : [],
            categories: catsRes.ok ? await catsRes.json() : []
        };
    } catch (e) {
        console.error("Charts Load Error", e);
        return { spots: [], categories: [] };
    }
};