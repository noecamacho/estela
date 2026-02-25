import { useLanguage } from '../context/LanguageContext';

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div
      data-testid="empty-state"
      className="animate-fade-in mt-16 flex flex-col items-center text-center"
    >
      {/* Decorative element */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-4 text-border-bold/30"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
      <p className="max-w-xs font-serif text-sm italic leading-relaxed text-fg-subtle">
        {message}
      </p>
      <p className="mt-2 text-[0.6rem] uppercase tracking-widest text-fg-subtle/50">
        {t.messages.noHurry}
      </p>
    </div>
  );
}
