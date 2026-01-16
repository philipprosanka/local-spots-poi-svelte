import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// 1. FESTE FARBZUORDNUNG (Mapping)
const CATEGORY_COLORS: Record<string, string> = {
    
    'Nature': '#3298DC',       // Blau (Bulma Info)
    'Food & Drink': '#F14668', // Rot (Bulma Danger)
    'Culture': '#48C774',      // Grün (Bulma Success)
    'Nightlife': '#8A2BE2',    // Lila (BlueViolet)
    
    // Fallback Farben für andere mögliche Kategorien
    'Sightseeing': '#FFDD57',  // Gelb (Bulma Warning)
    'History': '#6F4E37',      // Coffee (Braun)
    'Shopping': '#E67E22',     // Orange
};

const DEFAULT_COLOR = '#A0A0A0'; // Grau für unbekannte Kategorien

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

        const spots = spotsRes.ok ? await spotsRes.json() : [];
        const categories = catsRes.ok ? await catsRes.json() : [];

        // --- Berechnungen mit Color Mapping ---
        const chartData = categories.map((cat: any) => {
            const count = spots.filter((spot: any) => {
                 const cId = typeof spot.category === 'object' ? spot.category?._id : spot.category;
                 return cId === cat._id;
            }).length;

            // Wir nutzen cat.name als Schlüssel.
            const assignedColor = CATEGORY_COLORS[cat.name] || DEFAULT_COLOR;

            return { name: cat.name, count, color: assignedColor };
        });

        
        const spotsByDate: Record<string, number> = {};
        spots.forEach((spot: any) => {
            if (spot._id) {
                const timestamp = parseInt(spot._id.substring(0, 8), 16) * 1000;
                const date = new Date(timestamp);
                const key = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
                spotsByDate[key] = (spotsByDate[key] || 0) + 1;
            }
        });

        const sortedTrendData = Object.entries(spotsByDate).sort((a, b) => {
            const [dayA, monthA, yearA] = a[0].split('.');
            const [dayB, monthB, yearB] = b[0].split('.');
            const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
            const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));
            return dateA.getTime() - dateB.getTime();
        });

        let trendLabels = sortedTrendData.map(entry => entry[0]);
        let dailyValues = sortedTrendData.map(entry => entry[1]);

        if (trendLabels.length > 0) {
            const [d, m, y] = trendLabels[0].split('.');
            const startDate = new Date(Number(y), Number(m) - 1, Number(d));
            startDate.setDate(startDate.getDate() - 1);
            const zeroDateStr = startDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            trendLabels.unshift(zeroDateStr);
            dailyValues.unshift(0); 
        }

        let runningTotal = 0;
        const trendValues = dailyValues.map(value => {
            runningTotal += value;
            return runningTotal;
        });

        return {
            totalSpots: spots.length,
            charts: {
                categoryLabels: chartData.map(d => d.name),
                categoryValues: chartData.map(d => d.count),
                categoryColors: chartData.map(d => d.color), // Die Map-Farben
                trendLabels,
                trendValues
            }
        };

    } catch (e) {
        console.error("Charts Load Error", e);
        return {
            totalSpots: 0,
            charts: {
                categoryLabels: [], categoryValues: [], categoryColors: [],
                trendLabels: [], trendValues: []
            }
        };
    }
};