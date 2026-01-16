import { redirect, fail } from "@sveltejs/kit";
const load = async ({ cookies, fetch }) => {
  const token = cookies.get("token");
  if (!token) throw redirect(302, "/login");
  const response = await fetch("https://local-spots-poi.onrender.com/api/users", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!response.ok) {
    throw redirect(302, "/dashboard");
  }
  const users = await response.json();
  return { users };
};
const actions = {
  deleteUser: async ({ request, locals, fetch }) => {
    const formData = await request.formData();
    const userId = formData.get("id");
    const token = locals.user?.token;
    if (!token || !userId) return fail(400);
    const response = await fetch(`https://local-spots-poi.onrender.com/api/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) {
      return fail(response.status, { error: "Delete failed" });
    }
    return { success: true };
  }
};
export {
  actions,
  load
};
