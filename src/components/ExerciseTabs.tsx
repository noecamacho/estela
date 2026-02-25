import { useState } from 'react';
import { flushSync } from 'react-dom';
import { DosBanderas } from './DosBanderas';
import { FreeformExercise } from './FreeformExercise';

const tabs = [
  { label: 'Dos Banderas', icon: '🏴' },
  { label: 'Mi Mama', icon: '🕊' },
  { label: 'El Hombre Ideal', icon: '🪞' },
];

export function ExerciseTabs() {
  const [activeTab, setActiveTab] = useState(0);

  function handleTabChange(index: number) {
    if (index === activeTab) return;

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => setActiveTab(index));
      });
    } else {
      setActiveTab(index);
    }
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-warm-800 px-2 sm:px-6">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            className={`relative flex flex-1 cursor-pointer flex-col items-center gap-1 bg-transparent px-2 py-3.5 font-serif text-[0.72rem] uppercase tracking-wider transition-colors duration-200 ${
              activeTab === i
                ? 'text-warm-200'
                : 'text-warm-600 hover:text-warm-400'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === i && <span className="tab-active-line" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content px-5 pt-6 pb-24 sm:px-8">
        {activeTab === 0 && <DosBanderas />}

        {activeTab === 1 && (
          <FreeformExercise
            exerciseKey="ejercicio2"
            description="Escribe sobre la epoca con tu mama antes de que se acumulara la desilucion. Recupera el deseo original de conexion."
            questions="¿Cual es tu primer recuerdo de sentirte cerca de ella? ¿Que esperabas? ¿Cuando empezo a cambiar? ¿Ves algo de lo que querias de ella en lo que buscaste en Maredy?"
            addLabel="Nueva entrada"
            emptyMessage="Cuando estes listo, crea tu primera entrada. Sin prisa."
          />
        )}

        {activeTab === 2 && (
          <FreeformExercise
            exerciseKey="ejercicio3"
            description='Corporaliza el "hombre ideal" que Maredy queria. Si existiera como persona real y lo conocieras, ¿seria de tu primer circulo de confianza?'
            questions="¿Que esperaba ella de un hombre? ¿Que te criticaba? Describelo como persona real. ¿Te caeria bien? ¿De que se enamoro ella realmente: de ti surfeando la ola, o de la version que se adaptaba?"
            addLabel="Nueva reflexion"
            emptyMessage="Cuando estes listo, empieza tu primera reflexion."
          />
        )}
      </div>
    </div>
  );
}
