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
    expect(screen.getByText('Mi Mama')).toBeInTheDocument();
    expect(screen.getByText('El Hombre Ideal')).toBeInTheDocument();
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

    await user.click(screen.getByText('Mi Mama'));
    await waitFor(() => {
      expect(screen.getByText('Nueva entrada')).toBeInTheDocument();
    });

    await user.click(screen.getByText('El Hombre Ideal'));
    await waitFor(() => {
      expect(screen.getByText('Nueva reflexion')).toBeInTheDocument();
    });
  });
});
