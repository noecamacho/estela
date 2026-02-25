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
      className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="dialog-panel w-full max-w-xs rounded-xl border border-warm-700 bg-warm-900 p-6"
      >
        <p className="mb-5 text-sm leading-relaxed text-warm-200">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-full border border-warm-700 bg-transparent px-4 py-1.5 font-serif text-xs uppercase tracking-wider text-warm-400 transition-colors duration-200 hover:border-warm-600 hover:text-warm-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-full border border-red-800/40 bg-red-900/20 px-4 py-1.5 font-serif text-xs uppercase tracking-wider text-red-300 transition-colors duration-200 hover:bg-red-900/40"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
