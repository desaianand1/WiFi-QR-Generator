// Disable SSR for this client-side only app
// This eliminates SSR warnings from bits-ui nested button rendering
// while maintaining static pre-rendering at build time
export const prerender = true;
export const ssr = false;
