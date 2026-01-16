import * as server from '../entries/pages/logout/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logout/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/logout/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DFlUQTDi.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CLFkMDoo.js","_app/immutable/chunks/CLQ00JtZ.js","_app/immutable/chunks/U60wkwkf.js","_app/immutable/chunks/D4kr7nxO.js","_app/immutable/chunks/J2J7nSHB.js","_app/immutable/chunks/BR8vYbN3.js"];
export const stylesheets = [];
export const fonts = [];
