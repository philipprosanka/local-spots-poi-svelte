import { redirect } from "@sveltejs/kit";
const load = async ({ cookies, fetch }) => {
  const token = cookies.get("token");
  if (!token) {
    throw redirect(302, "/login");
  }
  try {
    const [spotsRes, catsRes] = await Promise.all([
      fetch("https://local-spots-poi.onrender.com/api/spots", {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch("https://local-spots-poi.onrender.com/api/categories", {
        headers: { "Authorization": `Bearer ${token}` }
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
export {
  load
};
