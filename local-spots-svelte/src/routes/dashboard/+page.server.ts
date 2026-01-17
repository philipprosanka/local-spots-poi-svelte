import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { dev } from '$app/environment';

// Hier definieren wir die URL zentral:
const API_BASE_URL = dev
    ? 'http://localhost:3000'
    : 'https://local-spots-poi.onrender.com';

export const load: PageServerLoad = async ({ parent, fetch }) => {
    const { user } = await parent();
    if (!user) throw redirect(302, '/login');
    const token = user.token;

    try {
        const [spotsRes, catRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/localspots`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API_BASE_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        return {
            spots: spotsRes.ok ? await spotsRes.json() : [],
            categories: catRes.ok ? await catRes.json() : []
        };
    } catch (e) {
        console.error("Load Error:", e);
        return { spots: [], categories: [] };
    }
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const token = locals.user?.token;
        if (!token) return fail(401, { error: 'Not logged in' });

        const formData = await request.formData();

        // --- 1️⃣ Spot erstellen ---
        const spotData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            latitude: Number(formData.get('latitude')),
            longitude: Number(formData.get('longitude'))
        };

        let newSpotId: string;
        try {
            const createRes = await fetch(`${API_BASE_URL}/api/localspots`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(spotData)
            });
            if (!createRes.ok) return fail(createRes.status, { error: 'Spot creation failed' });

            const createdSpot = await createRes.json();
            newSpotId = createdSpot._id || createdSpot.id;
        } catch (err) {
            console.error("Spot creation error:", err);
            return fail(500, { error: 'Server unavailable' });
        }

        // --- 2️⃣ Bilder Upload ---
        const rawImages = formData.getAll('images');
        const validImages = rawImages.filter(f => f instanceof File && f.size > 0 && f.name !== 'undefined');

        if (newSpotId && validImages.length > 0) {
            try {
                const uploadFormData = new FormData();
                
                for (const file of validImages) {
                    const f = file as File;
                    const arrayBuffer = await f.arrayBuffer();
                    const blob = new Blob([arrayBuffer], { type: f.type });
                    uploadFormData.append('images', blob, f.name);
                }

                console.log(`Frontend: Sende Bilder an ${API_BASE_URL}...`);

                const imageResponse = await fetch(`${API_BASE_URL}/api/localspots/${newSpotId}/image`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: uploadFormData,
                    // @ts-ignore
                    duplex: 'half'
                });

                if (!imageResponse.ok) {
                    // WICHTIG: Hier fangen wir den Fehler ab!
                    const errorText = await imageResponse.text();
                    console.error("Frontend Upload Error:", errorText);
                    
                    // Wenn Fehler 413 (zu groß) oder 400
                    return fail(imageResponse.status, { 
                        error: `Upload Failed: ${imageResponse.statusText}. Please try smaller images.` 
                    });
                }
            } catch (error) {
                console.error("Frontend Fetch Error during upload:", error);
                return fail(500, { error: 'Connection error during upload' });
            }
        }

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const token = locals.user?.token;
        if (!token) return fail(401);

        const data = await request.formData();
        const spotId = data.get('id');
        if (!spotId) return fail(400, { error: 'Missing spot ID' });

        const res = await fetch(`${API_BASE_URL}/api/localspots/${spotId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return fail(res.status, { error: 'Delete failed' });
        return { success: true };
    },

    deleteImage: async ({ request, locals }) => {
        const token = locals.user?.token;
        if (!token) return fail(401, { error: 'Unauthorized' });

        const data = await request.formData();
        const spotId = data.get('spotId');
        const imageId = data.get('imageId');

        if (!spotId || !imageId) return fail(400, { error: 'Missing IDs' });

        try {
            const safeImageId = encodeURIComponent(imageId.toString());
            const res = await fetch(`${API_BASE_URL}/api/localspots/${spotId}/image?imageId=${safeImageId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                return fail(res.status, { error: 'Failed to delete image on server' });
            }
            return { success: true };
        } catch (error) {
            console.error("Delete Image Error:", error);
            return fail(500, { error: 'Connection error' });
        }
    }
};