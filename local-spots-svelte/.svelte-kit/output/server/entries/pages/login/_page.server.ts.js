import { fail, redirect } from "@sveltejs/kit";
const actions = {
  default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return fail(400, { missing: true, email: String(email ?? "") });
    }
    try {
      const response = await fetch("https://local-spots-poi.onrender.com/api/users/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (!result.success || !result.token) {
        return fail(400, { email, error: "Ungültige Zugangsdaten" });
      }
      cookies.set("token", result.token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7
      });
    } catch (err) {
      console.error(err);
      return fail(500, { email, error: "Serverfehler" });
    }
    throw redirect(303, "/dashboard");
  }
};
export {
  actions
};
