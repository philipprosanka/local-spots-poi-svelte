import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { user } = await parent();
    if (!user) throw redirect(302, '/login');

    try {
        const [spotsRes, catsRes] = await Promise.all([
            fetch('https://local-spots-poi.onrender.com/api/localspots', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            }),
            fetch('https://local-spots-poi.onrender.com/api/categories', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            })
        ]);

        const allSpots = spotsRes.ok ? await spotsRes.json() : [];
        const categories = catsRes.ok ? await catsRes.json() : [];

        // Hilfsfunktion zum Filtern (macht den Code sauberer)
        const filterByCat = (catName: string) => {
            const targetCat = categories.find((c: any) => c.name === catName);
            if (!targetCat) return [];
            return allSpots.filter((s: any) => {
                const cId = typeof s.category === 'object' ? s.category?._id : s.category;
                return cId === targetCat._id;
            });
        };

        return {
            allSpots,
            categories,
            // Hier holen wir die spezifischen Listen für die Mini-Maps
            natureSpots: filterByCat('Nature'),
            foodSpots: filterByCat('Food & Drink'),
            cultureSpots: filterByCat('Culture'),
            nightlifeSpots: filterByCat('Nightlife')
        };

    } catch (e) {
        console.error("Map Load Error", e);
        return { allSpots: [], categories: [], natureSpots: [], foodSpots: [], cultureSpots: [], nightlifeSpots: [] };
    }
};