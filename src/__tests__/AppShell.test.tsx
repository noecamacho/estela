import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '../components/AppShell';
import { es } from '../i18n/translations';

const mockSignOut = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      uid: 'test-uid',
      photoURL: 'https://example.com/photo.jpg',
      displayName: 'Ana Garcia',
    },
    loading: false,
    signIn: vi.fn(),
    signOut: mockSignOut,
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AppShell', () => {
  it('renders the app title', () => {
    render(<AppShell />);
    expect(screen.getByTestId('app-title')).toHaveTextContent('Estela');
  });

  it('renders personalized greeting with first name', () => {
    render(<AppShell />);
    const greeting = screen.getByTestId('app-greeting');
    expect(greeting).toHaveTextContent('Ana');
  });

  it('renders user avatar when photoURL exists', () => {
    render(<AppShell />);
    const img = screen.getByAltText('');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders marquee ticker', () => {
    render(<AppShell />);
    expect(screen.getByTestId('app-marquee')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(<AppShell />);
    expect(screen.getByTestId('app-sign-out')).toHaveTextContent('Salir');
  });

  it('calls signOut when sign-out button is clicked', async () => {
    const u = userEvent.setup();
    render(<AppShell />);
    await u.click(screen.getByTestId('app-sign-out'));
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it('renders theme and language toggles', () => {
    render(<AppShell />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('renders exercise tabs', () => {
    render(<AppShell />);
    expect(screen.getByText('Dos Banderas')).toBeInTheDocument();
  });

  it('shows afternoon greeting when hour is 12-17', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    render(<AppShell />);
    const greeting = screen.getByTestId('app-greeting');
    expect(greeting).toHaveTextContent(es.greeting.afternoon);
  });

  it('shows evening greeting when hour is 18+', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    render(<AppShell />);
    const greeting = screen.getByTestId('app-greeting');
    expect(greeting).toHaveTextContent(es.greeting.evening);
  });
});
