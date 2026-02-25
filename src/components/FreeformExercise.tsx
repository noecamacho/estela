import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  subscribeToFreeform,
  addFreeformEntry,
  updateEntry,
  deleteEntry,
} from '../lib/firestore';
import { formatDate, toLocalInput } from '../lib/date-utils';
import type { FreeformEntryWithId } from '../types';
import { EntryCard } from './EntryCard';
import { ConfirmDialog } from './ConfirmDialog';
import { EmptyState } from './EmptyState';

interface FreeformExerciseProps {
  exerciseKey: 'ejercicio2' | 'ejercicio3';
  description: string;
  questions: string;
  addLabel: string;
  emptyMessage: string;
}

export function FreeformExercise({
  exerciseKey,
  description,
  questions,
  addLabel,
  emptyMessage,
}: FreeformExerciseProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [entries, setEntries] = useState<FreeformEntryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToFreeform(user.uid, exerciseKey, (data) => {
      setEntries(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user, exerciseKey]);

  if (loading) {
    return (
      <div className="mt-12 flex justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  async function handleAdd() {
    if (!user) return;
    await addFreeformEntry(user.uid, exerciseKey);
  }

  async function handleUpdateDate(entryId: string, value: string) {
    if (!user) return;
    const date = new Date(value);
    await updateEntry(user.uid, exerciseKey, entryId, {
      fecha: Timestamp.fromDate(date),
    });
  }

  async function handleUpdateField(
    entryId: string,
    field: 'titulo' | 'contenido',
    value: string,
  ) {
    if (!user) return;
    await updateEntry(user.uid, exerciseKey, entryId, { [field]: value });
  }

  async function handleDelete(entryId: string) {
    if (!user) return;
    await deleteEntry(user.uid, exerciseKey, entryId);
    setDeleteTarget(null);
  }

  return (
    <div>
      {/* Collapsible instructions — progressive disclosure */}
      <button
        onClick={() => setShowGuide(!showGuide)}
        className="mb-3 flex cursor-pointer items-center gap-1.5 bg-transparent text-[0.7rem] font-medium uppercase tracking-wider text-fg-subtle transition-colors hover:text-fg-muted"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`transition-transform duration-200 ${showGuide ? 'rotate-90' : ''}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {showGuide ? t.nav.hideGuide : t.nav.showGuide}
      </button>

      {showGuide && (
        <div className="animate-entry-expand mb-6 border-l-2 border-accent/30 pl-4 font-serif text-xs leading-relaxed text-fg-muted">
          <p>
            <strong className="text-fg">{t.freeform.instructionLabel}</strong>{' '}
            {description}
          </p>
          <p className="mt-2">
            <strong className="text-fg">{t.freeform.questionsLabel}</strong>{' '}
            {questions}
          </p>
        </div>
      )}

      {/* Add button — pill style */}
      <button
        onClick={handleAdd}
        className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-transparent py-3 text-sm font-medium text-fg-muted transition-all duration-300 hover:border-border-bold hover:text-fg"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {addLabel}
      </button>

      {entries.map((entry, i) => (
        <EntryCard
          key={entry.id}
          title={entry.titulo || t.freeform.noTitle}
          subtitle={formatDate(entry.fecha, t)}
          index={i}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="text-[0.6rem] font-medium uppercase tracking-wider text-fg-subtle">
              {t.freeform.dateLabel}
            </label>
            <input
              type="datetime-local"
              value={toLocalInput(entry.fecha)}
              onChange={(e) => handleUpdateDate(entry.id, e.target.value)}
              className="rounded border border-border bg-transparent px-2 py-1 font-serif text-xs text-fg-muted transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          <input
            value={entry.titulo}
            onChange={(e) =>
              handleUpdateField(entry.id, 'titulo', e.target.value)
            }
            placeholder={t.freeform.titlePlaceholder}
            className="mb-3 w-full border-b border-border bg-transparent pb-2 text-sm font-semibold text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />

          <textarea
            value={entry.contenido}
            onChange={(e) =>
              handleUpdateField(entry.id, 'contenido', e.target.value)
            }
            placeholder={t.freeform.contentPlaceholder}
            rows={8}
            className="w-full resize-y rounded border border-border bg-transparent p-3 font-serif text-sm leading-relaxed text-fg-muted placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />

          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <button
              onClick={() => setDeleteTarget(entry.id)}
              className="hover-line inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-1 text-[0.62rem] font-medium uppercase tracking-wider text-danger-muted transition-colors hover:text-danger"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {t.freeform.deleteEntry}
            </button>
          </div>
        </EntryCard>
      ))}

      {entries.length === 0 && <EmptyState message={emptyMessage} />}

      {deleteTarget && (
        <ConfirmDialog
          message={t.freeform.deleteEntryConfirm}
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
