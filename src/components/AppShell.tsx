import { useAuth } from '../context/AuthContext';
import { ExerciseTabs } from './ExerciseTabs';

export function AppShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-surface font-serif text-warm-300">
      {/* Marquee ticker */}
      <div className="overflow-hidden border-b border-warm-800 bg-warm-900/60">
        <div className="marquee-track py-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-8 px-4 text-[0.6rem] uppercase tracking-[0.25em] text-warm-600"
            >
              <span>✦ Dos Banderas</span>
              <span>✦ Mi Mama</span>
              <span>✦ El Hombre Ideal</span>
              <span>✦ Diario de Proceso</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="px-5 pt-6 pb-5 sm:px-8">
        <div className="flex items-start justify-between">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-light uppercase tracking-[0.15em] text-warm-100 sm:text-3xl">
              Estela
            </h1>
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-warm-600">
              Ejercicios de Hamid — Sesion 3
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="h-8 w-8 rounded-full ring-1 ring-warm-700"
              />
            )}
            <button
              onClick={signOut}
              className="hover-line cursor-pointer bg-transparent px-1 py-0.5 font-serif text-[0.65rem] uppercase tracking-wider text-warm-500 transition-colors hover:text-warm-300"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Bold separator */}
        <div className="mt-5 h-px bg-warm-500/20" />
      </header>

      <ExerciseTabs />
    </div>
  );
}
