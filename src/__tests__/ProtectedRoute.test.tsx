import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

let mockUser: { uid: string } | null = null;
let mockLoading = false;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: mockLoading,
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}));

beforeEach(() => {
  mockUser = null;
  mockLoading = false;
});

describe('ProtectedRoute', () => {
  it('shows loading screen while auth is resolving', () => {
    mockLoading = true;
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    mockUser = { uid: 'test-uid' };
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>,
    );
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
