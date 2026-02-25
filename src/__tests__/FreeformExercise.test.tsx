import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FreeformExercise } from '../components/FreeformExercise';
import { es } from '../i18n/translations';
import { subscribeToFreeform } from '../lib/firestore';

const mockAddFreeformEntry = vi.fn();
const mockUpdateEntry = vi.fn();
const mockDeleteEntry = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: vi.fn(),
    t: es,
  }),
}));

vi.mock('../lib/firestore', () => ({
  subscribeToFreeform: vi.fn(
    (_uid: string, _key: string, callback: (entries: unknown[]) => void) => {
      queueMicrotask(() => callback([]));
      return vi.fn();
    },
  ),
  addFreeformEntry: (...args: unknown[]) => mockAddFreeformEntry(...args),
  updateEntry: (...args: unknown[]) => mockUpdateEntry(...args),
  deleteEntry: (...args: unknown[]) => mockDeleteEntry(...args),
}));

vi.mock('firebase/firestore', () => ({
  Timestamp: {
    now: () => ({
      toDate: () => new Date(2026, 0, 15, 10, 30),
      seconds: 1000,
      nanoseconds: 0,
    }),
    fromDate: (d: Date) => ({
      toDate: () => d,
      seconds: d.getTime() / 1000,
      nanoseconds: 0,
    }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const defaultProps = {
  exerciseKey: 'ejercicio2' as const,
  description: 'Test description',
  questions: 'Test questions',
  addLabel: 'Nueva entrada',
  emptyMessage: 'No entries yet',
};

const mockEntry = {
  id: 'entry-1',
  fecha: {
    toDate: () => new Date(2026, 0, 15, 10, 30),
    seconds: 1000,
    nanoseconds: 0,
  },
  titulo: 'My First Entry',
  contenido: 'Some content here',
};

function renderWithEntries(entries: unknown[] = []) {
  vi.mocked(subscribeToFreeform).mockImplementation((_uid, _key, callback) => {
    queueMicrotask(() => callback(entries as never));
    return vi.fn();
  });
  return render(<FreeformExercise {...defaultProps} />);
}

describe('FreeformExercise', () => {
  it('renders empty state when no entries', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
    expect(screen.getByText('No entries yet')).toBeInTheDocument();
  });

  it('renders add button with correct label', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('freeform-add')).toHaveTextContent(
        'Nueva entrada',
      );
    });
  });

  it('calls addFreeformEntry when add button is clicked', async () => {
    const u = userEvent.setup();
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('freeform-add')).toBeInTheDocument();
    });

    await u.click(screen.getByTestId('freeform-add'));
    expect(mockAddFreeformEntry).toHaveBeenCalledWith('test-uid', 'ejercicio2');
  });

  it('shows guide toggle button', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('freeform-guide-toggle')).toBeInTheDocument();
    });
  });

  it('shows and hides guide content', async () => {
    const u = userEvent.setup();
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('freeform-guide-toggle')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('freeform-guide')).not.toBeInTheDocument();
    await u.click(screen.getByTestId('freeform-guide-toggle'));
    expect(screen.getByTestId('freeform-guide')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test questions')).toBeInTheDocument();

    await u.click(screen.getByTestId('freeform-guide-toggle'));
    expect(screen.queryByTestId('freeform-guide')).not.toBeInTheDocument();
  });

  it('renders entries when data arrives', async () => {
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByText('My First Entry')).toBeInTheDocument();
    });
  });

  it('shows "Sin titulo" for entries without title', async () => {
    renderWithEntries([{ ...mockEntry, titulo: '' }]);
    await waitFor(() => {
      expect(screen.getByText('Sin titulo')).toBeInTheDocument();
    });
  });

  it('shows expanded entry with title input, content textarea, and date', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    expect(screen.getByDisplayValue('My First Entry')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Some content here')).toBeInTheDocument();
    expect(screen.getByText('Fecha:')).toBeInTheDocument();
  });

  it('shows delete dialog and confirms deletion', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    await u.click(screen.getByText('Eliminar entrada'));
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    await u.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(mockDeleteEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio2',
      'entry-1',
    );
  });

  it('cancels delete when cancel is clicked', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));
    await u.click(screen.getByText('Eliminar entrada'));
    await u.click(screen.getByTestId('confirm-dialog-cancel'));

    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  it('renders with ejercicio3 key', async () => {
    renderWithEntries([]);
    const props3 = {
      ...defaultProps,
      exerciseKey: 'ejercicio3' as const,
      addLabel: 'Nueva reflexion',
      emptyMessage: 'No reflections yet',
    };
    vi.mocked(subscribeToFreeform).mockImplementation(
      (_uid, _key, callback) => {
        queueMicrotask(() => callback([] as never));
        return vi.fn();
      },
    );
    render(<FreeformExercise {...props3} />);
    await waitFor(() => {
      expect(screen.getByText('Nueva reflexion')).toBeInTheDocument();
    });
  });

  it('updates title field on change', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    const titleInput = screen.getByDisplayValue('My First Entry');
    await u.clear(titleInput);
    await u.type(titleInput, 'Updated Title');
    expect(mockUpdateEntry).toHaveBeenCalled();
  });

  it('updates content field on change', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    const contentArea = screen.getByDisplayValue('Some content here');
    await u.clear(contentArea);
    await u.type(contentArea, 'New content');
    expect(mockUpdateEntry).toHaveBeenCalled();
  });

  it('updates date on change', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    const dateInput = screen.getByDisplayValue('2026-01-15T10:30');
    await u.clear(dateInput);
    await u.type(dateInput, '2026-02-20T14:00');
    expect(mockUpdateEntry).toHaveBeenCalled();
  });
});
