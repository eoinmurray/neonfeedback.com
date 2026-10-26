import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const collectionId = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const articleSchema = z.object({
  title: z.string(), author: z.string(), description: z.string().default(''),
  abstract: z.string().optional(),
  created_at: z.union([z.string().date(), z.string().datetime({ precision: 0 })]),
  updated_at: z.union([z.string().date(), z.string().datetime({ precision: 0 })]),
  collection: z.union([collectionId, z.array(collectionId).min(1)]),
  status: z.string().optional(), archived: z.boolean().default(false),
});
const writings = defineCollection({ loader: glob({ base: '../md/writings', pattern: '**/*.{md,mdx}' }), schema: articleSchema });
const archive = defineCollection({ loader: glob({ base: '../md/archive', pattern: '**/*.{md,mdx}' }), schema: articleSchema });
const reports = defineCollection({
  loader: glob({ base: '../experiments', pattern: 'exp*/report/report.mdx', generateId: ({ data }) => String(data.id) }),
  schema: articleSchema.extend({ id: z.string().regex(/^exp\d{3}$/), tags: z.array(z.string()).default([]) }),
});
export const collections = { writings, archive, reports };
