import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: true,
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

describe('LoginPage — loading state', () => {
  it('shows loading spinner while auth is resolving', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });
});
