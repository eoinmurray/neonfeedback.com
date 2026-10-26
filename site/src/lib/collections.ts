import { withBase } from './urls';
import { normalizeCollections } from './publication';
import type { Post } from './posts';
const collections = [
  { id: 'essays', label: 'Essays', description: 'Essays, stories, and working ideas.' },
  { id: 'poetry', label: 'Poetry', description: 'Poetry by Eoin Murray.' },
  { id: 'experiments', label: 'Experiments', description: 'Computational notebooks and their supporting evidence.' },
  { id: 'drafts', label: 'Drafts', description: 'Unfinished writings, available in local development.' },
  { id: 'archive', label: 'Archive', description: 'Archived writings and experiments, available in local development.' },
];
export function collectionMemberships(value: string | string[]): string[] { return normalizeCollections(value); }
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
