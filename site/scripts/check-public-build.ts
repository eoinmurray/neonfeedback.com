import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import { isLocalOnly } from '../src/lib/publication.ts';

const root = fileURLToPath(new URL('../..', import.meta.url));
const dist = resolve(root, 'site/dist');
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
const articles = ['writings', 'archive', 'reports'].flatMap(source => {
  const base = resolve(root, source === 'reports' ? 'experiments' : `md/${source}`);
  return files(base).filter(file => source === 'reports'
    ? /^exp\d+\/report\/report\.mdx$/.test(relative(base, file))
    : /\.mdx?$/.test(file)).map(file => {
      const text = readFileSync(file, 'utf8');
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
      assert(frontmatter, `Missing frontmatter: ${file}`);
      const data = parse(frontmatter[1]);
      const id = data.id ?? file.slice(file.lastIndexOf('/') + 1).replace(/\.mdx?$/, '');
      const assets = [...text.matchAll(/^import\s+.+?\s+from\s+["']([^"']+)["'];?$/gm)]
        .map(match => resolve(dirname(file), match[1]))
        .filter(path => /\.(png|jpe?g|webp|svg|gif|mp4|json)$/.test(path));
      const filename = file.slice(file.lastIndexOf('/') + 1).replace(/\.mdx?$/, '');
      return { id, filename, data, assets, private: isLocalOnly(data, source) };
    });
});
const emitted = files(dist);
const textOutputs = emitted.filter(file => /\.(html|js|json|xml|txt|css)$/.test(file));
const text = textOutputs.map(file => readFileSync(file, 'utf8')).join('\n');
for (const path of ['archive.html', 'drafts.html', 'collections/archive.html', 'collections/drafts.html', 'collections/writings.html']) {
  assert(!existsSync(resolve(dist, path)), `Local-only or retired route was published: ${path}`);
}
const publicAssets = new Set(articles.filter(article => !article.private).flatMap(article => article.assets));
const digest = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
const emittedAssets = new Set(emitted.filter(file => !['.html', '.js', '.css', '.txt', '.xml'].includes(extname(file))).map(digest));
for (const article of articles) {
  if (article.private) {
    assert(!existsSync(resolve(dist, `${article.id}.html`)), `Local-only article was published: ${article.id}`);
    assert(!existsSync(resolve(dist, `${article.filename}.html`)), `Local-only article alias was published: ${article.filename}`);
    assert(!text.includes(article.data.title), `Local-only article text was bundled: ${article.id}`);
    for (const asset of article.assets.filter(path => !publicAssets.has(path))) {
      assert(!emittedAssets.has(digest(asset)), `Local-only article asset was published: ${asset}`);
    }
  } else {
    assert(existsSync(resolve(dist, `${article.id}.html`)), `Public article missing: ${article.id}`);
  }
}
console.log(`Public build verified: ${articles.filter(article => !article.private).length} published articles; ${articles.filter(article => article.private).length} local-only articles and their assets excluded.`);
