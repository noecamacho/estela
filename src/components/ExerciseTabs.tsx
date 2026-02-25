import { useState } from 'react';
import { DosBanderas } from './DosBanderas';
import { FreeformExercise } from './FreeformExercise';

const tabs = [
  { label: 'Dos Banderas', icon: '🏴' },
  { label: 'Mi Mama', icon: '🕊' },
  { label: 'El Hombre Ideal', icon: '🪞' },
];

export function ExerciseTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex border-b border-warm-800">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-0.5 border-b-2 bg-transparent px-2 py-3 font-serif text-[0.72rem] transition-all ${
              activeTab === i
                ? 'border-warm-400 bg-warm-800/30 text-warm-200'
                : 'border-transparent text-warm-600 hover:text-warm-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 pb-24">
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
