import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '../components/ConfirmDialog';

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    setLanguage: vi.fn(),
    t: {
      common: { cancel: 'Cancelar', delete: 'Eliminar' },
    },
  }),
}));

describe('ConfirmDialog', () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  function renderDialog() {
    return render(
      <ConfirmDialog
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
  }

  it('renders the confirmation message', () => {
    renderDialog();
    expect(screen.getByTestId('confirm-dialog-message')).toHaveTextContent(
      'Are you sure?',
    );
  });

  it('renders cancel and confirm buttons', () => {
    renderDialog();
    expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent(
      'Cancelar',
    );
    expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent(
      'Eliminar',
    );
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const u = userEvent.setup();
    renderDialog();
    await u.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const u = userEvent.setup();
    renderDialog();
    await u.click(screen.getByTestId('confirm-dialog-cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('calls onCancel when backdrop is clicked', async () => {
    const u = userEvent.setup();
    renderDialog();
    await u.click(screen.getByTestId('confirm-dialog-backdrop'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('does not call onCancel when dialog panel is clicked', async () => {
    const u = userEvent.setup();
    onCancel.mockClear();
    renderDialog();
    await u.click(screen.getByTestId('confirm-dialog'));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
