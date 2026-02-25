import { useState } from 'react';
import { flushSync } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import { DosBanderas } from './DosBanderas';
import { FreeformExercise } from './FreeformExercise';

export function ExerciseTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useLanguage();

  const tabs = [
    { label: t.exercises.exercise1.name, icon: t.exercises.exercise1.icon },
    { label: t.exercises.exercise2.name, icon: t.exercises.exercise2.icon },
    { label: t.exercises.exercise3.name, icon: t.exercises.exercise3.icon },
  ];

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
      <div className="flex border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabChange(i)}
            className={`relative flex flex-1 cursor-pointer flex-col items-center gap-1 bg-transparent px-2 py-3.5 text-[0.72rem] font-medium uppercase tracking-wider transition-colors duration-200 ${
              activeTab === i ? 'text-fg' : 'text-fg-subtle hover:text-fg-muted'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {activeTab === i && <span className="tab-active-line" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content pt-8 pb-24">
        {activeTab === 0 && <DosBanderas />}

        {activeTab === 1 && (
          <FreeformExercise
            exerciseKey="ejercicio2"
            description={t.exercises.exercise2.description}
            questions={t.exercises.exercise2.questions}
            addLabel={t.exercises.exercise2.addLabel}
            emptyMessage={t.exercises.exercise2.emptyMessage}
          />
        )}

        {activeTab === 2 && (
          <FreeformExercise
            exerciseKey="ejercicio3"
            description={t.exercises.exercise3.description}
            questions={t.exercises.exercise3.questions}
            addLabel={t.exercises.exercise3.addLabel}
            emptyMessage={t.exercises.exercise3.emptyMessage}
          />
        )}
      </div>
    </div>
  );
}
