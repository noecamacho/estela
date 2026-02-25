import type { Timestamp } from 'firebase/firestore';

export interface DosBanderasEntry {
  fecha: Timestamp;
  estrellas: string[];
  madeja: string[];
  aprendizaje: string;
}

export interface FreeformEntry {
  fecha: Timestamp;
  titulo: string;
  contenido: string;
}

export interface DosBanderasEntryWithId extends DosBanderasEntry {
  id: string;
}

export interface FreeformEntryWithId extends FreeformEntry {
  id: string;
}

export type ExerciseKey = 'ejercicio1' | 'ejercicio2' | 'ejercicio3';
