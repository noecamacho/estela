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

function relativePrefix(d: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diff === 0) return 'Hoy — ';
  if (diff === 1) return 'Ayer — ';
  return '';
}

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
  const prefix = relativePrefix(d);
  return `${prefix}${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()} — ${h12}:${m}${ampm}`;
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
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <h3
          className={`text-[0.7rem] font-medium uppercase tracking-wider ${colorClass}`}
        >
          {icon} {label}
        </h3>
        <button
          onClick={onAdd}
          className="cursor-pointer border-none bg-transparent p-1 text-fg-subtle transition-colors hover:text-fg"
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
        <p className="font-serif text-xs italic text-fg-subtle">
          {placeholder}
        </p>
      )}

      {items.map((item, idx) => (
        <div key={idx} className="mb-1.5 flex items-start gap-2">
          <span className="mt-1 shrink-0 text-[0.6rem] text-fg-subtle">
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
                className="min-h-[3rem] flex-1 resize-y rounded border border-border bg-transparent p-2 font-serif text-xs leading-relaxed text-fg transition-colors focus:border-accent focus:outline-none"
              />
            </div>
          ) : (
            <div className="flex flex-1 items-start justify-between gap-1">
              <p
                className="flex-1 cursor-pointer font-serif text-xs leading-relaxed text-fg-muted transition-colors hover:text-fg"
                onClick={() => setEditingIndex(idx)}
              >
                {item || (
                  <em className="text-fg-subtle">Click para editar...</em>
                )}
              </p>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => setEditingIndex(idx)}
                  className="cursor-pointer border-none bg-transparent p-0.5 text-fg-subtle transition-colors hover:text-fg-muted"
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
                  className="cursor-pointer border-none bg-transparent p-0.5 text-danger-muted transition-colors hover:text-danger"
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
  const [showGuide, setShowGuide] = useState(false);

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
      <div className="mt-12 flex justify-center">
        <div className="loading-spinner" />
      </div>
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
        {showGuide ? 'Ocultar guia' : 'Ver guia del ejercicio'}
      </button>

      {showGuide && (
        <div className="animate-entry-expand mb-6 border-l-2 border-accent/30 pl-4 font-serif text-xs leading-relaxed text-fg-muted">
          <p>
            <strong className="text-fg">✨ Polvo de Estrellas:</strong>{' '}
            Serenidad, flujo, ser tu mismo.
          </p>
          <p className="mt-1">
            <strong className="text-fg">🏴 La Madeja:</strong> Revoltijo,
            adaptacion forzada, incomodidad, atrapado.
          </p>
          <p className="mt-2 italic text-fg-subtle">
            Registra momentos de ambas banderas cada dia.
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
        Nuevo registro diario
      </button>

      {entries.map((entry, i) => (
        <EntryCard
          key={entry.id}
          title={formatDate(entry.fecha)}
          index={i}
          badge={
            <div className="flex gap-2">
              <span className="pill text-fg-muted">
                ✦ {entry.estrellas.length}
              </span>
              <span className="pill text-fg-muted">
                ◆ {entry.madeja.length}
              </span>
            </div>
          }
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <label className="text-[0.6rem] font-medium uppercase tracking-wider text-fg-subtle">
              Fecha/Hora:
            </label>
            <input
              type="datetime-local"
              value={toLocalInput(entry.fecha)}
              onChange={(e) => handleUpdateDate(entry.id, e.target.value)}
              className="rounded border border-border bg-transparent px-2 py-1 font-serif text-xs text-fg-muted transition-colors focus:border-accent focus:outline-none"
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
            colorClass="text-star"
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
            colorClass="text-fg-muted"
            placeholder="Agrega momentos de madeja/supervivencia..."
          />

          <div className="mb-2">
            <h3 className="mb-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-fg-subtle">
              ¿Que aprendi hoy?
            </h3>
            <textarea
              value={entry.aprendizaje}
              onChange={(e) =>
                handleUpdateAprendizaje(entry.id, e.target.value)
              }
              placeholder="Reflexion del dia..."
              rows={2}
              className="w-full resize-y rounded border border-border bg-transparent p-2.5 font-serif text-xs leading-relaxed text-fg-muted transition-colors focus:border-accent focus:outline-none"
            />
          </div>

          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <button
              onClick={() => setDeleteTarget({ entryId: entry.id })}
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
