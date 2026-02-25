import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
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
        subtitle: 'Diario de Proceso',
        appName: 'Estela',
        tagline: 'Tu espacio',
        signIn: 'Iniciar sesion con Google',
        sessionInfo: 'Info',
      },
      theme: { light: 'Modo claro', dark: 'Modo oscuro' },
      language: { toggle: 'Cambiar idioma' },
    },
  }),
}));

describe('App routing', () => {
  it('renders login page at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('redirects unauthenticated user from / to /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    // ProtectedRoute redirects to login
    expect(screen.queryByTestId('app-shell')).not.toBeInTheDocument();
  });

  it('redirects unknown routes to /', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-page']}>
        <App />
      </MemoryRouter>,
    );
    // Catch-all redirects to /, which then redirects to login
    expect(screen.queryByTestId('app-shell')).not.toBeInTheDocument();
  });
});
