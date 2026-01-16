import * as server from '../entries/pages/dashboard/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.BJiHxJp6.js","_app/immutable/chunks/DsnmJJEf.js","_app/immutable/chunks/CLQ00JtZ.js","_app/immutable/chunks/U60wkwkf.js","_app/immutable/chunks/iMco-HAk.js","_app/immutable/chunks/DEYolRXA.js","_app/immutable/chunks/Vx5E0OZk.js","_app/immutable/chunks/BR8vYbN3.js","_app/immutable/chunks/J2J7nSHB.js"];
export const stylesheets = ["_app/immutable/assets/6.CysUv0tf.css"];
export const fonts = [];
