 import { browser } from '$app/environment';
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { localSpotService } from "./services/localspot-service";
import type { LocalSpot, Category } from "./types/localspot-types";
import { goto } from '$app/navigation';

// 1. Interfaces
interface CustomJwtPayload extends JwtPayload {
    id?: string;
    _id?: string;
    email: string;
    isAdmin?: boolean;
    firstName?: string;
    lastName?: string;
}

export interface User {
    _id: string;
    email: string;
    isAdmin: boolean;
    firstName?: string;
    lastName?: string;
}

// 2. Auth Class (Defined first so userState can reference it)
class AuthStore {
    token = $state<string | null>(null);
    user = $state<User | null>(null);
    isAuthenticated = $derived(this.token !== null);
    isAdmin = $derived(this.user?.isAdmin ?? false);

    constructor() {
        if (browser) {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                this.login(storedToken);
            }
        }
    }

    login(tokenValue: string) {
        this.token = tokenValue;
        if (browser) localStorage.setItem("token", tokenValue);
        
        try {
            const decoded = jwtDecode<CustomJwtPayload>(tokenValue);
            this.user = {
                _id: decoded.id || decoded._id || "", 
                email: decoded.email,
                isAdmin: decoded.isAdmin || false,
                firstName: decoded.firstName || "",
                lastName: decoded.lastName || ""
            };
            userState.refresh();
        } catch (e) {
            console.error("Token Decode Error", e);
            this.logout();
        }
    }

    // src/lib/runes.svelte.ts

async logout() { // 1. Add 'async'
    this.token = null;
    this.user = null;
    
    if (browser) {
        localStorage.removeItem("token");
        userState.spots = [];
        userState.categories = [];
        
        try {
            // 2. Add 'await' to resolve the promise
            await goto("/login"); 
        } catch (err) {
            console.error("Navigation failed:", err);
        }
      }
   }
}

// Export the instance
export const auth = new AuthStore();

// 3. Global State for Private Data
// We use a getter/setter or explicit type to fix the 'never' error
// src/lib/runes.svelte.ts

// src/lib/runes.svelte.ts

class UserDataStore {
  // Use the generic syntax to strictly define the types
  spots = $state<LocalSpot[]>([]);
  categories = $state<Category[]>([]);

  async refresh() {
    if (!auth.token) return;

    try {
      const [s, c] = await Promise.all([
        localSpotService.getAllSpots(),
        localSpotService.getCategories()
      ]);
      // Direct assignment now works because the state is typed
      this.spots = s;
      this.categories = c;
    } catch (e) {
      console.error("Data fetch failed", e);
    }
  }
}

export const userState = new UserDataStore();