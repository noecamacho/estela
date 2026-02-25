import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DosBanderas } from '../components/DosBanderas';
import { es } from '../i18n/translations';
import { subscribeToDosBanderas } from '../lib/firestore';

const mockAddDosBanderasEntry = vi.fn();
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
  subscribeToDosBanderas: vi.fn(
    (_uid: string, callback: (entries: unknown[]) => void) => {
      queueMicrotask(() => callback([]));
      return vi.fn();
    },
  ),
  addDosBanderasEntry: (...args: unknown[]) => mockAddDosBanderasEntry(...args),
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

const mockEntry = {
  id: 'entry-1',
  fecha: {
    toDate: () => new Date(2026, 0, 15, 10, 30),
    seconds: 1000,
    nanoseconds: 0,
  },
  estrellas: ['Morning walk', 'Deep conversation'],
  madeja: ['Work stress'],
  aprendizaje: 'I learned to breathe',
};

function renderWithEntries(entries: unknown[] = []) {
  vi.mocked(subscribeToDosBanderas).mockImplementation((_uid, callback) => {
    queueMicrotask(() => callback(entries as never));
    return vi.fn();
  });
  return render(<DosBanderas />);
}

describe('DosBanderas', () => {
  it('renders empty state when no entries', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('renders add button', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('dos-banderas-add')).toBeInTheDocument();
    });
  });

  it('calls addDosBanderasEntry when add button is clicked', async () => {
    const u = userEvent.setup();
    renderWithEntries([]);
    await waitFor(() => {
      expect(screen.getByTestId('dos-banderas-add')).toBeInTheDocument();
    });

    await u.click(screen.getByTestId('dos-banderas-add'));
    expect(mockAddDosBanderasEntry).toHaveBeenCalledWith('test-uid');
  });

  it('renders guide toggle button', async () => {
    renderWithEntries([]);
    await waitFor(() => {
      expect(
        screen.getByTestId('dos-banderas-guide-toggle'),
      ).toBeInTheDocument();
    });
  });

  it('shows guide content when toggle is clicked', async () => {
    const u = userEvent.setup();
    renderWithEntries([]);
    await waitFor(() => {
      expect(
        screen.getByTestId('dos-banderas-guide-toggle'),
      ).toBeInTheDocument();
    });

    expect(screen.queryByTestId('dos-banderas-guide')).not.toBeInTheDocument();
    await u.click(screen.getByTestId('dos-banderas-guide-toggle'));
    expect(screen.getByTestId('dos-banderas-guide')).toBeInTheDocument();
  });

  it('hides guide content when toggle is clicked again', async () => {
    const u = userEvent.setup();
    renderWithEntries([]);
    await waitFor(() => {
      expect(
        screen.getByTestId('dos-banderas-guide-toggle'),
      ).toBeInTheDocument();
    });

    await u.click(screen.getByTestId('dos-banderas-guide-toggle'));
    expect(screen.getByTestId('dos-banderas-guide')).toBeInTheDocument();

    await u.click(screen.getByTestId('dos-banderas-guide-toggle'));
    expect(screen.queryByTestId('dos-banderas-guide')).not.toBeInTheDocument();
  });

  it('renders entries when data arrives', async () => {
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card')).toBeInTheDocument();
    });
  });

  it('shows entry badges with star and madeja counts', async () => {
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByText('✦ 2')).toBeInTheDocument();
      expect(screen.getByText('◆ 1')).toBeInTheDocument();
    });
  });

  it('shows expanded entry with list sections and learning field', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });

    await u.click(screen.getByTestId('entry-card-toggle'));
    expect(screen.getByTestId('entry-card-content')).toBeInTheDocument();
    // Section labels are inside h3 elements with icon prefix
    const headings = screen.getAllByRole('heading', { level: 3 });
    const labels = headings.map((h) => h.textContent);
    expect(labels).toContain('✨ Polvo de Estrellas');
    expect(labels).toContain('🏴 La Madeja');
    expect(
      screen.getByDisplayValue('I learned to breathe'),
    ).toBeInTheDocument();
  });

  it('shows delete confirmation dialog and deletes entry', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    await u.click(screen.getByText('Eliminar registro'));
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    await u.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(mockDeleteEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
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
    await u.click(screen.getByText('Eliminar registro'));

    await u.click(screen.getByTestId('confirm-dialog-cancel'));
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  it('shows list items inside expanded entry', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    expect(screen.getByText('Morning walk')).toBeInTheDocument();
    expect(screen.getByText('Deep conversation')).toBeInTheDocument();
    expect(screen.getByText('Work stress')).toBeInTheDocument();
  });

  it('updates learning field on change', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    const textarea = screen.getByDisplayValue('I learned to breathe');
    await u.clear(textarea);
    await u.type(textarea, 'New learning');
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

  it('adds a new list item when add button is clicked', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click the add button for estrellas section
    const addButtons = screen.getAllByRole('button', {
      name: /agregar/i,
    });
    await u.click(addButtons[0]);
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        estrellas: expect.any(Array),
      }),
    );
  });

  it('enters edit mode when clicking on a list item', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    await u.click(screen.getByText('Morning walk'));
    // Should show a textarea in edit mode
    const textarea = screen.getByDisplayValue('Morning walk');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('shows delete confirmation for list item', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click delete button for a list item
    const deleteButtons = screen.getAllByRole('button', {
      name: es.common.delete,
    });
    await u.click(deleteButtons[0]);
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(
      screen.getByText(es.dosBanderas.deleteItemConfirm),
    ).toBeInTheDocument();
  });

  it('confirms list item deletion and calls removeListItem', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click delete button for first estrellas item
    const deleteButtons = screen.getAllByRole('button', {
      name: es.common.delete,
    });
    await u.click(deleteButtons[0]);
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    // Confirm the deletion
    await u.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        estrellas: expect.any(Array),
      }),
    );
  });

  it('saves list item edit on blur', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click on the list item text to enter edit mode
    await u.click(screen.getByText('Morning walk'));
    const textarea = screen.getByDisplayValue('Morning walk');

    // Change text and blur to save
    await u.clear(textarea);
    await u.type(textarea, 'Evening walk');
    await u.tab(); // triggers blur
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        estrellas: expect.arrayContaining(['Evening walk']),
      }),
    );
  });

  it('cancels list item edit on Escape key', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    await u.click(screen.getByText('Morning walk'));
    const textarea = screen.getByDisplayValue('Morning walk');
    await u.keyboard('{Escape}');

    // Textarea should be gone, back to display mode
    expect(textarea).not.toBeInTheDocument();
    expect(screen.getByText('Morning walk')).toBeInTheDocument();
  });

  it('adds a madeja list item', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Second add button is for madeja
    const addButtons = screen.getAllByRole('button', {
      name: /agregar/i,
    });
    await u.click(addButtons[1]);
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        madeja: expect.any(Array),
      }),
    );
  });

  it('enters edit mode for madeja item and saves on blur', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click on madeja item text
    await u.click(screen.getByText('Work stress'));
    const textarea = screen.getByDisplayValue('Work stress');
    await u.clear(textarea);
    await u.type(textarea, 'Less stress');
    await u.tab(); // triggers blur
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        madeja: expect.arrayContaining(['Less stress']),
      }),
    );
  });

  it('confirms madeja list item deletion', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // The delete buttons are ordered: estrellas[0], estrellas[1], madeja[0]
    const deleteButtons = screen.getAllByRole('button', {
      name: es.common.delete,
    });
    await u.click(deleteButtons[2]); // madeja item
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    await u.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(mockUpdateEntry).toHaveBeenCalledWith(
      'test-uid',
      'ejercicio1',
      'entry-1',
      expect.objectContaining({
        madeja: expect.any(Array),
      }),
    );
  });

  it('enters edit mode via edit button', async () => {
    const u = userEvent.setup();
    renderWithEntries([mockEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    // Click the edit (pencil) button for first item
    const editButtons = screen.getAllByRole('button', {
      name: es.common.edit,
    });
    await u.click(editButtons[0]);
    expect(screen.getByDisplayValue('Morning walk')).toBeInTheDocument();
  });

  it('shows empty list placeholder text', async () => {
    const u = userEvent.setup();
    const emptyEntry = {
      ...mockEntry,
      estrellas: [],
      madeja: [],
      aprendizaje: '',
    };
    renderWithEntries([emptyEntry]);
    await waitFor(() => {
      expect(screen.getByTestId('entry-card-toggle')).toBeInTheDocument();
    });
    await u.click(screen.getByTestId('entry-card-toggle'));

    expect(
      screen.getByText(es.dosBanderas.section1Placeholder),
    ).toBeInTheDocument();
    expect(
      screen.getByText(es.dosBanderas.section2Placeholder),
    ).toBeInTheDocument();
  });
});
