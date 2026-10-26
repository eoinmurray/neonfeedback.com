import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCollections, isLocalOnly, articleCollections } from './publication.ts';

test('Writings merges into Essays without duplicate memberships', () => {
  assert.deepEqual(normalizeCollections(['writings', 'essays', 'poetry']), ['essays', 'poetry']);
});
test('Drafts are local-only regardless of their subject collection', () => {
  assert.equal(isLocalOnly({ collection: 'essays', status: 'published' }, 'drafts'), true);
  assert.deepEqual(articleCollections({ collection: 'drafts' }, 'drafts'), ['drafts']);
  assert.equal(isLocalOnly({ collection: 'essays', status: 'draft' }), true);
  assert.equal(isLocalOnly({ collection: ['essays', 'drafts'] }), true);
  assert.deepEqual(articleCollections({ collection: ['essays', 'drafts'], status: 'draft' }), ['essays', 'drafts']);
});
test('Archive restrictions follow the source directory, flag and collection', () => {
  assert.equal(isLocalOnly({ collection: 'essays' }, 'archive'), true);
  assert.equal(isLocalOnly({ collection: 'essays', archived: true }), true);
  assert.equal(isLocalOnly({ collection: 'archive' }), true);
});
test('An archived draft belongs to both local collections', () => {
  assert.deepEqual(articleCollections({ collection: 'essays', status: 'draft', archived: true }), ['essays', 'drafts', 'archive']);
});
test('Published articles remain public and can be promoted from drafts', () => {
  assert.equal(isLocalOnly({ collection: 'essays', status: 'published', archived: false }, 'writings'), false);
  assert.equal(isLocalOnly({ collection: 'experiments', status: 'revising' }, 'reports'), false);
  assert.equal(isLocalOnly({ collection: 'poetry' }), false);
});
