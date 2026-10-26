import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './urls';
import { collectionMemberships } from './collections';

export type Article = CollectionEntry<'writings'> | CollectionEntry<'archive'> | CollectionEntry<'reports'>;
export interface Post {
  id: string; href: string; label: string; collections: string[]; article: Article;
  data: Article['data'];
}
export async function getPosts({ includeArchive = false, onlyArchive = false } = {}): Promise<Post[]> {
  const groups = await Promise.all([getCollection('writings'), getCollection('archive'), getCollection('reports')]);
  const articles: Article[] = groups.flat();
  const ids = new Set<string>();
  for (const article of articles) {
    if (ids.has(article.id)) throw new Error(`Duplicate public article ID: ${article.id}`);
    ids.add(article.id);
  }
  return articles.filter(article => {
    const archived = article.collection === 'archive' || article.data.archived;
    return onlyArchive ? archived : includeArchive || !archived;
  }).map(article => ({
    id: article.id, href: withBase(`/${article.id}`), label: article.id,
    collections: collectionMemberships(article.data.collection), article, data: article.data,
  })).sort((a, b) => Number(b.id.match(/\d+$/)?.[0] ?? 0) - Number(a.id.match(/\d+$/)?.[0] ?? 0)
    || b.id.localeCompare(a.id, 'en', { numeric: true }));
}
