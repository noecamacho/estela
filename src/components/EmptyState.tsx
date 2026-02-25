interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p className="mt-8 text-center text-sm italic text-warm-600">{message}</p>
  );
}
