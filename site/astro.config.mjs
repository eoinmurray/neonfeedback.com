// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://neonfeedback.com',
  base: process.env.SITE_BASE_PATH || '/',
  trailingSlash: 'never',
  build: { format: 'file' },
  server: { port: 3002 },
  devToolbar: { enabled: false },
  vite: {
    optimizeDeps: { include: ['cmdk', '@radix-ui/react-dialog'] },
    plugins: [{
      name: 'neonfeedback:separate-vite-caches',
      config: (_, { command }) => ({
        cacheDir: `node_modules/.vite/${command === 'build' || process.env.NODE_ENV === 'production' ? 'build' : 'dev'}`,
      }),
    }],
  },
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
    processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [[rehypeKatex, { throwOnError: true }]] }),
  },
});
