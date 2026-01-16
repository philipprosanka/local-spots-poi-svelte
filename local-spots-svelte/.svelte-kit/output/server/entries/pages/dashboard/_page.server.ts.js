import { redirect, fail } from "@sveltejs/kit";
const load = async ({ cookies, fetch, url }) => {
  const tokenFromUrl = url.searchParams.get("token");
  if (tokenFromUrl) {
    cookies.set("token", tokenFromUrl, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7
      // 1 week
    });
    throw redirect(303, "/dashboard");
  }
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/login");
  }
  try {
    const response = await fetch("https://local-spots-poi.onrender.com/api/spots", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.ok) {
      const spots = await response.json();
      const categoriesResponse = await fetch("https://local-spots-poi.onrender.com/api/categories", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const categories = await categoriesResponse.json();
      return {
        spots,
        categories,
        user: { token }
        // Optional, if you need the token on the client side
      };
    }
  } catch (e) {
    console.error("SSR Fetch Error", e);
  }
  return { spots: [], categories: [] };
};
const actions = {
  create: async ({ request, locals, fetch }) => {
    const data = await request.formData();
    const token = locals.user?.token;
    if (!token) return fail(401, { error: "Nicht eingeloggt" });
    try {
      const response = await fetch("https://local-spots-poi.onrender.com/api/spots", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });
      if (!response.ok) {
        return fail(response.status, { error: "Fehler beim Speichern" });
      }
    } catch (err) {
      console.error(err);
      return fail(500, { error: "Serverfehler" });
    }
    return { success: true };
  },
  delete: async ({ request, locals, fetch }) => {
    const data = await request.formData();
    const spotId = data.get("id");
    const token = locals.user?.token;
    if (!token) return fail(401);
    const response = await fetch(`https://local-spots-poi.onrender.com/api/spots/${spotId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      return fail(response.status, { error: "Löschen fehlgeschlagen" });
    }
    return { success: true };
  }
};
export {
  actions,
  load
};
