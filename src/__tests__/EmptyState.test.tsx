import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: vi.fn(),
    t: {
      messages: { noHurry: 'Sin prisa, sin presion' },
    },
  }),
}));

describe('EmptyState', () => {
  it('renders the provided message', () => {
    render(<EmptyState message="No entries yet" />);
    expect(screen.getByText('No entries yet')).toBeInTheDocument();
  });

  it('renders the motivational subtitle', () => {
    render(<EmptyState message="Empty" />);
    expect(screen.getByText('Sin prisa, sin presion')).toBeInTheDocument();
  });

  it('has the empty-state test id', () => {
    render(<EmptyState message="Empty" />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
