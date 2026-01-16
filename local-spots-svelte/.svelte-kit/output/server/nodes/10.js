import * as server from '../entries/pages/signup/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/signup/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/signup/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.D0pmQ3Sj.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CLQ00JtZ.js","_app/immutable/chunks/U60wkwkf.js","_app/immutable/chunks/iMco-HAk.js","_app/immutable/chunks/Vx5E0OZk.js","_app/immutable/chunks/BR8vYbN3.js","_app/immutable/chunks/BAKmFxWT.js","_app/immutable/chunks/r2FbRrpq.js","_app/immutable/chunks/DvsvuSOZ.js"];
export const stylesheets = ["_app/immutable/assets/Navbar.BtxNl2eh.css"];
export const fonts = [];
