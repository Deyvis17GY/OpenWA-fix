import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Session } from '../services/api';
import { sessionPickerStartsExpanded } from '../utils/sessionScope';

interface SessionScopePickerProps {
  sessions: Session[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function SessionScopePicker({ sessions, selectedIds, onChange, disabled }: SessionScopePickerProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(() => sessionPickerStartsExpanded(selectedIds));

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(current => current !== id) : [...selectedIds, id]);
  };

  const chooseSessions = () => setExpanded(true);
  const leaveForAll = () => {
    onChange([]);
    setExpanded(false);
  };

  return (
    <div className="session-scope-picker" role="group">
      {expanded ? (
        <>
          <button
            type="button"
            className="session-scope-toggle"
            onClick={leaveForAll}
            disabled={disabled}
            aria-expanded="true"
          >
            {t('apiKeys.sessions.leaveAll')}
          </button>
          <p className="session-scope-hint">{t('apiKeys.sessions.hint')}</p>
          {sessions.length === 0 ? (
            <p className="session-scope-empty">{t('apiKeys.sessions.empty')}</p>
          ) : (
            <ul className="session-scope-list">
              {sessions.map(session => (
                <li key={session.id}>
                  <label className="session-scope-option">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(session.id)}
                      onChange={() => toggle(session.id)}
                      disabled={disabled}
                    />
                    <span className="session-scope-meta">
                      <span className="session-scope-name">{session.name}</span>
                      {session.phone ? <span className="session-scope-phone">{session.phone}</span> : null}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <button
          type="button"
          className="session-scope-toggle"
          onClick={chooseSessions}
          disabled={disabled}
          aria-expanded="false"
        >
          {t('apiKeys.sessions.choose')}
        </button>
      )}
    </div>
  );
}
