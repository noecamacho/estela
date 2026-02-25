import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseTabs } from '../components/ExerciseTabs';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid', photoURL: null },
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: vi.fn(),
    t: {
      common: {
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        clickToEdit: 'Click para editar...',
        add: (label: string) => `Agregar ${label.toLowerCase()}`,
      },
      nav: {
        logout: 'Salir',
        showGuide: 'Ver guia del ejercicio',
        hideGuide: 'Ocultar guia',
      },
      exercises: {
        exercise1: {
          name: 'Dos Banderas',
          icon: '🏴',
          guide: {
            section1Label: '✨ Polvo de Estrellas:',
            section1Desc: 'Serenidad, flujo, ser tu mismo.',
            section2Label: '🏴 La Madeja:',
            section2Desc:
              'Revoltijo, adaptacion forzada, incomodidad, atrapado.',
            instruction: 'Registra momentos de ambas banderas cada dia.',
          },
          addLabel: 'Nuevo registro diario',
          emptyMessage: 'Aun no hay registros. Crea tu primer registro diario.',
        },
        exercise2: {
          name: 'Vinculo Significativo',
          icon: '🕊',
          description:
            'Escribe sobre una relacion significativa en tus años formativos.',
          questions: '¿Cual es tu primer recuerdo de sentirte cerca?',
          addLabel: 'Nueva entrada',
          emptyMessage: 'Cuando estes listo, crea tu primera entrada.',
        },
        exercise3: {
          name: 'Expectativas Idealizadas',
          icon: '🪞',
          description: 'Examina las expectativas idealizadas.',
          questions: '¿Que caracteristicas idealizas?',
          addLabel: 'Nueva reflexion',
          emptyMessage: 'Cuando estes listo, empieza tu primera reflexion.',
        },
      },
      dosBanderas: {
        newRecord: 'Nuevo registro diario',
        dateTimeLabel: 'Fecha/Hora:',
        section1Label: 'Polvo de Estrellas',
        section1Placeholder: 'Agrega momentos de serenidad...',
        section2Label: 'La Madeja',
        section2Placeholder: 'Agrega momentos de madeja...',
        learningLabel: '¿Que aprendi hoy?',
        learningPlaceholder: 'Reflexion del dia...',
        deleteRecord: 'Eliminar registro',
        deleteRecordConfirm: '¿Seguro que quieres eliminar este registro?',
        deleteItemConfirm: '¿Seguro que quieres eliminar este elemento?',
        noRecords: 'Aun no hay registros.',
      },
      freeform: {
        instructionLabel: 'Instrucciones:',
        questionsLabel: 'Preguntas guia:',
        dateLabel: 'Fecha:',
        titlePlaceholder: 'Titulo de esta entrada...',
        contentPlaceholder: 'Escribe aqui...',
        noTitle: 'Sin titulo',
        deleteEntry: 'Eliminar entrada',
        deleteEntryConfirm: '¿Seguro que quieres eliminar esta entrada?',
      },
      theme: { light: 'Modo claro', dark: 'Modo oscuro' },
      messages: { noHurry: 'Sin prisa, sin presion' },
    },
  }),
}));

vi.mock('../lib/firestore', () => ({
  subscribeToDosBanderas: vi.fn(
    (_uid: string, callback: (entries: unknown[]) => void) => {
      queueMicrotask(() => callback([]));
      return vi.fn();
    },
  ),
  subscribeToFreeform: vi.fn(
    (_uid: string, _key: string, callback: (entries: unknown[]) => void) => {
      queueMicrotask(() => callback([]));
      return vi.fn();
    },
  ),
  addDosBanderasEntry: vi.fn(),
  addFreeformEntry: vi.fn(),
  updateEntry: vi.fn(),
  deleteEntry: vi.fn(),
}));

describe('ExerciseTabs', () => {
  it('renders all three tabs', () => {
    render(<ExerciseTabs />);
    expect(screen.getByText('Dos Banderas')).toBeInTheDocument();
    expect(screen.getByText('Vinculo Significativo')).toBeInTheDocument();
    expect(screen.getByText('Expectativas Idealizadas')).toBeInTheDocument();
  });

  it('shows DosBanderas content by default', async () => {
    render(<ExerciseTabs />);
    await waitFor(() => {
      expect(screen.getByText('Nuevo registro diario')).toBeInTheDocument();
    });
  });

  it('switches tabs when clicked', async () => {
    const user = userEvent.setup();
    render(<ExerciseTabs />);

    await user.click(screen.getByText('Vinculo Significativo'));
    await waitFor(() => {
      expect(screen.getByText('Nueva entrada')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Expectativas Idealizadas'));
    await waitFor(() => {
      expect(screen.getByText('Nueva reflexion')).toBeInTheDocument();
    });
  });
});
