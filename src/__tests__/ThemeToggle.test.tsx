import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../components/ThemeToggle';

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: vi.fn(),
    t: {
      theme: { light: 'Modo claro', dark: 'Modo oscuro' },
    },
  }),
}));

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  localStorage.clear();
});

describe('ThemeToggle', () => {
  it('renders with dark mode aria-label when in light mode', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('theme-toggle')).toHaveAttribute(
      'aria-label',
      'Modo oscuro',
    );
  });

  it('toggles to dark mode when clicked', async () => {
    const u = userEvent.setup();
    render(<ThemeToggle />);

    await u.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles back to light mode', async () => {
    document.documentElement.classList.add('dark');
    const u = userEvent.setup();
    render(<ThemeToggle />);

    expect(screen.getByTestId('theme-toggle')).toHaveAttribute(
      'aria-label',
      'Modo claro',
    );

    await u.click(screen.getByTestId('theme-toggle'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
