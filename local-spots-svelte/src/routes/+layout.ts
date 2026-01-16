// src/routes/+layout.ts
export const ssr = true;
export const prerender = false; // We have dynamic auth, so no static generation