import { defineCollection } from 'astro:content';
import { fileURLToPath } from 'node:url';
import { publicationGlob } from './lib/publication-loader';
import { z } from 'astro/zod';

const collectionId = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const articleSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]*$/).optional(),
  title: z.string(), author: z.string(), description: z.string().default(''),
  abstract: z.string().optional(),
  created_at: z.union([z.string().date(), z.string().datetime({ precision: 0 })]),
  updated_at: z.union([z.string().date(), z.string().datetime({ precision: 0 })]),
  collection: z.union([collectionId, z.array(collectionId).min(1)]),
  status: z.string().optional(), archived: z.boolean().default(false),
});
const writings = defineCollection({
  loader: publicationGlob({
    base: fileURLToPath(new URL('../../md/writings/', import.meta.url)), pattern: '**/*.{md,mdx}',
    generateId: ({ data, entry }) => String(data.id ?? entry.replace(/\.mdx?$/, '')),
  }, 'writings', import.meta.env.DEV),
  schema: articleSchema,
});
const archive = defineCollection({
  loader: publicationGlob({
    base: fileURLToPath(new URL('../../md/archive/', import.meta.url)), pattern: '**/*.{md,mdx}',
    generateId: ({ data, entry }) => String(data.id ?? entry.replace(/\.mdx?$/, '')),
  }, 'archive', import.meta.env.DEV),
  schema: articleSchema,
});
const drafts = defineCollection({
  loader: publicationGlob({
    base: fileURLToPath(new URL('../../md/drafts/', import.meta.url)), pattern: '**/*.{md,mdx}',
    generateId: ({ data, entry }) => String(data.id ?? entry.replace(/\.mdx?$/, '')),
  }, 'drafts', import.meta.env.DEV),
  schema: articleSchema,
});
const reports = defineCollection({
  loader: publicationGlob({ base: fileURLToPath(new URL('../../experiments/', import.meta.url)), pattern: 'exp*/report/report.mdx', generateId: ({ data }) => String(data.id) }, 'reports', import.meta.env.DEV),
  schema: articleSchema.extend({ id: z.string().regex(/^exp\d{3}$/), tags: z.array(z.string()).default([]) }),
});
export const collections = { writings, archive, drafts, reports };
