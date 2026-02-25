import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToFreeform,
  addFreeformEntry,
  updateEntry,
  deleteEntry,
} from '../lib/firestore';
import type { FreeformEntryWithId } from '../types';
import { EntryCard } from './EntryCard';
import { ConfirmDialog } from './ConfirmDialog';
import { EmptyState } from './EmptyState';

function formatDate(timestamp: Timestamp): string {
  const d = timestamp.toDate();
  const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ];
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()} — ${h12}:${m}${ampm}`;
}

function toLocalInput(timestamp: Timestamp): string {
  const d = timestamp.toDate();
  const y = d.getFullYear();
  const mo = (d.getMonth() + 1).toString().padStart(2, '0');
  const da = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const mi = d.getMinutes().toString().padStart(2, '0');
  return `${y}-${mo}-${da}T${h}:${mi}`;
}

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
  const [entries, setEntries] = useState<FreeformEntryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
      {/* Info box — editorial left-accent */}
      <div className="mb-6 border-l-2 border-accent/30 pl-4 font-serif text-xs leading-relaxed text-fg-muted">
        <p>
          <strong className="text-fg">Instruccion de Hamid:</strong>{' '}
          {description}
        </p>
        <p className="mt-2">
          <strong className="text-fg">Preguntas guia:</strong> {questions}
        </p>
      </div>

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
          title={entry.titulo || 'Sin titulo'}
          subtitle={formatDate(entry.fecha)}
          index={i}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="text-[0.6rem] font-medium uppercase tracking-wider text-fg-subtle">
              Fecha:
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
            placeholder="Titulo de esta entrada..."
            className="mb-3 w-full border-b border-border bg-transparent pb-2 text-sm font-semibold text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />

          <textarea
            value={entry.contenido}
            onChange={(e) =>
              handleUpdateField(entry.id, 'contenido', e.target.value)
            }
            placeholder="Escribe aqui..."
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
              Eliminar entrada
            </button>
          </div>
        </EntryCard>
      ))}

      {entries.length === 0 && <EmptyState message={emptyMessage} />}

      {deleteTarget && (
        <ConfirmDialog
          message="¿Seguro que quieres eliminar esta entrada?"
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
