import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { build } from 'astro';
import { parse } from 'yaml';

const site = new URL('../', import.meta.url);
await mkdir(new URL('.astro/', site), { recursive: true });
const root = await mkdtemp(new URL('.astro/render-check-', site));
try {
  await build({
    root,
    configFile: '../../astro.config.mjs',
    outDir: `${root}/dist`,
    logLevel: 'warn',
    integrations: [{
      name: 'isolated-render-check',
      hooks: {
        'astro:config:setup': ({ updateConfig }) => updateConfig({
          cacheDir: pathToFileURL(`${root}/cache/`),
        }),
      },
    }],
  }, { devOutput: true });

  let count = 0;
  for (const folder of ['../md/writings/', '../md/archive/', '../md/drafts/', '../experiments/']) {
    const base = new URL(folder, site);
    for (const file of await readdir(base, { recursive: true })) {
      if (!/\.mdx?$/.test(file) || (folder.includes('experiments') && !/^exp\d+\/report\/report\.mdx$/.test(file))) continue;
      const source = await readFile(new URL(file, base), 'utf8');
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
      assert(frontmatter, `Missing frontmatter: ${file}`);
      const data = parse(frontmatter[1]);
      const filename = file.split('/').pop().replace(/\.mdx?$/, '');
      const id = data.id ?? filename;
      const html = await readFile(`${root}/dist/${id}.html`, 'utf8');
      assert(html.includes('<d-article'), `Article did not render: ${id}`);
      assert(!html.includes('An error occurred.'), `Error page rendered: ${id}`);
      if (filename !== id) {
        const alias = await readFile(`${root}/dist/${filename}.html`, 'utf8');
        assert(alias.includes(`/${id}`), `Missing title URL redirect: ${filename}`);
      }
      count++;
    }
  }
  assert(count > 0, 'No local articles checked');
  console.log(`Local rendering verified: ${count} articles and their title URL redirects.`);
} finally {
  await rm(root, { recursive: true, force: true });
}
// Development output starts Vite watchers; this standalone check is complete.
process.exit(0);
