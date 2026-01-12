import { api } from "$lib/api";
import { auth } from "$lib/runes.svelte";


export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await api.post("users/authenticate", { email, password });
      if (response.success && response.token) {
        auth.login(response.token);
        return true;
      }
      return false;
    } catch (e) {
        console.error("Login error:", e);
      return false;
    }
  },

  async register(firstName: string, lastName: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await api.post("users", { firstName, lastName, email, password });
      return !!response; // true wenn erfolgreich
    } catch (e) {
        console.error("Registration error:", e);
      return false;
    }
  },

  logout() {
    auth.logout();
  }
};