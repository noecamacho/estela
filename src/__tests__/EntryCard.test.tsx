import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EntryCard } from '../components/EntryCard';

describe('EntryCard', () => {
  it('renders title', () => {
    render(
      <EntryCard title="Test Title">
        <p>Content</p>
      </EntryCard>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <EntryCard title="Title" subtitle="Subtitle text">
        <p>Content</p>
      </EntryCard>,
    );
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('renders badge when provided', () => {
    render(
      <EntryCard title="Title" badge={<span>Badge</span>}>
        <p>Content</p>
      </EntryCard>,
    );
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('starts collapsed by default', () => {
    render(
      <EntryCard title="Title">
        <p>Hidden content</p>
      </EntryCard>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('starts expanded when defaultExpanded is true', () => {
    render(
      <EntryCard title="Title" defaultExpanded>
        <p>Visible content</p>
      </EntryCard>,
    );
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('expands when toggle is clicked', async () => {
    const u = userEvent.setup();
    render(
      <EntryCard title="Title">
        <p>Toggle content</p>
      </EntryCard>,
    );

    expect(screen.queryByText('Toggle content')).not.toBeInTheDocument();
    await u.click(screen.getByTestId('entry-card-toggle'));
    expect(screen.getByText('Toggle content')).toBeInTheDocument();
  });

  it('collapses when toggle is clicked again', async () => {
    const u = userEvent.setup();
    render(
      <EntryCard title="Title" defaultExpanded>
        <p>Collapsible</p>
      </EntryCard>,
    );

    expect(screen.getByText('Collapsible')).toBeInTheDocument();
    await u.click(screen.getByTestId('entry-card-toggle'));
    expect(screen.queryByText('Collapsible')).not.toBeInTheDocument();
  });

  it('applies stagger animation index', () => {
    render(
      <EntryCard title="Title" index={3}>
        <p>Content</p>
      </EntryCard>,
    );
    const card = screen.getByTestId('entry-card');
    expect(card.style.getPropertyValue('--i')).toBe('3');
  });
});
