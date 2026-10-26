export interface PublicationData {
  collection?: string | string[];
  status?: string;
  archived?: boolean;
}

export function normalizeCollections(value: string | string[] = []): string[] {
  return [...new Set((typeof value === 'string' ? [value] : value).map(id => id === 'writings' ? 'essays' : id))];
}

export function isArchived(data: PublicationData, source = ''): boolean {
  return source === 'archive' || data.archived === true || normalizeCollections(data.collection).includes('archive');
}

export function isDraft(data: PublicationData, source = ''): boolean {
  return source === 'drafts' || data.status?.toLowerCase() === 'draft' || normalizeCollections(data.collection).includes('drafts');
}

export function isLocalOnly(data: PublicationData, source = ''): boolean {
  return isArchived(data, source) || isDraft(data, source);
}

export function articleCollections(data: PublicationData, source = ''): string[] {
  return normalizeCollections([
    ...normalizeCollections(data.collection),
    ...(isDraft(data, source) ? ['drafts'] : []),
    ...(isArchived(data, source) ? ['archive'] : []),
  ]);
}
