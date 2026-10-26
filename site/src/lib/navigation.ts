import { getPosts } from './posts';
import { collectionLabel, collectionUrl, collectionDescription, compareCollections } from './collections';
export interface NavigationEntry { href: string; title: string; detail: string; subtitle?: string; keywords: string[]; }
export async function getNavigation() {
  const posts = await getPosts({ includeArchive: true });
  const names = [...new Set(posts.flatMap(post => post.collections))].sort(compareCollections);
  return {
    collections: names.map(id => ({ href: collectionUrl(id), title: collectionLabel(id), detail: 'Collection', keywords: [id, collectionDescription(id)] })),
    articles: posts.map(post => ({ href: post.href, title: post.data.title, detail: post.article.data.archived ? `${post.id} · Archive` : post.label,
      keywords: [post.id, post.data.description, ...post.collections.flatMap(id => [id, collectionLabel(id)])] })),
  };
}
