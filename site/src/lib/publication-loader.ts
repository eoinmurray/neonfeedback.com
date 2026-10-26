import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { glob } from 'astro/loaders';
import { parse } from 'yaml';
import { isLocalOnly } from './publication';

/** Exclude local-only source files before Astro compiles their MDX or imports assets. */
export function publicationGlob(options: Parameters<typeof glob>[0], source: string, local: boolean) {
  if (local) return glob(options);
  return {
    name: `published-${source}`,
    async load(context: Parameters<ReturnType<typeof glob>['load']>[0]) {
      const base = new URL(options.base ?? '.', context.config.root);
      const excluded: string[] = [];
      async function scan(directory: URL, prefix = ''): Promise<void> {
        for (const entry of await readdir(directory, { withFileTypes: true })) {
          const relative = `${prefix}${entry.name}`;
          if (entry.isDirectory()) await scan(new URL(`${entry.name}/`, directory), `${relative}/`);
          else if (/\.mdx?$/.test(entry.name)) {
            const text = await readFile(new URL(entry.name, directory), 'utf8');
            const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
            if (!frontmatter) throw new Error(`Missing frontmatter: ${fileURLToPath(directory)}${entry.name}`);
            if (isLocalOnly(parse(frontmatter[1]), source)) excluded.push(`!${relative}`);
          }
        }
      }
      // A directory URL must end with a slash for child paths to resolve correctly.
      await scan(new URL(`${base.href.replace(/\/$/, '')}/`));
      const pattern = [...(Array.isArray(options.pattern) ? options.pattern : [options.pattern]), ...excluded];
      await glob({ ...options, pattern }).load(context);
    },
  };
}
