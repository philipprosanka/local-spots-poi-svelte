import { browser } from '$app/environment';
import { jwtDecode, type JwtPayload } from "jwt-decode";

// 1. Define the interface for the Token Payload
// This tells TypeScript what fields exist inside your encrypted token.
interface CustomJwtPayload extends JwtPayload {
    id?: string;      // Your backend might send 'id'
    _id?: string;     // ...or '_id'
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

class AuthStore {
    // Svelte 5 State Variables
    token = $state<string | null>(null);
    user = $state<User | null>(null);

    constructor() {
        if (browser) {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                this.login(storedToken);
            }
        }
    }

    get isAuthenticated() {
        return this.token !== null;
    }

    get isAdmin() {
        return this.user?.isAdmin ?? false;
    }

    login(tokenValue: string) {
        this.token = tokenValue;
        localStorage.setItem("token", tokenValue);
        
        try {
            // 2. FIX: Use the generic <CustomJwtPayload> instead of : any
            const decoded = jwtDecode<CustomJwtPayload>(tokenValue);
            
            this.user = {
                // Now TypeScript knows these properties exist on 'decoded'
                _id: decoded.id || decoded._id || "", 
                email: decoded.email,
                isAdmin: decoded.isAdmin || false,
                firstName: decoded.firstName || "",
                lastName: decoded.lastName || ""
            };
        } catch (e) {
            console.error("Token Decode Error", e);
            this.logout();
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem("token");
    }
}

export const auth = new AuthStore();