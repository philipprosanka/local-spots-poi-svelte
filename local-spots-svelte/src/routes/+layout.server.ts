import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
// We assume that locals.user is set in hooks.server.ts after validating the user's session
    return {
        user: locals.user
    };
};