import { withBase } from './urls';
import type { Post } from './posts';
const collections = [
  { id: 'writings', label: 'Writings', description: 'Stories, drafts, and working ideas.' },
  { id: 'poetry', label: 'Poetry', description: 'Poetry by Eoin Murray.' },
  { id: 'essays', label: 'Essays', description: 'Essays on power, politics, and the world we inhabit.' },
  { id: 'experiments', label: 'Experiments', description: 'Computational notebooks and their supporting evidence.' },
];
export function collectionMemberships(value: string | string[]): string[] { return typeof value === 'string' ? [value] : value; }
export function collectionLabel(id: string): string { return collections.find(c => c.id === id)?.label ?? id; }
export function collectionDescription(id: string): string { return collections.find(c => c.id === id)?.description ?? `Articles in ${collectionLabel(id)}.`; }
export function collectionUrl(id: string): string { return withBase(`/collections/${encodeURIComponent(id)}`); }
export function compareCollections(a: string, b: string): number {
  const rank = (id: string) => { const index = collections.findIndex(c => c.id === id); return index < 0 ? collections.length : index; };
  return rank(a) - rank(b) || a.localeCompare(b);
}
export function collectionSummary(posts: readonly Post[]) {
  return { count: posts.length, latestDate: posts.map(post => post.data.updated_at).sort().at(-1) };
}
