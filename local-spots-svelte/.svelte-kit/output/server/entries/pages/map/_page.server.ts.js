import { redirect } from "@sveltejs/kit";
const load = async ({ cookies, fetch }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/login");
  }
  try {
    const response = await fetch("https://local-spots-poi.onrender.com/api/spots", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const catResponse = await fetch("https://local-spots-poi.onrender.com/api/categories", {
      headers: { "Authorization": `Bearer ${token}` }
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
export {
  load
};
