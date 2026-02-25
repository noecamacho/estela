import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockAddDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
const mockOnSnapshot = vi.fn();
const mockQuery = vi.fn();
const mockCollection = vi.fn();
const mockDoc = vi.fn();
const mockOrderBy = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
  doc: (...args: unknown[]) => mockDoc(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  Timestamp: {
    now: () => ({ seconds: 1000, nanoseconds: 0 }),
    fromDate: (d: Date) => ({ seconds: d.getTime() / 1000, nanoseconds: 0 }),
  },
}));

vi.mock('../lib/firebase', () => ({
  db: {},
}));

import {
  addDosBanderasEntry,
  addFreeformEntry,
  updateEntry,
  deleteEntry,
  subscribeToDosBanderas,
  subscribeToFreeform,
} from '../lib/firestore';

describe('Firestore helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCollection.mockReturnValue('collection-ref');
    mockQuery.mockReturnValue('query-ref');
    mockDoc.mockReturnValue('doc-ref');
  });

  it('addDosBanderasEntry creates entry with empty fields', async () => {
    mockAddDoc.mockResolvedValue({ id: 'new-id' });

    const id = await addDosBanderasEntry('user-1');
    expect(id).toBe('new-id');
    expect(mockAddDoc).toHaveBeenCalledWith('collection-ref', {
      fecha: { seconds: 1000, nanoseconds: 0 },
      estrellas: [],
      madeja: [],
      aprendizaje: '',
    });
  });

  it('addFreeformEntry creates entry with empty fields', async () => {
    mockAddDoc.mockResolvedValue({ id: 'new-id-2' });

    const id = await addFreeformEntry('user-1', 'ejercicio2');
    expect(id).toBe('new-id-2');
    expect(mockAddDoc).toHaveBeenCalledWith('collection-ref', {
      fecha: { seconds: 1000, nanoseconds: 0 },
      titulo: '',
      contenido: '',
    });
  });

  it('updateEntry calls updateDoc with correct args', async () => {
    await updateEntry('user-1', 'ejercicio1', 'entry-1', {
      aprendizaje: 'test',
    });
    expect(mockUpdateDoc).toHaveBeenCalledWith('doc-ref', {
      aprendizaje: 'test',
    });
  });

  it('deleteEntry calls deleteDoc with correct args', async () => {
    await deleteEntry('user-1', 'ejercicio2', 'entry-2');
    expect(mockDeleteDoc).toHaveBeenCalledWith('doc-ref');
  });

  it('subscribeToDosBanderas calls onSnapshot and returns unsubscribe', () => {
    const unsubFn = vi.fn();
    mockOnSnapshot.mockReturnValue(unsubFn);
    const callback = vi.fn();

    const unsub = subscribeToDosBanderas('user-1', callback);
    expect(mockOnSnapshot).toHaveBeenCalled();
    expect(unsub).toBe(unsubFn);
  });

  it('subscribeToDosBanderas maps snapshot docs to entries with id', () => {
    const unsubFn = vi.fn();
    mockOnSnapshot.mockImplementation(
      (_q: unknown, handler: (snap: unknown) => void) => {
        handler({
          docs: [
            {
              id: 'doc-1',
              data: () => ({
                fecha: { seconds: 100 },
                estrellas: ['a'],
                madeja: ['b'],
                aprendizaje: 'c',
              }),
            },
          ],
        });
        return unsubFn;
      },
    );
    const callback = vi.fn();
    subscribeToDosBanderas('user-1', callback);
    expect(callback).toHaveBeenCalledWith([
      {
        id: 'doc-1',
        fecha: { seconds: 100 },
        estrellas: ['a'],
        madeja: ['b'],
        aprendizaje: 'c',
      },
    ]);
  });

  it('subscribeToFreeform calls onSnapshot and returns unsubscribe', () => {
    const unsubFn = vi.fn();
    mockOnSnapshot.mockReturnValue(unsubFn);
    const callback = vi.fn();

    const unsub = subscribeToFreeform('user-1', 'ejercicio3', callback);
    expect(mockOnSnapshot).toHaveBeenCalled();
    expect(unsub).toBe(unsubFn);
  });

  it('subscribeToFreeform maps snapshot docs to entries with id', () => {
    const unsubFn = vi.fn();
    mockOnSnapshot.mockImplementation(
      (_q: unknown, handler: (snap: unknown) => void) => {
        handler({
          docs: [
            {
              id: 'doc-2',
              data: () => ({
                fecha: { seconds: 200 },
                titulo: 'Test',
                contenido: 'Content',
              }),
            },
          ],
        });
        return unsubFn;
      },
    );
    const callback = vi.fn();
    subscribeToFreeform('user-1', 'ejercicio2', callback);
    expect(callback).toHaveBeenCalledWith([
      {
        id: 'doc-2',
        fecha: { seconds: 200 },
        titulo: 'Test',
        contenido: 'Content',
      },
    ]);
  });
});
