import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

const mockGetItem = vi.fn();
const mockSetItem = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockGetItem.mockReturnValue(null);
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: mockGetItem, setItem: mockSetItem },
    writable: true,
  });
});

function TestConsumer() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="app-name">{t.auth.appName}</span>
      <span data-testid="sign-in">{t.auth.signIn}</span>
      <button onClick={() => setLanguage('en')}>Switch to EN</button>
      <button onClick={() => setLanguage('es')}>Switch to ES</button>
    </div>
  );
}

describe('LanguageContext', () => {
  it('defaults to Spanish when no stored preference', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('language')).toHaveTextContent('es');
    expect(screen.getByTestId('sign-in')).toHaveTextContent(
      'Iniciar sesion con Google',
    );
  });

  it('reads stored language preference', () => {
    mockGetItem.mockReturnValue('en');
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('sign-in')).toHaveTextContent(
      'Sign in with Google',
    );
  });

  it('ignores invalid stored values', () => {
    mockGetItem.mockReturnValue('fr');
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('language')).toHaveTextContent('es');
  });

  it('switches language and persists to localStorage', async () => {
    const u = userEvent.setup();
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );

    await act(async () => {
      await u.click(screen.getByText('Switch to EN'));
    });

    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(mockSetItem).toHaveBeenCalledWith('language', 'en');
  });

  it('throws if useLanguage is used outside LanguageProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useLanguage must be used within LanguageProvider',
    );
    spy.mockRestore();
  });

  it('provides correct translations object for current language', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>,
    );
    expect(screen.getByTestId('app-name')).toHaveTextContent('Estela');
  });
});
