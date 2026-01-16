import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent, fetch }) => {
    // 1. User vom Layout "erben"
    const { user } = await parent();
    
    // 2. Security Check
    if (!user) throw redirect(302, '/login');

    // 3. Daten laden (mit dem Token aus dem User-Objekt)
    const token = user.token;
    
    try {
        const spotsRes = await fetch('https://local-spots-poi.onrender.com/api/localspots', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const spots = spotsRes.ok ? await spotsRes.json() : [];

        const catRes = await fetch('https://local-spots-poi.onrender.com/api/categories', {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        const categories = catRes.ok ? await catRes.json() : [];

        // Wir geben spots & categories zurück. 'user' muss nicht zurückgegeben werden, 
        // da er schon im Layout ist, aber manchmal ist es explizit gewünscht.
        return { spots, categories };

    } catch (e) {
        console.error("Load Error:", e);
        return { spots: [], categories: [] };
    }
};

export const actions: Actions = {
    create: async ({ request, locals, fetch }) => {
    
        const token = locals.user?.token;

        if (!token) return fail(401, { error: 'Not logged in' });

        const formData = await request.formData();

        // --- SCHRITT 1: Spot erstellen (JSON) ---
        let newSpotId: string;

        try {
            // Wir bauen das JSON Objekt manuell zusammen, weil der Endpunkt JSON erwartet
            const spotData = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'), 
                latitude: Number(formData.get('latitude')),   
                longitude: Number(formData.get('longitude'))  
            };

            console.log("Sende Spot Daten (JSON):", spotData);

            const createResponse = await fetch('https://local-spots-poi.onrender.com/api/localspots', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(spotData)
            });

            if (!createResponse.ok) {
                const err = await createResponse.text();
                console.error("Fehler beim Spot-Erstellen:", err);
                return fail(createResponse.status, { error: 'Spot konnte nicht erstellt werden' });
            }

            const createdSpot = await createResponse.json();
            newSpotId = createdSpot._id || createdSpot.id;
            console.log("Spot erstellt mit ID:", newSpotId);

        } catch (err) {
            console.error(err);
            return fail(500, { error: 'Serverfehler beim Erstellen' });
        }

        // --- SCHRITT 2: Bild hochladen (falls vorhanden) ---
        const imageFile = formData.get('imagefile') as File;

        // Prüfen, ob wirklich eine Datei ausgewählt wurde (Name existiert und Größe > 0)
        if (newSpotId && imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
            try {
                console.log("Lade Bild hoch...");
                
                // Neue FormData nur für das Bild
                const imageFormData = new FormData();
                imageFormData.append('imagefile', imageFile);

                const imageResponse = await fetch(`https://local-spots-poi.onrender.com/api/localspots/${newSpotId}/image`, {
                    method: 'POST', // Oder PUT, je nach deiner API (im alten Service war es POST)
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // KEIN Content-Type hier! fetch setzt Boundary automatisch bei FormData
                    },
                    body: imageFormData
                });

                if (!imageResponse.ok) {
                    console.error("Bild-Upload fehlgeschlagen:", await imageResponse.text());
                    
                } else {
                    console.log("Bild erfolgreich hochgeladen!");
                }
            } catch (err) {
                console.error("Fehler beim Bild-Upload:", err);
            }
        }

        return { success: true };
    },

    delete: async ({ request, locals, fetch }) => {
        
        const token = locals.user?.token;
        if (!token) return fail(401);
        const data = await request.formData();
        const spotId = data.get('id');
        const response = await fetch(`https://local-spots-poi.onrender.com/api/localspots/${spotId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
});

if (!response.ok) return fail(response.status, { error: 'Delete failed' });
    }
};