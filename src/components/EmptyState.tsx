interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="animate-fade-in mt-12 text-center">
      <div className="mx-auto mb-4 h-px w-12 bg-border" />
      <p className="font-serif text-sm italic leading-relaxed text-fg-subtle">
        {message}
      </p>
    </div>
  );
}
