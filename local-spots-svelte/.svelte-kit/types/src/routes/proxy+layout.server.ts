// @ts-nocheck
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
// We assume that locals.user is set in hooks.server.ts after validating the user's session
    return {
        user: locals.user
    };
};