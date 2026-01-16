import { redirect } from "@sveltejs/kit";
const actions = {
  default: async ({ cookies }) => {
    cookies.delete("token", { path: "/" });
    throw redirect(303, "/login");
  }
};
export {
  actions
};
