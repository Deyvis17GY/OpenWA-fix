import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canScopeSessions, sessionPickerStartsExpanded, sessionScopeNames } from './sessionScope.ts';

test('only operator and viewer keys can be session-scoped in the dashboard', () => {
  assert.equal(canScopeSessions('operator'), true);
  assert.equal(canScopeSessions('viewer'), true);
  assert.equal(canScopeSessions('admin'), false);
  assert.equal(canScopeSessions(''), false);
});

test('an empty or missing allowlist means every session', () => {
  const sessions = [
    { id: 'a', name: 'Sales' },
    { id: 'b', name: 'Support' },
  ];
  assert.equal(sessionScopeNames(undefined, sessions), null);
  assert.equal(sessionScopeNames(null, sessions), null);
  assert.equal(sessionScopeNames([], sessions), null);
});

test('the session picker stays collapsed until sessions are already chosen', () => {
  assert.equal(sessionPickerStartsExpanded([]), false);
  assert.equal(sessionPickerStartsExpanded(['a']), true);
});

test('a selected allowlist resolves to session names, falling back to the id', () => {
  const sessions = [
    { id: 'a', name: 'Sales' },
    { id: 'b', name: 'Support' },
  ];
  assert.deepEqual(sessionScopeNames(['b', 'missing'], sessions), ['Support', 'missing']);
});
