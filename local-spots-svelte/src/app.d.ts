// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            // Hier definieren wir, was im Hook gesetzt wird
			user: { 
                token: string;
                email: string;
                id: string;
                isAdmin: boolean;
                firstName?: string;
                lastName?: string;
            } | null | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};