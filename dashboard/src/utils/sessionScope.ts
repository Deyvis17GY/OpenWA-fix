/**
 * Operator and viewer (reader) API keys may be limited to an explicit session
 * allowlist. An empty or missing list means the key can reach every session,
 * including ones created later. Admin keys stay unscoped in the dashboard UI.
 */
export function canScopeSessions(role: string): boolean {
  return role === 'operator' || role === 'viewer';
}

/** The picker starts open only when the key already has an explicit allowlist. */
export function sessionPickerStartsExpanded(selectedIds: readonly string[]): boolean {
  return selectedIds.length > 0;
}

export function sessionScopeNames(
  allowedSessions: string[] | undefined | null,
  sessions: ReadonlyArray<{ id: string; name: string }>,
): string[] | null {
  if (!allowedSessions || allowedSessions.length === 0) return null;
  const byId = new Map(sessions.map(session => [session.id, session.name]));
  return allowedSessions.map(id => byId.get(id) ?? id);
}
