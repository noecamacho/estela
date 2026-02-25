import { useLanguage } from '../context/LanguageContext';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLanguage();

  return (
    <div
      data-testid="confirm-dialog-backdrop"
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        data-testid="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        className="dialog-panel w-full max-w-xs rounded-lg border border-border bg-bg-elevated p-6"
      >
        <p
          data-testid="confirm-dialog-message"
          className="mb-5 text-sm leading-relaxed text-fg"
        >
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            data-testid="confirm-dialog-cancel"
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-border bg-transparent px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-fg-muted transition-colors duration-200 hover:border-border-bold hover:text-fg"
          >
            {t.common.cancel}
          </button>
          <button
            data-testid="confirm-dialog-confirm"
            onClick={onConfirm}
            className="cursor-pointer rounded-full border border-danger/30 bg-danger/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-danger transition-colors duration-200 hover:bg-danger/20"
          >
            {t.common.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
