import { useState, type ReactNode } from 'react';

interface EntryCardProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function EntryCard({
  title,
  subtitle,
  badge,
  children,
  defaultExpanded = false,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-warm-800 bg-warm-900/40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent p-3 text-left transition-colors hover:bg-warm-800/30"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`shrink-0 text-warm-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <div className="min-w-0">
            <p className="truncate text-sm text-warm-300">{title}</p>
            {subtitle && (
              <p className="mt-0.5 text-[0.62rem] text-warm-600">{subtitle}</p>
            )}
          </div>
        </div>
        {badge && <div className="ml-2 shrink-0">{badge}</div>}
      </button>

      {expanded && (
        <div className="border-t border-warm-800 p-3">{children}</div>
      )}
    </div>
  );
}
