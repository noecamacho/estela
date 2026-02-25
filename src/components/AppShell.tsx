import { useAuth } from '../context/AuthContext';
import { ExerciseTabs } from './ExerciseTabs';

export function AppShell() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-surface font-serif text-warm-300">
      <header className="border-b border-warm-800 bg-gradient-to-b from-warm-800/20 to-transparent px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-warm-600">
              Ejercicios de Hamid — Sesion 3
            </p>
            <h1 className="text-2xl font-light text-warm-100">
              Diario de Proceso
            </h1>
            <p className="text-xs italic text-warm-600">
              Tu espacio para registrar, reflexionar y crecer
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt=""
                className="h-7 w-7 rounded-full"
              />
            )}
            <button
              onClick={signOut}
              className="cursor-pointer rounded border border-warm-700 bg-transparent px-2 py-1 font-serif text-[0.65rem] text-warm-500 transition-colors hover:text-warm-300"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <ExerciseTabs />
    </div>
  );
}
