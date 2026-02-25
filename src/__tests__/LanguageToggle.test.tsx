import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageToggle } from '../components/LanguageToggle';

const mockSetLanguage = vi.fn();

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: mockSetLanguage,
    t: {
      language: { toggle: 'Cambiar idioma' },
    },
  }),
}));

describe('LanguageToggle', () => {
  it('shows EN when current language is Spanish', () => {
    render(<LanguageToggle />);
    expect(screen.getByTestId('language-toggle')).toHaveTextContent('EN');
  });

  it('has correct aria-label', () => {
    render(<LanguageToggle />);
    expect(screen.getByTestId('language-toggle')).toHaveAttribute(
      'aria-label',
      'Cambiar idioma',
    );
  });

  it('calls setLanguage with "en" when clicked from Spanish', async () => {
    const u = userEvent.setup();
    render(<LanguageToggle />);

    await u.click(screen.getByTestId('language-toggle'));
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });
});
