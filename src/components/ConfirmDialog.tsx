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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs rounded-xl border border-warm-700 bg-warm-900 p-5"
      >
        <p className="mb-4 text-sm leading-relaxed text-warm-200">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-warm-700 bg-warm-800/50 px-3 py-1.5 font-serif text-xs text-warm-300 transition-colors hover:bg-warm-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-md border border-red-800/40 bg-red-900/30 px-3 py-1.5 font-serif text-xs text-red-300 transition-colors hover:bg-red-900/50"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
