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
  return (
    <div
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-panel w-full max-w-xs rounded-lg border border-border bg-bg-elevated p-6"
      >
        <p className="mb-5 text-sm leading-relaxed text-fg">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-border bg-transparent px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-fg-muted transition-colors duration-200 hover:border-border-bold hover:text-fg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-full border border-danger/30 bg-danger/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-danger transition-colors duration-200 hover:bg-danger/20"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
