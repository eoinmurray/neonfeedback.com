import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { build } from 'astro';
import { parse } from 'yaml';
import { parse as parseHtml } from 'parse5';

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

  async function articleLinks(page) {
    const document = parseHtml(await readFile(`${root}/dist/${page}.html`, 'utf8'));
    const links = new Set();
    function visit(node) {
      const attributes = Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
      if (node.tagName === 'a' && attributes.class?.split(/\s+/).includes('post-link')) {
        links.add(new URL(attributes.href, 'https://neonfeedback.com').pathname.split('/').pop());
      }
      for (const child of node.childNodes ?? []) visit(child);
    }
    visit(document);
    return links;
  }
  const allArticles = await articleLinks('index');
  const drafts = await articleLinks('collections/drafts');
  const archive = await articleLinks('collections/archive');
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
      const memberships = Array.isArray(data.collection) ? data.collection : [data.collection];
      const isDraft = folder.includes('/drafts/') || data.status?.toLowerCase() === 'draft' || memberships.includes('drafts');
      const isArchived = folder.includes('/archive/') || data.archived === true || memberships.includes('archive');
      assert.equal(allArticles.has(id), !isDraft && !isArchived, `Incorrect All Articles visibility: ${id}`);
      if (isDraft) assert(drafts.has(id), `Draft missing from its local collection: ${id}`);
      if (isArchived) assert(archive.has(id), `Archived article missing from its local collection: ${id}`);
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
  console.log(`Local rendering verified: ${count} articles, title URL redirects, and draft/archive listing visibility.`);
} finally {
  await rm(root, { recursive: true, force: true });
}
// Development output starts Vite watchers; this standalone check is complete.
process.exit(0);
