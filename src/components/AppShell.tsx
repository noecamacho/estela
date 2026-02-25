import { useAuth } from '../context/AuthContext';
import { ExerciseTabs } from './ExerciseTabs';
import { ThemeToggle } from './ThemeToggle';

export function AppShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-bg">
      {/* Marquee ticker — full width, Fyrre-style */}
      <div className="overflow-hidden bg-ticker-bg">
        <div className="marquee-track py-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-8 px-4 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-ticker-fg"
            >
              <span>✦ Dos Banderas</span>
              <span>✦ Mi Mama</span>
              <span>✦ El Hombre Ideal</span>
              <span>✦ Diario de Proceso</span>
            </span>
          ))}
        </div>
      </div>

      {/* Centered content container */}
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Header */}
        <header className="pt-6 pb-5">
          <div className="flex items-start justify-between">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-semibold uppercase tracking-[0.1em] text-fg sm:text-3xl">
                Estela
              </h1>
              <p className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-fg-subtle">
                Ejercicios de Hamid — Sesion 3
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-8 w-8 rounded-full ring-1 ring-border"
                />
              )}
              <button
                onClick={signOut}
                className="hover-line cursor-pointer bg-transparent px-1 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-fg-subtle transition-colors hover:text-fg"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Bold separator — Fyrre style */}
          <div className="mt-5 border-t border-border-bold" />
        </header>

        <ExerciseTabs />
      </div>
    </div>
  );
}
