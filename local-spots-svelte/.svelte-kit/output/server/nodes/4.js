import * as server from '../entries/pages/admin/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.BkMZ9Fi_.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CLQ00JtZ.js","_app/immutable/chunks/U60wkwkf.js","_app/immutable/chunks/iMco-HAk.js","_app/immutable/chunks/DEYolRXA.js","_app/immutable/chunks/Vx5E0OZk.js","_app/immutable/chunks/BR8vYbN3.js"];
export const stylesheets = [];
export const fonts = [];
