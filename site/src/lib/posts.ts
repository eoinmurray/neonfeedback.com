import { getCollection, type CollectionEntry } from 'astro:content';
import { withBase } from './urls';
import { isArchived, isLocalOnly, articleCollections } from './publication';

export type Article = CollectionEntry<'writings'> | CollectionEntry<'archive'> | CollectionEntry<'drafts'> | CollectionEntry<'reports'>;
export interface Post {
  id: string; href: string; label: string; collections: string[]; article: Article;
  data: Article['data'];
}
export async function getPosts({ includeArchive = false, onlyArchive = false } = {}): Promise<Post[]> {
  const groups = await Promise.all([getCollection('writings'), getCollection('archive'), getCollection('drafts'), getCollection('reports')]);
  const articles: Article[] = groups.flat();
  const ids = new Set<string>();
  for (const article of articles) {
    if (ids.has(article.id)) throw new Error(`Duplicate public article ID: ${article.id}`);
    ids.add(article.id);
  }
  return articles.filter(article => {
    if (!import.meta.env.DEV && isLocalOnly(article.data, article.collection)) return false;
    const archived = isArchived(article.data, article.collection);
    return onlyArchive ? archived : includeArchive || !archived;
  }).map(article => ({
    id: article.id, href: withBase(`/${article.id}`), label: article.id,
    collections: articleCollections(article.data, article.collection), article, data: article.data,
  })).sort((a, b) => Number(b.id.match(/\d+$/)?.[0] ?? 0) - Number(a.id.match(/\d+$/)?.[0] ?? 0)
    || b.id.localeCompare(a.id, 'en', { numeric: true }));
}
