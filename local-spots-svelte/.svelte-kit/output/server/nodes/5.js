import * as server from '../entries/pages/charts/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/charts/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/charts/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.BqqE4AHT.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CLQ00JtZ.js","_app/immutable/chunks/U60wkwkf.js","_app/immutable/chunks/J2J7nSHB.js","_app/immutable/chunks/BR8vYbN3.js"];
export const stylesheets = ["_app/immutable/assets/5.j45M3V1f.css"];
export const fonts = [];
