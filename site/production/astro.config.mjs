import config from '../astro.config.mjs';

// Astro writes MDX import maps under root/.astro independently of cacheDir.
// Give production its own root so builds cannot replace the running dev map.
export default config;
