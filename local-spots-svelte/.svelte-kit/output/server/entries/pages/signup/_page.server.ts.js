import { fail, redirect } from "@sveltejs/kit";
const actions = {
  default: async ({ request, fetch }) => {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    if (!firstName || !lastName || !email || !password) {
      return fail(400, { missing: true });
    }
    try {
      const response = await fetch("https://local-spots-poi.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const result = await response.json();
      if (!result.success && !result._id) {
        return fail(400, { email, error: "Registrierung fehlgeschlagen. Email bereits vergeben?" });
      }
    } catch (err) {
      console.error(err);
      return fail(500, { error: "Serverfehler" });
    }
    throw redirect(303, "/login");
  }
};
export {
  actions
};
