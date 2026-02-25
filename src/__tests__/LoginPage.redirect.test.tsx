import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';

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
    t: {
      auth: {
        subtitle: 'Diario',
        appName: 'Estela',
        tagline: 'Tagline',
        signIn: 'Sign in',
        sessionInfo: 'Info',
      },
      theme: { light: 'Light', dark: 'Dark' },
      language: { toggle: 'Toggle' },
    },
  }),
}));

describe('LoginPage — authenticated redirect', () => {
  it('redirects when user is already authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>,
    );
    // Login page should not be rendered when user is authenticated
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
