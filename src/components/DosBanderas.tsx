import { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToDosBanderas,
  addDosBanderasEntry,
  updateEntry,
  deleteEntry,
} from '../lib/firestore';
import type { DosBanderasEntryWithId } from '../types';
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

interface ListSectionProps {
  label: string;
  icon: string;
  items: string[];
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  colorClass: string;
  placeholder: string;
}

function ListSection({
  label,
  icon,
  items,
  onAdd,
  onUpdate,
  onRemove,
  colorClass,
  placeholder,
}: ListSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="mb-3">
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className={`text-xs font-normal ${colorClass}`}>
          {icon} {label}
        </h3>
        <button
          onClick={onAdd}
          className="cursor-pointer border-none bg-transparent p-1 text-warm-500 hover:text-warm-300"
          aria-label={`Agregar ${label.toLowerCase()}`}
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
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-xs italic text-warm-600">{placeholder}</p>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="mb-1 flex items-start gap-1.5">
          <span className="mt-1 shrink-0 text-[0.6rem] text-warm-600">
            {icon === '✨' ? '✦' : '◆'}
          </span>

          {editingIndex === idx ? (
            <div className="flex flex-1 items-start gap-1">
              <textarea
                autoFocus
                defaultValue={item}
                onBlur={(e) => {
                  onUpdate(idx, e.target.value);
                  setEditingIndex(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setEditingIndex(null);
                }}
                className="min-h-[3rem] flex-1 resize-y rounded border border-warm-700 bg-black/30 p-1.5 font-serif text-xs leading-relaxed text-warm-200"
              />
            </div>
          ) : (
            <div className="flex flex-1 items-start justify-between gap-1">
              <p
                className="flex-1 cursor-pointer text-xs leading-relaxed text-warm-400"
                onClick={() => setEditingIndex(idx)}
              >
                {item || (
                  <em className="text-warm-600">Click para editar...</em>
                )}
              </p>
              <div className="flex shrink-0 gap-0.5">
                <button
                  onClick={() => setEditingIndex(idx)}
                  className="cursor-pointer border-none bg-transparent p-0.5 text-warm-600 hover:text-warm-400"
                  aria-label="Editar"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => onRemove(idx)}
                  className="cursor-pointer border-none bg-transparent p-0.5 text-red-400/50 hover:text-red-400"
                  aria-label="Eliminar"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DosBanderas() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DosBanderasEntryWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    entryId: string;
    itemType?: 'estrellas' | 'madeja';
    itemIndex?: number;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToDosBanderas(user.uid, (data) => {
      setEntries(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <p className="mt-8 text-center text-sm text-warm-500 opacity-70">
        Cargando registros...
      </p>
    );
  }

  async function handleAdd() {
    if (!user) return;
    await addDosBanderasEntry(user.uid);
  }

  async function handleUpdateDate(entryId: string, value: string) {
    if (!user) return;
    const date = new Date(value);
    await updateEntry(user.uid, 'ejercicio1', entryId, {
      fecha: Timestamp.fromDate(date),
    });
  }

  async function handleAddListItem(
    entryId: string,
    listName: 'estrellas' | 'madeja',
  ) {
    if (!user) return;
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;
    await updateEntry(user.uid, 'ejercicio1', entryId, {
      [listName]: [...entry[listName], ''],
    });
  }

  async function handleUpdateListItem(
    entryId: string,
    listName: 'estrellas' | 'madeja',
    index: number,
    value: string,
  ) {
    if (!user) return;
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;
    const updated = [...entry[listName]];
    updated[index] = value;
    await updateEntry(user.uid, 'ejercicio1', entryId, {
      [listName]: updated,
    });
  }

  async function handleRemoveListItem(
    entryId: string,
    listName: 'estrellas' | 'madeja',
    index: number,
  ) {
    if (!user) return;
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;
    const updated = entry[listName].filter((_, i) => i !== index);
    await updateEntry(user.uid, 'ejercicio1', entryId, {
      [listName]: updated,
    });
    setDeleteTarget(null);
  }

  async function handleUpdateAprendizaje(entryId: string, value: string) {
    if (!user) return;
    await updateEntry(user.uid, 'ejercicio1', entryId, {
      aprendizaje: value,
    });
  }

  async function handleDeleteEntry(entryId: string) {
    if (!user) return;
    await deleteEntry(user.uid, 'ejercicio1', entryId);
    setDeleteTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.itemType != null && deleteTarget.itemIndex != null) {
      handleRemoveListItem(
        deleteTarget.entryId,
        deleteTarget.itemType,
        deleteTarget.itemIndex,
      );
    } else {
      handleDeleteEntry(deleteTarget.entryId);
    }
  }

  return (
    <div>
      <div className="mb-3 rounded-lg border border-warm-800 bg-warm-900/30 p-3 text-xs leading-relaxed text-warm-500">
        <strong className="text-warm-300">✨ Polvo de Estrellas:</strong>{' '}
        Serenidad, flujo, ser tu mismo.
        <br />
        <strong className="text-warm-300">🏴 La Madeja:</strong> Revoltijo,
        adaptacion forzada, incomodidad, atrapado.
        <br />
        <em>Registra momentos de ambas banderas cada dia.</em>
      </div>

      <button
        onClick={handleAdd}
        className="mb-3 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-warm-700 bg-warm-800/30 p-2.5 font-serif text-sm text-warm-400 transition-colors hover:bg-warm-800/50"
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
        Nuevo registro diario
      </button>

      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          title={formatDate(entry.fecha)}
          badge={
            <div className="flex gap-2 text-[0.65rem] text-warm-600">
              <span>✦ {entry.estrellas.length}</span>
              <span>◆ {entry.madeja.length}</span>
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="text-[0.65rem] uppercase tracking-wider text-warm-600">
              Fecha/Hora:
            </label>
            <input
              type="datetime-local"
              value={toLocalInput(entry.fecha)}
              onChange={(e) => handleUpdateDate(entry.id, e.target.value)}
              className="rounded border border-warm-700 bg-black/20 px-2 py-1 font-serif text-xs text-warm-300"
            />
          </div>

          <ListSection
            label="Polvo de Estrellas"
            icon="✨"
            items={entry.estrellas}
            onAdd={() => handleAddListItem(entry.id, 'estrellas')}
            onUpdate={(idx, val) =>
              handleUpdateListItem(entry.id, 'estrellas', idx, val)
            }
            onRemove={(idx) =>
              setDeleteTarget({
                entryId: entry.id,
                itemType: 'estrellas',
                itemIndex: idx,
              })
            }
            colorClass="text-amber-400/80"
            placeholder="Agrega momentos de serenidad y autenticidad..."
          />

          <ListSection
            label="La Madeja"
            icon="🏴"
            items={entry.madeja}
            onAdd={() => handleAddListItem(entry.id, 'madeja')}
            onUpdate={(idx, val) =>
              handleUpdateListItem(entry.id, 'madeja', idx, val)
            }
            onRemove={(idx) =>
              setDeleteTarget({
                entryId: entry.id,
                itemType: 'madeja',
                itemIndex: idx,
              })
            }
            colorClass="text-warm-400"
            placeholder="Agrega momentos de madeja/supervivencia..."
          />

          <div className="mb-2">
            <h3 className="mb-1 text-[0.7rem] uppercase tracking-wider text-warm-500">
              ¿Que aprendi hoy?
            </h3>
            <textarea
              value={entry.aprendizaje}
              onChange={(e) =>
                handleUpdateAprendizaje(entry.id, e.target.value)
              }
              placeholder="Reflexion del dia..."
              rows={2}
              className="w-full resize-y rounded border border-warm-800 bg-black/15 p-2 font-serif text-xs leading-relaxed text-warm-400"
            />
          </div>

          <div className="text-right">
            <button
              onClick={() => setDeleteTarget({ entryId: entry.id })}
              className="inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-1 font-serif text-[0.65rem] text-red-400/50 hover:text-red-400"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Eliminar registro
            </button>
          </div>
        </EntryCard>
      ))}

      {entries.length === 0 && (
        <EmptyState message="Aun no hay registros. Crea tu primer registro diario." />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={
            deleteTarget.itemType
              ? '¿Seguro que quieres eliminar este elemento?'
              : '¿Seguro que quieres eliminar este registro completo?'
          }
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
