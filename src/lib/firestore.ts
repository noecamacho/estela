import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import type {
  ExerciseKey,
  DosBanderasEntry,
  DosBanderasEntryWithId,
  FreeformEntry,
  FreeformEntryWithId,
} from '../types';

function getEntriesCollection(userId: string, exerciseKey: ExerciseKey) {
  return collection(db, 'users', userId, exerciseKey);
}

export function subscribeToDosBanderas(
  userId: string,
  callback: (entries: DosBanderasEntryWithId[]) => void,
): Unsubscribe {
  const q = query(
    getEntriesCollection(userId, 'ejercicio1'),
    orderBy('fecha', 'desc'),
  );
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as DosBanderasEntry),
    }));
    callback(entries);
  });
}

export function subscribeToFreeform(
  userId: string,
  exerciseKey: 'ejercicio2' | 'ejercicio3',
  callback: (entries: FreeformEntryWithId[]) => void,
): Unsubscribe {
  const q = query(
    getEntriesCollection(userId, exerciseKey),
    orderBy('fecha', 'desc'),
  );
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as FreeformEntry),
    }));
    callback(entries);
  });
}

export async function addDosBanderasEntry(userId: string) {
  const entry: DosBanderasEntry = {
    fecha: Timestamp.now(),
    estrellas: [],
    madeja: [],
    aprendizaje: '',
  };
  const docRef = await addDoc(
    getEntriesCollection(userId, 'ejercicio1'),
    entry,
  );
  return docRef.id;
}

export async function addFreeformEntry(
  userId: string,
  exerciseKey: 'ejercicio2' | 'ejercicio3',
) {
  const entry: FreeformEntry = {
    fecha: Timestamp.now(),
    titulo: '',
    contenido: '',
  };
  const docRef = await addDoc(getEntriesCollection(userId, exerciseKey), entry);
  return docRef.id;
}

export async function updateEntry(
  userId: string,
  exerciseKey: ExerciseKey,
  entryId: string,
  data: Record<string, unknown>,
) {
  await updateDoc(doc(db, 'users', userId, exerciseKey, entryId), data);
}

export async function deleteEntry(
  userId: string,
  exerciseKey: ExerciseKey,
  entryId: string,
) {
  await deleteDoc(doc(db, 'users', userId, exerciseKey, entryId));
}
