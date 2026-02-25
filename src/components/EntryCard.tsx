import { useState, type ReactNode } from 'react';

interface EntryCardProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
  index?: number;
}

export function EntryCard({
  title,
  subtitle,
  badge,
  children,
  defaultExpanded = false,
  index = 0,
}: EntryCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className="entry-card animate-stagger mb-4 overflow-hidden rounded border border-border bg-bg-elevated"
      style={{ '--i': index } as React.CSSProperties}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3.5 text-left transition-colors duration-200 hover:bg-accent-muted"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`shrink-0 text-fg-subtle transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{title}</p>
            {subtitle && (
              <p className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-fg-subtle">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badge && <div className="ml-2 shrink-0">{badge}</div>}
      </button>

      {expanded && (
        <div className="animate-entry-expand border-t border-border px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
