import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../components/LoginPage';

const mockSignIn = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: mockSignIn,
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
        tagline: 'Tu espacio para registrar, reflexionar y crecer',
        signIn: 'Iniciar sesion con Google',
        sessionInfo: 'Ejercicios de introspección',
      },
      theme: { light: 'Modo claro', dark: 'Modo oscuro' },
      language: { toggle: 'Cambiar idioma' },
    },
  }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  it('renders app name and subtitle', () => {
    renderLogin();
    expect(screen.getByTestId('login-title')).toHaveTextContent('Estela');
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent(
      'Diario de Proceso',
    );
  });

  it('renders tagline', () => {
    renderLogin();
    expect(
      screen.getByText('Tu espacio para registrar, reflexionar y crecer'),
    ).toBeInTheDocument();
  });

  it('renders sign-in button', () => {
    renderLogin();
    const btn = screen.getByTestId('login-sign-in-button');
    expect(btn).toHaveTextContent('Iniciar sesion con Google');
  });

  it('calls signIn when button is clicked', async () => {
    const u = userEvent.setup();
    renderLogin();
    await u.click(screen.getByTestId('login-sign-in-button'));
    expect(mockSignIn).toHaveBeenCalledOnce();
  });

  it('renders theme and language toggles', () => {
    renderLogin();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('renders session info text', () => {
    renderLogin();
    expect(screen.getByText('Ejercicios de introspección')).toBeInTheDocument();
  });
});
